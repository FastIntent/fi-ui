import React, { forwardRef } from 'react';
import RcUpload from '@rc-component/upload';
import type { UploadProps as RcUploadProps } from '@rc-component/upload';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { ImgCrop, ImgCropProps } from './ImgCrop';
import { UploadList } from './UploadList';
import defaultLocale from '../locale/en_US';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Estado de un archivo en el proceso de subida.
 */
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

/**
 * Representación de un archivo en la lista de subida.
 */
export interface UploadFile<T = unknown> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File;
  response?: T;
  error?: unknown;
  linkProps?: React.HTMLProps<HTMLAnchorElement>;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface UploadChangeParam<T = UploadFile> {
  file: T;
  fileList: T[];
  event?: { percent: number };
}

/**
 * Propiedades del componente Upload para gestionar subida de archivos.
 * Basado en rc-upload con capacidades extendidas de UI y recorte.
 */
export interface UploadProps extends Omit<RcUploadProps, 'onChange'> {
  /**
   * Tipo visual y de interacción del componente.
   * 'select' muestra un disparador normal, 'drag' habilita un área de arrastre (Dropzone).
   * @default 'select'
   */
  type?: 'select' | 'drag';

  /**
   * Lista inicial de archivos para mostrar (modo no controlado).
   */
  defaultFileList?: UploadFile[];

  /**
   * Lista actual de archivos que se muestran en el componente (modo controlado).
   * Cada archivo debe tener un `uid` único.
   */
  fileList?: UploadFile[];

  /**
   * Estilo visual de la lista de previsualización.
   * 'text': lista de nombres simple.
   * 'picture': lista con iconos de imagen pequeños.
   * 'picture-card' / 'picture-circle': cuadrícula de miniaturas para galerías o avatars.
   * @default 'text'
   */
  listType?: 'text' | 'picture' | 'picture-card' | 'picture-circle';

  /**
   * Nombre del parámetro que se envía al servidor con el archivo.
   * @default 'file'
   */
  name?: string;

  /**
   * Determina si se debe renderizar automáticamente la lista de archivos subidos.
   * @default true
   */
  showUploadList?: boolean;

  /**
   * Clases CSS adicionales para personalizar el contenedor principal.
   */
  className?: string;

  /**
   * Estilos CSS en línea para ajustes puntuales de diseño.
   */
  style?: React.CSSProperties;

  /**
   * Función que se dispara cada vez que cambia el estado de la subida
   * (inicio, progreso, éxito o error).
   */
  onChange?: (info: UploadChangeParam) => void;

  /**
   * Configuración para habilitar el recorte de imágenes antes de la subida.
   * Si se define, intercepta el flujo de subida para abrir un modal de edición.
   */
  cropProps?: Omit<ImgCropProps, 'children'>;
}

