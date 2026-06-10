import React, { forwardRef, useState } from 'react';
import RcInputNumber, {
  InputNumberProps as RcInputNumberProps,
  ValueType,
} from '@rc-component/input-number';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { UpOutlined, DownOutlined } from '../_icons';
import defaultLocale from '../locale/en_US';

/**
 * Propiedades del componente InputNumber.
 * Componente nativo optimizado para la inserción y validación matemática de campos numéricos (divisas, porcentajes, etc.).
 * Hereda propiedades de `rc-input-number` como `min`, `max`, `step`, `formatter` y `parser`.
 */
export interface InputNumberProps<T extends ValueType = ValueType> extends Omit<
  RcInputNumberProps<T>,
  'size'
> {
  /**
   * El tamaño de la caja de input.
   * `large` incrementa el alto (ideal para hero forms), `small` lo reduce (ideal para tablas de datos compactas).
   *
   * @default 'middle'
   */
  size?: 'large' | 'middle' | 'small';

  /**
   * Establece un estado de validación visual del input.
   * - `error`: Pinta el borde y el foco de color rojo. Útil al fallar validaciones de formularios.
   * - `warning`: Pinta el borde de amarillo.
   */
  status?: 'error' | 'warning' | '';

  /**
   * Permite que el usuario cambie el valor numérico haciendo scroll (rueda del ratón)
   * mientras el input está enfocado (hover/focus).
   *
   * @default false
   */
  changeOnWheel?: boolean;

  /**
   * Si es `true`, el evento `onChange` se disparará solo cuando el input pierda el foco (`onBlur`),
   * en lugar de dispararse en cada pulsación del teclado.
   * Ideal para evitar llamadas a APIs excesivas o recálculos pesados mientras el usuario está tipeando.
   *
   * @default false
   */
  changeOnBlur?: boolean;

  /** Activa el modo de label flotante. @default false */
  floating?: boolean;

  /** Texto del label flotante. */
  label?: string;

  /** Color personalizado del label cuando está activo. */
  labelColor?: string;

  /**
   * Contenido (texto o ReactNode) que se muestra antes del valor numérico
   * — típicamente una unidad monetaria ("$"), divisa ("€"), o icono.
   */
  prefix?: React.ReactNode;

  /**
   * Contenido (texto o ReactNode) que se muestra después del valor —
   * típicamente una unidad ("%", "kg", "ms").
   */
  suffix?: React.ReactNode;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
  const {
    prefixCls: customPrefixCls,
    className,
    size,
    status,
    disabled,
    floating = false,
    label,
    labelColor,
    prefix,
    suffix,
    ...restProps
  } = props;

  const { size: contextSize, locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls =
    getPrefixCls?.('input-number', customPrefixCls) || getDefaultPrefixCls('input-number');
  const rootPrefixCls = getPrefixCls?.('') || 'fi';
  const globalLocale = contextLocale?.global || defaultLocale.global!;
  const mergedSize = size || contextSize || 'middle';
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState<ValueType | undefined>(
    restProps.value ?? restProps.defaultValue ?? undefined
  );

  const inputNumberClasses = classNames(
    prefixCls,
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-status-${status}`]: status,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  const hasValue = innerValue !== undefined && innerValue !== null && innerValue !== '';
  const isActive = focused || hasValue;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    restProps.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    restProps.onBlur?.(e);
  };

  const handleChange = (val: ValueType | null) => {
    setInnerValue(val ?? undefined);
    restProps.onChange?.(val);
  };

  const rawInputNumber = (
    <RcInputNumber
      {...restProps}
      ref={ref}
      prefixCls={prefixCls}
      className={inputNumberClasses}
      disabled={disabled}
      placeholder={
        floating
          ? focused
            ? restProps.placeholder
            : undefined
          : restProps.placeholder || globalLocale.placeholder
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      upHandler={
        <span className={`${prefixCls}-handler-up-inner`}>
          <UpOutlined />
        </span>
      }
      downHandler={
        <span className={`${prefixCls}-handler-down-inner`}>
          <DownOutlined />
        </span>
      }
    />
  );

  // When `prefix` or `suffix` is provided, wrap the field in an
  // `affix-wrapper`. The border / focus visual moves to the wrapper so
  // the prefix and suffix live inside the same focus ring as the input.
  const hasAffix = prefix !== undefined || suffix !== undefined;

  const inputNumberNode = hasAffix ? (
    <span
      className={classNames(
        `${prefixCls}-affix-wrapper`,
        {
          [`${prefixCls}-affix-wrapper-lg`]: mergedSize === 'large',
          [`${prefixCls}-affix-wrapper-sm`]: mergedSize === 'small',
          [`${prefixCls}-affix-wrapper-focused`]: focused,
          [`${prefixCls}-affix-wrapper-disabled`]: disabled,
          [`${prefixCls}-affix-wrapper-status-${status}`]: status,
        },
        className
      )}
    >
      {prefix !== undefined && <span className={`${prefixCls}-prefix`}>{prefix}</span>}
      {rawInputNumber}
      {suffix !== undefined && <span className={`${prefixCls}-suffix`}>{suffix}</span>}
    </span>
  ) : (
    rawInputNumber
  );

  if (!floating) return inputNumberNode;

  const sizeClass = mergedSize === 'small' ? 'sm' : mergedSize === 'large' ? 'lg' : '';

  return (
    <div
      className={classNames(
        `${rootPrefixCls}-float-label`,
        { [`${rootPrefixCls}-float-label-active`]: isActive },
        { [`${rootPrefixCls}-float-label-error`]: status === 'error' },
        sizeClass && `${rootPrefixCls}-float-label-${sizeClass}`
      )}
    >
      <span
        className={`${rootPrefixCls}-float-label-text`}
        style={isActive && labelColor ? { color: labelColor } : undefined}
      >
        {label}
      </span>
      {inputNumberNode}
    </div>
  );
});

InputNumber.displayName = 'InputNumber';
