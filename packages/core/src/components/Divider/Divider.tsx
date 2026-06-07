import React from 'react';
import classNames from 'classnames';
import { useConfig, usePrefixCls } from '../ConfigProvider';
import { getPrefixedCssVarStyle } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Divider.
 * Utilizado para separar contenido visualmente mediante una línea (horizontal o vertical).
 * Soporta renderizado de texto en su interior, útil para subtítulos de secciones.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * La dirección del divisor.
   * - `horizontal`: Ocupa el 100% del ancho del contenedor.
   * - `vertical`: Se ajusta a la altura del texto, usado para separar elementos en línea.
   *
   * @default 'horizontal'
   */
  type?: 'horizontal' | 'vertical';

  /**
   * Alineación del texto incluido dentro del divisor. Solo aplica para divisores horizontales.
   *
   * @default 'center'
   */
  orientation?: 'left' | 'right' | 'center';

  /**
   * Determina si la línea divisoria se renderiza punteada en lugar de sólida.
   *
   * @default false
   */
  dashed?: boolean;

  /**
   * Si es `true`, el texto incluido dentro del divisor no tendrá peso visual (font-weight normal)
   * ni estilo destacado.
   *
   * @default false
   */
  plain?: boolean;

  /**
   * Define el margen superior e inferior del divisor horizontal.
   * - `small`: Margen pequeño (ej. 8px).
   * - `medium`: Margen estándar (ej. 16px).
   * - `large`: Margen amplio (ej. 24px).
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * La distancia del texto hacia el borde del divisor, cuando `orientation` es `left` o `right`.
   * Permite mover el texto más al centro o pegarlo a las orillas.
   *
   * @example
   * ```tsx
   * <Divider orientation="left" orientationMargin="50px">Texto a 50px del borde</Divider>
   * ```
   */
  orientationMargin?: string | number;

  /**
   * Controla el espacio (padding horizontal) entre el texto y la línea que lo rodea.
   */
  textPaddingInline?: string | number;

  /**
   * Controla el margen izquierdo y derecho cuando el divisor es de tipo `vertical`.
   */
  verticalMarginInline?: string | number;
}

export const Divider: React.FC<DividerProps> = ({
  className,
  children,
  type = 'horizontal',
  orientation = 'center',
  dashed,
  plain,
  size = 'medium',
  orientationMargin,
  textPaddingInline,
  verticalMarginInline,
  style,
  ...props
}) => {
  const { prefixCls: configPrefixCls } = useConfig();
  const prefixCls = usePrefixCls('divider');
  const hasChildren = !!children;

  const dividerCls = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    `${prefixCls}-size-${size}`,
    {
      [`${prefixCls}-with-text`]: hasChildren && type === 'horizontal',
      [`${prefixCls}-with-text-${orientation}`]: hasChildren && type === 'horizontal',
      [`${prefixCls}-dashed`]: dashed,
      [`${prefixCls}-plain`]: plain,
      [`${prefixCls}-no-default-orientation-margin-left`]:
        orientation === 'left' && orientationMargin !== undefined,
      [`${prefixCls}-no-default-orientation-margin-right`]:
        orientation === 'right' && orientationMargin !== undefined,
    },
    className
  );

  const customStyle: React.CSSProperties = {
    ...style,
    ...getPrefixedCssVarStyle(
      {
        'divider-orientation-margin':
          orientationMargin !== undefined && typeof orientationMargin === 'number'
            ? `${orientationMargin * 100}%`
            : orientationMargin,
        'divider-text-padding-inline':
          textPaddingInline !== undefined && typeof textPaddingInline === 'number'
            ? `${textPaddingInline}px`
            : textPaddingInline,
        'divider-vertical-margin-inline':
          verticalMarginInline !== undefined && typeof verticalMarginInline === 'number'
            ? `${verticalMarginInline}px`
            : verticalMarginInline,
      },
      configPrefixCls
    ),
  } as React.CSSProperties;

  return (
    <div className={dividerCls} style={customStyle} role="separator" {...props}>
      {hasChildren && type === 'horizontal' && (
        <span className={`${prefixCls}-inner-text`}>{children}</span>
      )}
    </div>
  );
};

Divider.displayName = 'Divider';
