import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Slider } from '../Slider';
import { usePrefixCls } from '../ConfigProvider';

// ─── Constantes ────────────────────────────────────────────────────────────────
const ZOOM_INITIAL = 1;
const ZOOM_STEP = 0.1;
const ROTATION_INITIAL = 0;
const ROTATION_MIN = -180;
const ROTATION_MAX = 180;
const ROTATION_STEP = 1;

// ─── Tipos ──────────────────────────────────────────────────────────────────────
type BeforeUploadReturnType = boolean | File | Blob | string | void;
type BeforeUpload = (
  file: File,
  fileList: File[]
) => BeforeUploadReturnType | Promise<BeforeUploadReturnType>;

interface EasyCropRef {
  rotation: number;
  cropPixelsRef: React.MutableRefObject<Area>;
  onReset: () => void;
}

interface EasyCropProps {
  prefixCls: string;
  zoomSlider: boolean;
  rotationSlider: boolean;
  showReset: boolean;
  resetBtnText?: string;
  modalImage: string;
  aspect: number;
  minZoom: number;
  maxZoom: number;
  cropShape: 'rect' | 'round';
  showGrid: boolean;
}

/**
 * Propiedades para el componente de recorte de imagen (ImgCrop).
 * Permite interceptar la subida para realizar ajustes visuales previos.
 */
export interface ImgCropProps {
  /**
   * Calidad de la imagen resultante tras el recorte (entre 0 y 1).
   * @default 0.4
   */
  quality?: number;

  /**
   * Color de fondo para las áreas no cubiertas por la imagen si se escala.
   * @default 'white'
   */
  fillColor?: string;

  /**
   * Habilita el control deslizante para ajustar el zoom.
   * @default true
   */
  zoomSlider?: boolean;

  /**
   * Habilita el control deslizante para rotar la imagen (-180 a 180°).
   * @default false
   */
  rotationSlider?: boolean;

  /**
   * Muestra un botón de reinicio en el modal para volver al estado inicial.
   * @default false
   */
  showReset?: boolean;

  /**
   * Texto del botón de reinicio.
   */
  resetText?: string;

  /**
   * Relación de aspecto del área de recorte (ej: 1 para cuadrado, 16/9 para panorámico).
   * @default 1
   */
  aspect?: number;

  /**
   * Nivel de zoom mínimo permitido.
   * @default 1
   */
  minZoom?: number;

  /**
   * Nivel de zoom máximo permitido.
   * @default 3
   */
  maxZoom?: number;

  /**
   * Forma del área de recorte.
   * 'rect' para rectángulo/cuadrado, 'round' para círculo.
   * @default 'rect'
   */
  cropShape?: 'rect' | 'round';

  /**
   * Muestra una cuadrícula de guía (regla de los tercios) sobre el área de recorte.
   * @default false
   */
  showGrid?: boolean;

  /**
   * Título que se mostrará en la cabecera del modal de recorte.
   * @default 'Edit image'
   */
  modalTitle?: string;

  /**
   * Ancho del modal de recorte (ej: 600, '80%').
   * @default 520
   */
  modalWidth?: number | string;

  /**
   * Texto del botón de confirmación.
   * @default 'OK'
   */
  modalOk?: string;

  /**
   * Texto del botón de cancelación.
   * @default 'Cancel'
   */
  modalCancel?: string;

  /**
   * Elemento hijo (normalmente un componente Upload) que disparará el recorte.
   */
  children: React.ReactElement;

  /**
   * Callback ejecutado cuando el usuario confirma el recorte.
   * Recibe el archivo resultante.
   */
  onModalOk?: (file: BeforeUploadReturnType) => void;

  /**
   * Callback ejecutado si el usuario cancela la operación de recorte.
   */
  onModalCancel?: () => void;

  /**
   * Función que se ejecuta antes de abrir el modal de recorte.
   * Retornar false evita que se abra el modal.
   */
  beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
}

