import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades base para los componentes de Tipografía (Text, Title, Paragraph).
 * Utilizados para estandarizar la presentación de texto, enlaces y títulos en la interfaz.
 */
export interface TypographyProps {
  /** El texto o contenido interno. */
  children?: React.ReactNode;
  /** Clases CSS opcionales. */
  className?: string;
  /** Estilos CSS en línea. */
  style?: React.CSSProperties;

  /**
   * Color semántico del texto.
   * - `primary`: Color principal de la marca (ej. azul).
   * - `secondary`: Texto atenuado o gris para menor importancia.
   * - `success`, `warning`, `error`, `info`: Colores de estado.
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Aplica un peso de fuente bold (negrita).
   * @default false
   */
  strong?: boolean;

  /**
   * Aplica un estilo de fuente cursiva (italic).
   * @default false
   */
  italic?: boolean;

  /**
   * Subraya el texto.
   * @default false
   */
  underline?: boolean;

  /**
   * Dibuja una línea a través del texto (tachado).
   * Útil para indicar precios antiguos o elementos eliminados.
   * @default false
   */
  delete?: boolean;

  /**
   * Deshabilita visualmente el texto (gris muy claro) y previene la interacción si es un enlace.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Propiedades exclusivas del componente `<Typography.Title>`.
 */
export type TitleProps = TypographyProps & {
  /**
   * El nivel del encabezado HTML (`h1` a `h5`).
   * Determina tanto el tamaño visual como la jerarquía semántica (SEO).
   *
   * @default 1
   */
  level?: 1 | 2 | 3 | 4 | 5;
};

export const Title: React.FC<TitleProps> = ({
  level = 1,
  children,
  className,
  color,
  strong,
  italic,
  underline,
  delete: del,
  disabled,
  ...restProps
}) => {
  const Component = `h${level}` as React.ElementType;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('typography') || getDefaultPrefixCls('typography');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-title`,
    `${prefixCls}-title-h${level}`,
    {
      [`${prefixCls}-${color}`]: color,
      [`${prefixCls}-strong`]: strong,
      [`${prefixCls}-italic`]: italic,
      [`${prefixCls}-underline`]: underline,
      [`${prefixCls}-delete`]: del,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
};

export const Text: React.FC<TypographyProps> = ({
  children,
  className,
  color,
  strong,
  italic,
  underline,
  delete: del,
  disabled,
  ...restProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('typography') || getDefaultPrefixCls('typography');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-text`,
    {
      [`${prefixCls}-${color}`]: color,
      [`${prefixCls}-strong`]: strong,
      [`${prefixCls}-italic`]: italic,
      [`${prefixCls}-underline`]: underline,
      [`${prefixCls}-delete`]: del,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  return (
    <span className={classes} {...restProps}>
      {children}
    </span>
  );
};

export const Paragraph: React.FC<TypographyProps> = ({
  children,
  className,
  color,
  strong,
  italic,
  underline,
  delete: del,
  disabled,
  ...restProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('typography') || getDefaultPrefixCls('typography');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-paragraph`,
    {
      [`${prefixCls}-${color}`]: color,
      [`${prefixCls}-strong`]: strong,
      [`${prefixCls}-italic`]: italic,
      [`${prefixCls}-underline`]: underline,
      [`${prefixCls}-delete`]: del,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  return (
    <p className={classes} {...restProps}>
      {children}
    </p>
  );
};

Title.displayName = 'Typography.Title';
Text.displayName = 'Typography.Text';
Paragraph.displayName = 'Typography.Paragraph';
