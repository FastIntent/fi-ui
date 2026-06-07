import React from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import './Flex.scss';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dirección del eje principal. @default 'row' */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

  /** Alineación en el eje secundario (cross-axis). */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /** Distribución en el eje principal. */
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

  /** Permite que los elementos salten de línea. @default false */
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';

  /** Espacio entre elementos. Acepta un token ('small'|'middle'|'large') o un número en píxeles. */
  gap?: 'small' | 'middle' | 'large' | number;

  /** Atajo para `direction="column"`. @default false */
  vertical?: boolean;

  /** Si es `true`, ocupa el ancho completo del contenedor. @default false */
  block?: boolean;

  /** Propiedad CSS `flex` del contenedor (e.g. `"1"`, `"0 0 auto"`). */
  flex?: React.CSSProperties['flex'];

  /** Ref al elemento div raíz. */
  ref?: React.Ref<HTMLDivElement>;
}

const gapSizes: Record<string, number> = { small: 8, middle: 16, large: 24 };

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      style,
      direction,
      align,
      justify,
      wrap = false,
      gap,
      vertical = false,
      block = false,
      flex,
      children,
      ...restProps
    },
    ref
  ) => {
    const { getPrefixCls } = useConfig();
    const prefixCls = getPrefixCls?.('flex') || getDefaultPrefixCls('flex');

    const mergedDirection = vertical ? 'column' : direction || 'row';

    const mergedWrap = wrap === true ? 'wrap' : wrap === false ? undefined : wrap;

    const classes = classNames(
      prefixCls,
      {
        [`${prefixCls}-block`]: block,
      },
      className
    );

    const gapValue = typeof gap === 'string' ? gapSizes[gap] : gap;

    const mergedStyle: React.CSSProperties = {
      flexDirection: mergedDirection !== 'row' ? mergedDirection : undefined,
      alignItems: align
        ? align === 'start' || align === 'end'
          ? `flex-${align}`
          : align
        : undefined,
      justifyContent: justify
        ? justify === 'start' || justify === 'end'
          ? `flex-${justify}`
          : justify
        : undefined,
      flexWrap: mergedWrap,
      gap: gapValue,
      flex,
      ...style,
    };

    return (
      <div ref={ref} className={classes} style={mergedStyle} {...restProps}>
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';
