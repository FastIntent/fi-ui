import React from 'react';
import classNames from 'classnames';
import { usePrefixCls } from '../ConfigProvider';
import { AvatarGroup } from './AvatarGroup';

/**
 * Propiedades del componente Avatar.
 * Utilizado para representar usuarios, entidades o iconos en un formato compacto (generalmente circular o cuadrado).
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * La URL de la imagen que se mostrará en el avatar.
   * Si la imagen falla al cargar, el avatar intentará mostrar el `children` o el `icon` como fallback.
   */
  src?: string;

  /**
   * Atributo `srcset` nativo de HTML para la imagen del avatar.
   * Permite proveer múltiples resoluciones de imagen (útil para pantallas Retina).
   */
  srcSet?: string;

  /**
   * Texto alternativo para la imagen, importante para la accesibilidad (lectores de pantalla) y SEO.
   */
  alt?: string;

  /**
   * La forma del contenedor del avatar.
   * - `circle`: Totalmente redondeado (border-radius: 50%).
   * - `square`: Cuadrado con bordes ligeramente redondeados (border-radius nativo del sistema).
   *
   * @default 'circle'
   */
  shape?: 'circle' | 'square';

  /**
   * El tamaño del avatar.
   * Puede ser uno de los tamaños predefinidos o un número exacto en píxeles.
   * Si pasas un número (ej. `64`), se aplicará tanto al ancho como al alto.
   *
   * @default 'default'
   */
  size?: 'large' | 'small' | 'default' | number;

  /**
   * Icono de React a renderizar si no hay imagen (src) o si la imagen falla.
   */
  icon?: React.ReactNode;

  /**
   * Espacio en píxeles desde el borde del avatar hasta el texto (children).
   * El componente calculará y escalará el texto automáticamente para que encaje sin desbordar.
   *
   * @default 4
   */
  gap?: number;

  /**
   * Callback que se ejecuta cuando la imagen proveída en `src` falla al cargar.
   * Si retorna `false`, se evita el comportamiento predeterminado que cambia el estado a "error" para mostrar el fallback.
   */
  onError?: () => boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  srcSet,
  alt,
  shape = 'circle',
  size = 'default',
  icon,
  gap = 4,
  children,
  className,
  style,
  onError,
  ...props
}) => {
  const prefixCls = usePrefixCls('avatar');
  const [isError, setIsError] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const childrenRef = React.useRef<HTMLSpanElement>(null);
  const avatarRef = React.useRef<HTMLSpanElement>(null);

  const handleImgError = () => {
    const errorFlag = onError ? onError() : true;
    if (errorFlag !== false) {
      setIsError(true);
    }
  };

  React.useEffect(() => {
    if (children && childrenRef.current && avatarRef.current) {
      const childrenWidth = childrenRef.current.offsetWidth;
      const avatarWidth = avatarRef.current.offsetWidth;
      if (avatarWidth !== 0 && childrenWidth !== 0) {
        if (gap * 2 < avatarWidth) {
          setScale(
            childrenWidth > avatarWidth - gap * 2 ? (avatarWidth - gap * 2) / childrenWidth : 1
          );
        }
      }
    }
  }, [children, gap, size]);

  const sizeCls = typeof size === 'string' ? `${prefixCls}-${size}` : '';

  const avatarCls = classNames(
    prefixCls,
    sizeCls,
    `${prefixCls}-${shape}`,
    {
      [`${prefixCls}-image`]: src && !isError,
      [`${prefixCls}-icon`]: !!icon,
    },
    className
  );

  const sizeStyle: React.CSSProperties =
    typeof size === 'number'
      ? {
          width: size,
          height: size,
          lineHeight: `${size}px`,
          fontSize: icon ? size / 2 : 18,
        }
      : {};

  const childrenStyle: React.CSSProperties = {
    msTransform: `scale(${scale}) translateX(-50%)`,
    WebkitTransform: `scale(${scale}) translateX(-50%)`,
    transform: `scale(${scale}) translateX(-50%)`,
    display: 'inline-block',
  };

  let content: React.ReactNode = children;
  if (src && !isError) {
    content = <img src={src} srcSet={srcSet} alt={alt} onError={handleImgError} />;
  } else if (icon) {
    content = icon;
  } else {
    content = (
      <span className={`${prefixCls}-string`} ref={childrenRef} style={childrenStyle}>
        {children}
      </span>
    );
  }

  return (
    <span className={avatarCls} style={{ ...sizeStyle, ...style }} ref={avatarRef} {...props}>
      {content}
    </span>
  );
};

Avatar.displayName = 'Avatar';

// Attach Group as a static property so consumers use <Avatar.Group>
(Avatar as typeof Avatar & { Group: typeof AvatarGroup }).Group = AvatarGroup;
