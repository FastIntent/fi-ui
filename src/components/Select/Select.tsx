import React, { forwardRef, ReactNode, useState } from 'react';
import RcSelect, { SelectProps as RcSelectProps, Option, OptGroup } from '@rc-component/select';
import type { BaseSelectRef } from '@rc-component/select';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { CheckOutlined, DownOutlined, CloseCircleOutlined } from '../_icons';
import defaultLocale from '../locale/en_US';

/**
 * Propiedades del componente Select.
 * Hereda todas las propiedades nativas de `rc-select` como `options`, `mode` ("multiple" | "tags"), `allowClear`, etc.
 * Es un reemplazo avanzado y altamente accesible para el elemento `<select>` de HTML nativo.
 */
export interface SelectProps extends RcSelectProps {
  /**
   * Clases CSS opcionales que se inyectarán únicamente en el contenedor flotante (dropdown) del menú,
   * no en la caja de input principal. Útil para modificar el menú sin afectar el campo de entrada.
   */
  dropdownClassName?: string;

  /**
   * Estilos CSS en línea que se aplicarán al menú flotante (dropdown).
   */
  dropdownStyle?: React.CSSProperties;

  /**
   * El tamaño de la caja selectora.
   * - `large`: Ideal para formularios de registro principal.
   * - `small`: Ideal para tablas y barras de filtros.
   *
   * @default 'middle'
   */
  size?: 'large' | 'middle' | 'small';

  /**
   * Estado de validación del selector.
   * - `error`: Bordes rojos, típicamente usado cuando el usuario no ha seleccionado una opción obligatoria.
   * - `warning`: Bordes amarillos.
   */
  status?: 'error' | 'warning' | '';

  /**
   * Muestra un spinner en el icono de sufijo e impide abrir el dropdown.
   * Útil mientras se cargan las opciones de forma asíncrona.
   * @default false
   */
  loading?: boolean;

  /** Activa el modo de label flotante. @default false */
  floating?: boolean;

  /** Texto del label flotante. */
  label?: string;

  /** Color personalizado del label cuando está activo. */
  labelColor?: string;

  /**
   * Nodos hijos, que tradicionalmente deberían ser componentes `<Select.Option>`
   * aunque en versiones modernas se recomienda pasar la data cruda mediante la propiedad `options={[{ value: '1', label: 'Opción 1' }]}`.
   */
  children?: ReactNode;
}

interface CompoundedComponent extends React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<BaseSelectRef>
> {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
}

const Select = forwardRef<BaseSelectRef, SelectProps>((props, ref) => {
  const {
    prefixCls: customPrefixCls,
    className,
    dropdownClassName,
    dropdownStyle,
    size,
    status,
    loading = false,
    disabled,
    floating = false,
    label,
    labelColor,
    ...restProps
  } = props;

  const { size: contextSize, locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('select', customPrefixCls) || getDefaultPrefixCls('select');
  const rootPrefixCls = getPrefixCls?.('') || 'fi';
  const selectLocale = contextLocale?.Select || defaultLocale.Select!;
  const globalLocale = contextLocale?.global || defaultLocale.global!;
  const mergedSize = size || contextSize || 'middle';
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(restProps.value ?? restProps.defaultValue);

  const selectClasses = classNames(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-large`]: mergedSize === 'large',
      [`${prefixCls}-small`]: mergedSize === 'small',
      [`${prefixCls}-status-${status}`]: status,
      [`${prefixCls}-loading`]: loading,
    },
    className
  );

  const mergedDropdownClassName = classNames(`${prefixCls}-dropdown`, dropdownClassName);

  const isMultiple = restProps.mode === 'multiple' || restProps.mode === 'tags';

  const hasValue = Array.isArray(innerValue)
    ? innerValue.length > 0
    : innerValue !== undefined && innerValue !== null && innerValue !== '';
  const isActive = focused || hasValue;

  const handlePopupVisibleChange = (open: boolean) => {
    setFocused(open);
    restProps.onPopupVisibleChange?.(open);
  };

  const handleChange = (val: unknown, option: unknown) => {
    setInnerValue(val as typeof innerValue);
    (restProps.onChange as (...args: unknown[]) => void)?.(val, option);
  };

  const selectNode = (
    <RcSelect
      {...restProps}
      ref={ref}
      prefixCls={prefixCls}
      className={selectClasses}
      listHeight={256}
      listItemHeight={32}
      popupClassName={mergedDropdownClassName}
      popupStyle={{ zIndex: 10000, ...dropdownStyle }}
      disabled={disabled}
      open={loading ? false : restProps.open}
      transitionName={`${prefixCls}-slide-up`}
      getPopupContainer={restProps.getPopupContainer}
      notFoundContent={restProps.notFoundContent || selectLocale.notFoundContent}
      placeholder={
        floating
          ? focused
            ? restProps.placeholder
            : undefined
          : restProps.placeholder || globalLocale.placeholder
      }
      menuItemSelectedIcon={isMultiple ? <CheckOutlined /> : null}
      onPopupVisibleChange={handlePopupVisibleChange}
      onChange={handleChange}
      suffixIcon={
        loading ? (
          <span className={`${prefixCls}-loading-icon`} aria-hidden="true" />
        ) : (
          <DownOutlined />
        )
      }
      clearIcon={
        <div className={`${prefixCls}-clear-icon`}>
          <CloseCircleOutlined />
        </div>
      }
    />
  );

  if (!floating) return selectNode;

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
      {selectNode}
    </div>
  );
}) as CompoundedComponent;

Select.displayName = 'Select';
Select.Option = Option;
Select.OptGroup = OptGroup;

export { Select, Option, OptGroup };
