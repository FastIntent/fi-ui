import React, { forwardRef, useState } from 'react';
import Picker from '@rc-component/picker';
import type { PickerProps as RcPickerProps } from '@rc-component/picker';
import type { Locale, PickerRef } from '@rc-component/picker/lib/interface';
import dayjsGenerateConfig from '@rc-component/picker/lib/generate/dayjs';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { CalendarOutlined, CloseCircleOutlined } from '../_icons';

import defaultLocale from '../locale/en_US';

export type DatePickerSize = 'large' | 'middle' | 'small';

/**
 * Propiedades del componente DatePicker.
 * Un seleccionador de fechas robusto y accesible, construido sobre `rc-picker` y utilizando `dayjs` internamente.
 *
 * Además de estas propiedades, soporta todas las nativas de `rc-picker` como `format`, `onChange`, `disabledDate`, etc.
 */
export interface DatePickerProps extends Omit<
  RcPickerProps<Dayjs>,
  'generateConfig' | 'locale' | 'size'
> {
  /**
   * El tamaño de la caja de input del seleccionador.
   * `large` incrementa el alto (ideal para formularios hero), `small` lo reduce (ideal para barras de filtros).
   *
   * @default 'middle'
   */
  size?: DatePickerSize;

  /**
   * Establece un estado de validación visual del input.
   * - `error`: Pinta el borde y el foco de color rojo.
   * - `warning`: Pinta el borde de amarillo.
   */
  status?: 'error' | 'warning' | '';

  /**
   * Clases CSS opcionales inyectadas exclusivamente al contenedor del panel del calendario emergente.
   * Útil para cambiar colores o tamaños del calendario sin afectar al input de la fecha.
   */
  dropdownClassName?: string;

  /**
   * Alias de `dropdownClassName` para consistencia con versiones anteriores.
   */
  popupClassName?: string;

  /** Activa el modo de label flotante. @default false */
  floating?: boolean;

  /** Texto del label flotante. */
  label?: string;

  /** Color personalizado del label cuando está activo. */
  labelColor?: string;
}

export const DatePicker = forwardRef<PickerRef, DatePickerProps>((props, ref) => {
  const {
    prefixCls: customPrefixCls,
    className,
    size,
    status,
    disabled,
    floating = false,
    label,
    labelColor,
    ...restProps
  } = props;

  const {
    size: contextSize,
    getPopupContainer,
    locale: contextLocale,
    getPrefixCls,
    dayjsLocaleId,
  } = useConfig();
  const prefixCls = getPrefixCls?.('picker', customPrefixCls) || getDefaultPrefixCls('picker');
  const rootPrefixCls = getPrefixCls?.('') || 'fi';
  const mergedSize = size || contextSize || 'middle';
  const datePickerLocale = contextLocale?.DatePicker || defaultLocale.DatePicker!;
  const pickerLocale = { ...datePickerLocale, locale: dayjsLocaleId || 'en' };
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(restProps.value ?? restProps.defaultValue ?? null);

  const pickerClasses = classNames(
    prefixCls,
    {
      [`${prefixCls}-${mergedSize}`]: mergedSize !== 'middle',
      [`${prefixCls}-status-${status}`]: status,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  const hasValue = innerValue !== null && innerValue !== undefined;
  const isActive = focused || hasValue;

  const handleFocus: typeof restProps.onFocus = (e, info) => {
    setFocused(true);
    restProps.onFocus?.(e, info);
  };

  const handleBlur: typeof restProps.onBlur = (e, info) => {
    setFocused(false);
    restProps.onBlur?.(e, info);
  };

  const handleChange: typeof restProps.onChange = (val, dateString) => {
    setInnerValue(Array.isArray(val) ? val[0] : val);
    restProps.onChange?.(val, dateString);
  };

  const dropdownClassName = classNames(`${prefixCls}-dropdown`, props.dropdownClassName);

  const pickerNode = (
    <Picker<Dayjs>
      {...restProps}
      getPopupContainer={restProps.getPopupContainer || getPopupContainer}
      ref={ref}
      prefixCls={prefixCls}
      generateConfig={dayjsGenerateConfig}
      locale={pickerLocale as Locale}
      className={pickerClasses}
      classNames={{
        popup: {
          root: dropdownClassName,
        },
      }}
      styles={{
        popup: {
          root: { width: 280 },
        },
      }}
      placeholder={
        floating
          ? focused
            ? restProps.placeholder
            : ' '
          : restProps.placeholder || pickerLocale.placeholder
      }
      transitionName={`${rootPrefixCls}-slide-up`}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      suffixIcon={<CalendarOutlined />}
      allowClear={{ clearIcon: <CloseCircleOutlined /> }}
    />
  );

  if (!floating) return pickerNode;

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
      {pickerNode}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