function InternalUpload(
  props: UploadProps,
  ref: React.ForwardedRef<React.ElementRef<typeof RcUpload>>
) {
  const {
    className,
    type = 'select',
    listType = 'text',
    showUploadList = true,
    children,
    defaultFileList,
    fileList,
    onChange,
    cropProps,
    ...rest
  } = props;

  const { locale: contextLocale } = useConfig();
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('upload') || getDefaultPrefixCls('upload');
  const uploadLocale = contextLocale?.Upload || defaultLocale.Upload!;

  const [mergedFileList, setMergedFileList] = React.useState<UploadFile[]>(
    fileList || defaultFileList || []
  );

  React.useEffect(() => {
    if (fileList) {
      setMergedFileList(fileList);
    }
  }, [fileList]);

  const handleRemove = (file: UploadFile) => {
    const nextFileList = mergedFileList.filter((f) => f.uid !== file.uid);
    setMergedFileList(nextFileList);
    onChange?.({
      file,
      fileList: nextFileList,
    });
  };

  const handleInternalChange = (info: UploadChangeParam) => {
    const nextFileList = [...mergedFileList];
    const uploadFile: UploadFile = {
      ...info.file,
      uid: (info.file as UploadFile).uid || `upload-${Date.now()}`,
      status: info.file.status ?? 'done',
    };

    const index = nextFileList.findIndex((f) => f.uid === uploadFile.uid);
    if (index > -1) {
      nextFileList[index] = uploadFile;
    } else {
      nextFileList.push(uploadFile);
    }

    if (!fileList) {
      setMergedFileList(nextFileList);
    }

    onChange?.({
      file: uploadFile,
      fileList: nextFileList,
    });
  };

  const uploadCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-select`]: type === 'select',
      [`${prefixCls}-drag`]: type === 'drag',
      [`${prefixCls}-picture-card`]: listType === 'picture-card',
      [`${prefixCls}-picture-circle`]: listType === 'picture-circle',
    },
    className
  );

  const rcUploadProps: RcUploadProps = {
    ...rest,
    prefixCls,
    className: uploadCls,
    onSuccess: (response, file) => {
      handleInternalChange({
        file: {
          ...file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'done',
          response,
        } as unknown as UploadFile,
        fileList: mergedFileList,
      });
    },
    onError: (error, response, file) => {
      handleInternalChange({
        file: {
          ...file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          response,
          error,
        } as unknown as UploadFile,
        fileList: mergedFileList,
      });
    },
  };

  const getRcUpload = () => {
    if (type === 'drag') {
      return (
        <RcUpload {...rcUploadProps} ref={ref} component="div">
          <div className={`${prefixCls}-btn`}>
            {children || (
              <>
                <p className={`${prefixCls}-drag-icon`}>
                  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                    <path d="M885.2 446.3l-57.8-231.2c-5.9-23.8-24.3-43.1-47.4-49.1L512 96 244 165.9c-23.1 6-41.5 25.3-47.4 49.1l-57.8 231.2C112.9 469.4 112 494.8 112 520v360c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-25.2-.9-50.6-26.8-73.7zM400 596h224v34c0 26.5-21.5 48-48 48h-128c-26.5 0-48-21.5-48-48v-34zM848 840H176V520c0-19.2.7-38.6 20.3-56.1C203.4 457.4 213 451.9 225 448.5L276 312c5.9-23.8 24.3-43.1 47.4-49.1L512 196.1l188.6 49.8c23.1 6 41.5 25.3 47.4 49.1l51 136.5c12 3.4 21.6 8.9 28.7 15.4C847.3 481.4 848 500.8 848 520v320z"></path>
                  </svg>
                </p>
                <p className={`${prefixCls}-drag-text`}>{uploadLocale.dragText}</p>
                <p className={`${prefixCls}-drag-hint`}>{uploadLocale.dragHint}</p>
              </>
            )}
          </div>
        </RcUpload>
      );
    }
    return (
      <RcUpload {...rcUploadProps} ref={ref}>
        {children}
      </RcUpload>
    );
  };

  const uploadNode = cropProps ? <ImgCrop {...cropProps}>{getRcUpload()}</ImgCrop> : getRcUpload();

  const listNode = showUploadList ? (
    <UploadList
      items={mergedFileList}
      listType={listType}
      onRemove={handleRemove}
      prefixCls={`${prefixCls}-list`}
    />
  ) : null;

  const isPictureCard = listType === 'picture-card' || listType === 'picture-circle';

  return (
    <div
      className={classNames(`${prefixCls}-container`, {
        [`${prefixCls}-picture-card-wrapper`]: isPictureCard,
      })}
    >
      {isPictureCard ? (
        <>
          {listNode}
          {uploadNode}
        </>
      ) : (
        <>
          {uploadNode}
          {listNode}
        </>
      )}
    </div>
  );
}

const Upload = forwardRef(InternalUpload) as unknown as React.ForwardRefExoticComponent<
  UploadProps & React.RefAttributes<React.ElementRef<typeof RcUpload>>
> & {
  Dragger: React.FC<UploadProps>;
};

Upload.Dragger = (props: UploadProps) => <Upload {...props} type="drag" />;
Upload.displayName = 'Upload';

export { Upload };
