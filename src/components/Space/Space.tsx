import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades del componente Space.
 * Se utiliza para establecer un espacio uniforme entre componentes hermanos.
 */
export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alineación de los elementos en el eje secundario (cross-axis).
   */
  align?: 'start' | 'end' | 'center' | 'baseline';

  /**
   * La dirección principal en la que se apilan los elementos.
   * @default 'horizontal'
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Obsoleto: Usar `direction` en su lugar.
   * @deprecated Usa `direction`
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Si es true, la dirección será 'vertical'.
   * Una forma corta de escribir `direction="vertical"`.
   * @default false
   */
  vertical?: boolean;

  /**
   * El tamaño del espacio entre elementos.
   * Puede ser un tamaño predefinido, un número (en píxeles) o una tupla `[horizontal, vertical]`.
   * @default 'small'
   */
  size?: 'small' | 'middle' | 'large' | number | [number, number];

  /**
   * Si es true, permite que los elementos salten a la siguiente línea si no hay espacio.
   * Sólo funciona si la dirección es horizontal.
   * @default false
   */
  wrap?: boolean;

  /**
   * Un separador visual que se renderizará entre cada elemento.
   */
  separator?: React.ReactNode;

  /**
   * Nombres de clases personalizados para los subcomponentes internos.
   */
  classNames?: { item?: string; separator?: string };

  /**
   * Estilos CSS en línea para los subcomponentes internos.
   */
  styles?: { item?: React.CSSProperties; separator?: React.CSSProperties };
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export const Space: React.FC<SpaceProps> = ({
  className,
  align,
  direction = 'horizontal',
  orientation,
  vertical,
  size = 'small',
  wrap = false,
  separator,
  classNames: customClassNames,
  styles: customStyles,
  style,
  children,
  ...restProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('space') || getDefaultPrefixCls('space');
  const mergedDirection = vertical ? 'vertical' : orientation || direction;

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${mergedDirection}`,
    {
      [`${prefixCls}-align-${align}`]: align,
      [`${prefixCls}-wrap`]: wrap,
    },
    className
  );

  const getGapStyle = () => {
    if (Array.isArray(size)) {
      return { rowGap: size[1], columnGap: size[0] };
    }
    if (typeof size === 'number') {
      return { gap: size };
    }
    return { gap: spaceSize[size] };
  };

  const mergedStyle = {
    ...getGapStyle(),
    ...style,
  };

  const childNodes = React.Children.toArray(children).filter(
    (child) => child !== null && child !== undefined
  );

  const getChildKey = (child: React.ReactNode, fallback: number) => {
    if (React.isValidElement(child) && child.key !== null) {
      return child.key;
    }

    return `space-item-${fallback}`;
  };

  return (
    <div className={classes} style={mergedStyle} {...restProps}>
      {childNodes.map((child, index) => {
        const isLast = index === childNodes.length - 1;
        return (
          <React.Fragment key={getChildKey(child, index)}>
            <div
              className={classNames(`${prefixCls}-item`, customClassNames?.item)}
              style={customStyles?.item}
            >
              {child}
            </div>
            {separator && !isLast && (
              <span
                className={classNames(`${prefixCls}-item-separator`, customClassNames?.separator)}
                style={customStyles?.separator}
              >
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Space.displayName = 'Space';

export interface SpaceCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export const SpaceCompact: React.FC<SpaceCompactProps> = ({
  className,
  block,
  direction = 'horizontal',
  children,
  style,
  ...restProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('space-compact') || getDefaultPrefixCls('space-compact');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${direction}`,
    { [`${prefixCls}-block`]: block },
    className
  );

  return (
    <div className={classes} style={style} {...restProps}>
      {children}
    </div>
  );
};

SpaceCompact.displayName = 'SpaceCompact';

export const SpaceWithCompact = Space as typeof Space & { Compact: typeof SpaceCompact };
SpaceWithCompact.Compact = SpaceCompact;
