import React, { createContext, useContext } from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

// Context to share gutter between Row and Col
const RowContext = createContext<{ gutter?: [number, number] }>({});

/**
 * Propiedades del componente Row.
 * Actúa como un contenedor para las columnas (`Col`) y define la alineación y espaciado global de la fila.
 */
export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Espaciado entre columnas (en píxeles).
   * Puede ser un número (espaciado horizontal) o un arreglo [horizontal, vertical].
   * @default 0
   */
  gutter?: number | [number, number];

  /**
   * Alineación vertical de las columnas dentro de la fila.
   * @default 'top'
   */
  align?: 'top' | 'middle' | 'bottom' | 'stretch';

  /**
   * Alineación horizontal (justificación) de las columnas.
   * @default 'start'
   */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
}

export const Row: React.FC<RowProps> = ({
  gutter = 0,
  align = 'top',
  justify = 'start',
  className,
  style,
  children,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('row') || getDefaultPrefixCls('row');

  const normalizedGutter: [number, number] = Array.isArray(gutter) ? gutter : [gutter, 0];
  const [horizontalGutter, verticalGutter] = normalizedGutter;

  const rowStyle: React.CSSProperties = {
    ...(horizontalGutter > 0
      ? {
          marginLeft: -horizontalGutter / 2,
          marginRight: -horizontalGutter / 2,
        }
      : {}),
    ...(verticalGutter > 0
      ? {
          marginTop: -verticalGutter / 2,
          marginBottom: -verticalGutter / 2,
        }
      : {}),
    ...style,
  };

  const classes = classNames(
    prefixCls,
    `${prefixCls}-align-${align}`,
    `${prefixCls}-justify-${justify}`,
    className
  );

  return (
    <RowContext.Provider value={{ gutter: normalizedGutter }}>
      <div className={classes} style={rowStyle} {...props}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

/**
 * Propiedades del componente Col.
 * Representa una columna dentro de una `Row`. Utiliza un sistema de 24 columnas.
 */
export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Número de columnas que ocupa este elemento (máximo 24).
   */
  span?: number;

  /**
   * Número de columnas de desplazamiento hacia la izquierda.
   */
  offset?: number;

  /**
   * Orden de visualización de la columna.
   */
  order?: number;

  /**
   * Configuración flexible.
   */
  flex?: string | number;

  /** < 576px */
  xs?: number;
  /** >= 576px */
  sm?: number;
  /** >= 768px */
  md?: number;
  /** >= 992px */
  lg?: number;
  /** >= 1200px */
  xl?: number;
  /** >= 1600px */
  xxl?: number;
}

export const Col: React.FC<ColProps> = ({
  span,
  offset,
  order,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
  children,
  ...props
}) => {
  const { gutter } = useContext(RowContext);
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('col') || getDefaultPrefixCls('col');

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-${span}`]: span !== undefined,
      [`${prefixCls}-offset-${offset}`]: offset !== undefined,
      [`${prefixCls}-order-${order}`]: order !== undefined,
      [`${prefixCls}-xs-${xs}`]: xs !== undefined,
      [`${prefixCls}-sm-${sm}`]: sm !== undefined,
      [`${prefixCls}-md-${md}`]: md !== undefined,
      [`${prefixCls}-lg-${lg}`]: lg !== undefined,
      [`${prefixCls}-xl-${xl}`]: xl !== undefined,
      [`${prefixCls}-xxl-${xxl}`]: xxl !== undefined,
    },
    className
  );

  const mergedStyle: React.CSSProperties = {
    ...(gutter && gutter[0] > 0
      ? {
          paddingLeft: gutter[0] / 2,
          paddingRight: gutter[0] / 2,
        }
      : {}),
    ...(gutter && gutter[1] > 0
      ? {
          paddingTop: gutter[1] / 2,
          paddingBottom: gutter[1] / 2,
        }
      : {}),
    ...(flex ? { flex } : {}),
    ...style,
  };

  return (
    <div className={classes} style={mergedStyle} {...props}>
      {children}
    </div>
  );
};

// Removed redundant export default

Row.displayName = 'Row';
Col.displayName = 'Col';