// ─── EasyCrop (sub-componente interno) ─────────────────────────────────────────
const EasyCrop = forwardRef<EasyCropRef, EasyCropProps>((props, ref) => {
  const {
    prefixCls,
    zoomSlider,
    rotationSlider,
    showReset,
    resetBtnText,
    modalImage,
    aspect,
    minZoom,
    maxZoom,
    cropShape,
    showGrid,
  } = props;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(ZOOM_INITIAL);
  const [rotation, setRotation] = useState(ROTATION_INITIAL);

  const cropPixelsRef = useRef<Area>({ width: 0, height: 0, x: 0, y: 0 });

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    cropPixelsRef.current = croppedAreaPixels;
  }, []);

  const isResetActive = zoom !== ZOOM_INITIAL || rotation !== ROTATION_INITIAL;

  const onReset = () => {
    setZoom(ZOOM_INITIAL);
    setRotation(ROTATION_INITIAL);
    setCrop({ x: 0, y: 0 });
  };

  useImperativeHandle(ref, () => ({
    rotation,
    cropPixelsRef,
    onReset,
  }));

  return (
    <>
      <Cropper
        image={modalImage}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        minZoom={minZoom}
        maxZoom={maxZoom}
        cropShape={cropShape}
        showGrid={showGrid}
        zoomWithScroll={zoomSlider}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
        onCropComplete={onCropComplete}
        classes={{
          containerClassName: `${prefixCls}-container`,
          mediaClassName: `${prefixCls}-media`,
        }}
      />

      <div className={`${prefixCls}-controls`}>
        {zoomSlider && (
          <div className={`${prefixCls}-control`}>
            <button
              className={`${prefixCls}-control-btn`}
              onClick={() => setZoom(+(zoom - ZOOM_STEP).toFixed(1))}
              disabled={zoom - ZOOM_STEP < minZoom}
              title="Zoom out"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <Slider
              className={`${prefixCls}-slider`}
              min={minZoom}
              max={maxZoom}
              step={ZOOM_STEP}
              value={zoom}
              onChange={(v) => setZoom(v as number)}
            />
            <button
              className={`${prefixCls}-control-btn`}
              onClick={() => setZoom(+(zoom + ZOOM_STEP).toFixed(1))}
              disabled={zoom + ZOOM_STEP > maxZoom}
              title="Zoom in"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
        )}

        {rotationSlider && (
          <div className={`${prefixCls}-control`}>
            <button
              className={`${prefixCls}-control-btn`}
              onClick={() => setRotation(rotation - ROTATION_STEP)}
              disabled={rotation <= ROTATION_MIN}
              title="Rotate left"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <Slider
              className={`${prefixCls}-slider`}
              min={ROTATION_MIN}
              max={ROTATION_MAX}
              step={ROTATION_STEP}
              value={rotation}
              onChange={(v) => setRotation(v as number)}
            />
            <button
              className={`${prefixCls}-control-btn`}
              onClick={() => setRotation(rotation + ROTATION_STEP)}
              disabled={rotation >= ROTATION_MAX}
              title="Rotate right"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
              </svg>
            </button>
          </div>
        )}

        {showReset && (zoomSlider || rotationSlider) && (
          <Button
            className={`${prefixCls}-reset-btn`}
            style={isResetActive ? {} : { opacity: 0.3, pointerEvents: 'none' }}
            onClick={onReset}
          >
            {resetBtnText || 'Reset'}
          </Button>
        )}
      </div>
    </>
  );
});

EasyCrop.displayName = 'EasyCrop';

