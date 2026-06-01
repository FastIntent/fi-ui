import React from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { EmptyDefaultImage, EmptySimpleImage } from '../_icons';

/**
 * Propiedades del componente Empty.
 * Utilizado para mostrar un estado vacío cuando no hay datos o resultados que mostrar.
 */
export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Imagen personalizada para mostrar en el estado vacío.
   * Puede ser una URL de imagen o un nodo React (SVG, Icono, etc.).
   */
  image?: React.ReactNode;

  /**
   * Descripción o mensaje principal para el usuario.
   * @default 'No hay datos'
   */
  description?: React.ReactNode;

  /**
   * Contenido adicional, como botones de acción (ej. "Crear nuevo").
   */
  children?: React.ReactNode;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

interface EmptyInterface extends React.FC<EmptyProps> {
  PRESENTED_IMAGE_DEFAULT: React.ReactNode;
  PRESENTED_IMAGE_SIMPLE: React.ReactNode;
}

/**
 * Empty - Componente para estados sin contenido.
 *
 * Incluye dos ilustraciones integradas:
 * - `Empty.PRESENTED_IMAGE_DEFAULT` — caja detallada (por defecto)
 * - `Empty.PRESENTED_IMAGE_SIMPLE` — caja compacta para tablas, selects, etc.
 */
export const Empty: EmptyInterface = ({
  image = <EmptyDefaultImage />,
  description,
  children,
  className,
  style,
  ...props
}) => {
  const { locale: contextLocale, getPrefixCls } = useConfig();
  const emptyLocale = contextLocale?.Empty || defaultLocale.Empty!;
  const mergedDescription = description ?? emptyLocale.description;
  const prefixCls = getPrefixCls?.('empty') || getDefaultPrefixCls('empty');
  const classes = classNames(prefixCls, className);

  return (
    <div className={classes} style={style} {...props}>
      <div className={`${prefixCls}-image`}>{image}</div>
      {mergedDescription && <div className={`${prefixCls}-description`}>{mergedDescription}</div>}
      {children && <div className={`${prefixCls}-footer`}>{children}</div>}
    </div>
  );
};

Empty.PRESENTED_IMAGE_DEFAULT = <EmptyDefaultImage />;
Empty.PRESENTED_IMAGE_SIMPLE = <EmptySimpleImage />;
Empty.displayName = 'Empty';
