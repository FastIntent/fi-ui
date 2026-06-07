import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Define las formas geométricas que puede adoptar el componente Skeleton.
 */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

/**
 * Define las animaciones disponibles para el efecto de carga.
 */
export type SkeletonAnimation = 'pulse' | 'wave' | false;

/**
 * Propiedades del componente Skeleton.
 * Utilizado para mostrar un marcador de posición (placeholder) mientras el contenido real se está cargando.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * La variante visual del skeleton.
   * - `text`: Se adapta al tamaño de la fuente.
   * - `circular`: Forma de círculo (ideal para avatares).
   * - `rectangular`: Forma cuadrada perfecta.
   * - `rounded`: Rectángulo con bordes suavizados (ideal para imágenes o botones).
   * @default 'text'
   */
  variant?: SkeletonVariant;

  /**
   * El tipo de animación que se mostrará.
   * - `pulse`: Efecto de desvanecimiento suave.
   * - `wave`: Efecto de brillo barriendo de izquierda a derecha.
   * - `false`: Sin animación.
   * @default 'wave'
   */
  animation?: SkeletonAnimation;

  /**
   * Ancho del skeleton. Puede ser un número (píxeles) o un string (%, rem, etc.).
   */
  width?: number | string;

  /**
   * Altura del skeleton. Puede ser un número (píxeles) o un string (%, rem, etc.).
   */
  height?: number | string;

  /**
   * Clases CSS opcionales para personalizar el contenedor.
   */
  className?: string;

  /**
   * Estilos CSS en línea para ajustes puntuales de diseño.
   */
  style?: React.CSSProperties;
}

/**
 * Skeleton - Componente de carga visual premium.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'wave',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('skeleton') || getDefaultPrefixCls('skeleton');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${variant}`,
    {
      [`${prefixCls}-animation-${animation}`]: animation,
    },
    className
  );

  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      {...props}
      role="status"
      aria-label={props['aria-label'] ?? 'Loading'}
      className={classes}
      style={skeletonStyle}
    />
  );
};

Skeleton.displayName = 'Skeleton';