// ─── ImgCrop (componente principal) ────────────────────────────────────────────
export const ImgCrop: React.FC<ImgCropProps> = (props) => {
  const {
    quality = 0.4,
    fillColor = 'white',
    zoomSlider = true,
    rotationSlider = false,
    showReset = false,
    resetText,
    aspect = 1,
    minZoom = 1,
    maxZoom = 3,
    cropShape = 'rect',
    showGrid = false,
    modalTitle,
    modalWidth = 520,
    modalOk,
    modalCancel,
    onModalOk,
    onModalCancel,
    beforeCrop,
    children,
  } = props;
  const prefixCls = usePrefixCls('easy-crop');

  // Guardamos callbacks en ref para evitar closures stale
  const cb = useRef<Pick<ImgCropProps, 'onModalOk' | 'onModalCancel' | 'beforeCrop'>>({});
  cb.current.onModalOk = onModalOk;
  cb.current.onModalCancel = onModalCancel;
  cb.current.beforeCrop = beforeCrop;

  const easyCropRef = useRef<EasyCropRef>(null);

  // ─── Lógica de recorte en canvas ───────────────────────────────────────────
  const getCropCanvas = useCallback(
    (target: EventTarget | null) => {
      const context = ((target as ShadowRoot)?.getRootNode?.() as ShadowRoot) || document;
      const imgSource = context.querySelector(`.${prefixCls}-media`) as HTMLImageElement & {
        naturalWidth: number;
        naturalHeight: number;
      };

      const {
        width: cropWidth,
        height: cropHeight,
        x: cropX,
        y: cropY,
      } = easyCropRef.current!.cropPixelsRef.current;

      if (rotationSlider && easyCropRef.current!.rotation !== ROTATION_INITIAL) {
        const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imgSource;
        const angle = easyCropRef.current!.rotation * (Math.PI / 180);
        const sine = Math.abs(Math.sin(angle));
        const cosine = Math.abs(Math.cos(angle));
        const squareWidth = imgWidth * cosine + imgHeight * sine;
        const squareHeight = imgHeight * cosine + imgWidth * sine;

        // Step 1: dibujar la imagen rotada en un canvas auxiliar
        const rotCanvas = document.createElement('canvas');
        const rotCtx = rotCanvas.getContext('2d') as CanvasRenderingContext2D;
        rotCanvas.width = squareWidth;
        rotCanvas.height = squareHeight;
        rotCtx.fillStyle = fillColor;
        rotCtx.fillRect(0, 0, squareWidth, squareHeight);

        const squareHalfWidth = squareWidth / 2;
        const squareHalfHeight = squareHeight / 2;
        rotCtx.translate(squareHalfWidth, squareHalfHeight);
        rotCtx.rotate(angle);
        rotCtx.translate(-squareHalfWidth, -squareHalfHeight);

        const imgX = (squareWidth - imgWidth) / 2;
        const imgY = (squareHeight - imgHeight) / 2;
        rotCtx.drawImage(imgSource, 0, 0, imgWidth, imgHeight, imgX, imgY, imgWidth, imgHeight);

        // Step 2: recortar la región deseada del canvas rotado
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d') as CanvasRenderingContext2D;
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        cropCtx.drawImage(
          rotCanvas,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        return cropCanvas;
      } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, cropWidth, cropHeight);
        ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        return canvas;
      }
    },
    [fillColor, prefixCls, rotationSlider]
  );

  // ─── Estado del modal ──────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  // cropperKey se incrementa después de la animación de apertura del Modal (~300ms).
  // Esto fuerza el remount de EasyCrop cuando el container ya tiene sus dimensiones
  // reales, evitando que getBoundingClientRect() retorne 0 durante la animación.
  const [cropperKey, setCropperKey] = useState(0);

  const onCancelRef = useRef<() => void>(() => {});
  const onOkRef = useRef<(e: React.MouseEvent<HTMLElement>) => void>(() => {});

  // Cuando el modal se abre, esperar a que termine la animación de zoom (~300ms)
  // antes de montar el Cropper para que getBoundingClientRect() sea correcto.
  React.useEffect(() => {
    if (!modalOpen) return;
    const timer = setTimeout(() => setCropperKey((k) => k + 1), 350);
    return () => clearTimeout(timer);
  }, [modalOpen]);

  // ─── Interceptación de beforeUpload ───────────────────────────────────────
  const runBeforeUpload = useCallback(
    async ({
      beforeUpload,
      file,
      resolve,
      reject,
    }: {
      beforeUpload: BeforeUpload | undefined;
      file: File;
      resolve: (file: BeforeUploadReturnType) => void;
      reject: (err: BeforeUploadReturnType) => void;
    }) => {
      if (typeof beforeUpload !== 'function') {
        resolve(file);
        return;
      }
      try {
        const result = await beforeUpload(file, [file]);
        if (result === false) {
          resolve(false);
        } else {
          resolve((result !== true && result) || file);
        }
      } catch (err) {
        reject(err as BeforeUploadReturnType);
      }
    },
    []
  );

  const getNewBeforeUpload = useCallback(
    (beforeUpload: BeforeUpload | undefined) => {
      return (file: File, fileList: File[]): Promise<BeforeUploadReturnType> => {
        return new Promise(async (resolve, reject) => {
          const processedFile = file;

          if (typeof cb.current.beforeCrop === 'function') {
            try {
              const result = await cb.current.beforeCrop(file, fileList);
              if (result === false) {
                return runBeforeUpload({ beforeUpload, file, resolve, reject });
              }
            } catch {
              return runBeforeUpload({ beforeUpload, file, resolve, reject });
            }
          }

          // Leer el archivo y abrir el modal.
          // CRÍTICO: setModalImage ANTES de setModalOpen para que la imagen esté
          // disponible cuando el Cropper se monte (después de afterOpenChange).
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            if (typeof reader.result === 'string') {
              setModalImage(reader.result as string);
              setModalOpen(true);
            }
          });
          reader.readAsDataURL(processedFile);

          // Cancelar
          onCancelRef.current = () => {
            setModalOpen(false);
            setModalImage('');
            setCropperKey(0);
            easyCropRef.current!.onReset();
            cb.current.onModalCancel?.();
            resolve(false);
          };

          // Confirmar
          onOkRef.current = async (event: React.MouseEvent<HTMLElement>) => {
            setModalOpen(false);
            setModalImage('');
            setCropperKey(0);
            easyCropRef.current!.onReset();

            const canvas = getCropCanvas(event.target);
            const { type, name } = processedFile;
            const uid = (processedFile as File & { uid?: string }).uid;

            canvas.toBlob(
              async (blob) => {
                const newFile = new File([blob as BlobPart], name, { type });
                Object.assign(newFile, { uid });
                runBeforeUpload({
                  beforeUpload,
                  file: newFile,
                  resolve: (file) => {
                    resolve(file);
                    cb.current.onModalOk?.(file);
                  },
                  reject: (err) => {
                    reject(err);
                    cb.current.onModalOk?.(err);
                  },
                });
              },
              type,
              quality
            );
          };
        });
      };
    },
    [getCropCanvas, quality, runBeforeUpload]
  );

  // ─── Clonar el hijo con el nuevo beforeUpload ──────────────────────────────
  const newUploadChildren = useMemo(() => {
    const upload = Array.isArray(children) ? (children as React.ReactElement[])[0] : children;
    const { beforeUpload, accept, ...restProps } = (
      upload as React.ReactElement<{ beforeUpload?: BeforeUpload; accept?: string }>
    ).props;

    return React.cloneElement(
      upload as React.ReactElement<{ accept?: string; beforeUpload?: BeforeUpload }>,
      {
        ...restProps,
        accept: accept || 'image/*',
        beforeUpload: getNewBeforeUpload(beforeUpload),
      }
    );
  }, [children, getNewBeforeUpload]);

  // ─── Footer del modal ──────────────────────────────────────────────────────
  const footer = (
    <div className={`${prefixCls}-footer`}>
      <Button onClick={() => onCancelRef.current()}>{modalCancel || 'Cancel'}</Button>
      <Button type="primary" onClick={(e: React.MouseEvent<HTMLElement>) => onOkRef.current(e)}>
        {modalOk || 'OK'}
      </Button>
    </div>
  );

  const title = modalTitle || 'Edit image';

  return (
    <>
      {newUploadChildren}
      <Modal
        title={title}
        open={modalOpen}
        onCancel={() => onCancelRef.current()}
        footer={footer}
        width={modalWidth}
        maskClosable={false}
        destroyOnClose
        centered
      >
        <div className={`${prefixCls}-wrapper`}>
          {/* Skeleton: visible mientras esperamos que termine la animación del Modal */}
          {modalImage && cropperKey === 0 && (
            <div className={`${prefixCls}-skeleton`}>
              <div className={`${prefixCls}-spinner`} />
            </div>
          )}
          {/* Cropper: monta DESPUÉS de la animación con fade-in suave */}
          {modalImage && cropperKey > 0 && (
            <EasyCrop
              key={cropperKey}
              ref={easyCropRef}
              prefixCls={prefixCls}
              zoomSlider={zoomSlider}
              rotationSlider={rotationSlider}
              showReset={showReset}
              resetBtnText={resetText}
              modalImage={modalImage}
              aspect={aspect}
              minZoom={minZoom}
              maxZoom={maxZoom}
              cropShape={cropShape}
              showGrid={showGrid}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
