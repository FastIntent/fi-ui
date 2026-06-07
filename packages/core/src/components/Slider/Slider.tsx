import React, { forwardRef } from 'react';
import RcSlider from '@rc-component/slider';
import type { MarkObj } from '@rc-component/slider/lib/Marks';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades del componente Slider.
 * Permite al usuario seleccionar un valor o un rango de valores deslizando un manejador.
 * Construido sobre `@rc-component/slider`.
 */
export interface SliderProps {
  /**
   * Valor actual del slider. Si es un arreglo, se activará el modo rango.
   */
  value?: number | number[];

  /**
   * Valor inicial por defecto.
   */
  defaultValue?: number | number[];

  /**
   * El valor mínimo del slider.
   * @default 0
   */
  min?: number;

  /**
   * El valor máximo del slider.
   * @default 100
   */
  max?: number;

  /**
   * El tamaño de cada paso (incremento/decremento).
   * @default 1
   */
  step?: number | null;

  /**
   * Si es `true`, el slider se mostrará en modo vertical.
   * @default false
   */
  vertical?: boolean;

  /**
   * Deshabilita la interacción con el slider.
   * @default false
   */
  disabled?: boolean;

  /**
   * Si es `true`, el slider permite seleccionar un rango (dos manejadores).
   * Se activa automáticamente si `value` o `defaultValue` son arreglos.
   */
  range?: boolean;

  /**
   * Callback ejecutado cuando el valor cambia.
   */
  onChange?: (value: number | number[]) => void;

  /**
   * Callback ejecutado cuando el usuario termina de deslizar.
   */
  onAfterChange?: (value: number | number[]) => void;

  /**
   * Clases CSS adicionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;

  /**
   * Etiqueta accesible para el handle del slider (ARIA).
   * Requerido para cumplir WCAG 2.1 — el elemento con role="slider" debe tener un nombre accesible.
   */
  'aria-label'?: string;

  /**
   * ID del elemento que describe al slider (alternativa a aria-label).
   */
  'aria-labelledby'?: string;

  /**
   * Marcas en posiciones específicas del slider.
   * Puede ser un nodo React simple o un objeto `{ style, label }`.
   */
  marks?: Record<string | number, React.ReactNode | MarkObj>;

  /**
   * Si es `true`, el área entre el origen y el handle se resalta.
   * @default true
   */
  included?: boolean;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const {
    className,
    disabled,
    range,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('slider') || getDefaultPrefixCls('slider');
  const isRange = range || Array.isArray(props.value) || Array.isArray(props.defaultValue);

  const sliderCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-vertical`]: props.vertical,
    },
    className
  );

  return (
    <RcSlider
      {...rest}
      ref={ref}
      range={isRange}
      prefixCls={prefixCls}
      className={sliderCls}
      disabled={disabled}
      ariaLabelForHandle={ariaLabel}
      ariaLabelledByForHandle={ariaLabelledBy}
    />
  );
});

Slider.displayName = 'Slider';

export { Slider };
