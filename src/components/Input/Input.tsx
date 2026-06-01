import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import RcInput from '@rc-component/input';
import type { InputRef } from '@rc-component/input';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { CloseCircleOutlined } from '../_icons';

/**
 * Tamaños disponibles para el componente Input.
 */
export type InputSize = 'large' | 'middle' | 'small';

/**
 * Propiedades del componente Input.
 * Reemplazo nativo y estilizado para el elemento HTML `<input type="text">`.
 */
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix' | 'suffix' | 'label'
> {
  /**
   * El tamaño de la caja de texto.
   * `large` incrementa el alto, `small` lo reduce.
   *
   * @default 'middle'
   */
  size?: InputSize;

  /**
   * Estado de validación visual del input.
   * - `error`: Pinta el borde y el foco de color rojo.
   * - `warning`: Pinta el borde de amarillo.
   * - `success`: Pinta el borde de verde. Útil para confirmar validación exitosa.
   */
  status?: 'error' | 'warning' | 'success';

  /**
   * Elemento (texto, icono) renderizado estáticamente dentro del input, en el lado izquierdo.
   * Comúnmente usado para iconos de usuario, búsqueda, o prefijos de moneda (ej. `$`).
   */
  prefix?: React.ReactNode;

  /**
   * Elemento renderizado estáticamente dentro del input, en el lado derecho.
   * Útil para botones secundarios o indicadores de estado visual.
   */
  suffix?: React.ReactNode;

  /**
   * Si es `true`, muestra automáticamente un botón (✕) para borrar todo el texto cuando el input tiene valor.
   * También se le puede pasar un objeto con un icono personalizado `{ clearIcon: <Icono /> }`.
   *
   * @default false
   */
  allowClear?: boolean | { clearIcon?: React.ReactNode };

  /** Activa el modo de label flotante. @default false */
  floating?: boolean;

  /** Texto del label flotante. */
  label?: string;

  /** Color personalizado del label cuando está activo. */
  labelColor?: string;

  /**
   * Permite inyectar clases CSS de utilidad adicionales en partes internas específicas del input.
   */
  classNames?: {
    /** Clases para el contenedor externo principal (el wrapper que contiene el input y sus iconos). */
    affixWrapper?: string;
    /** Clases exclusivas para el contenedor del prefijo. */
    prefix?: string;
    /** Clases exclusivas para el contenedor del sufijo. */
    suffix?: string;
    /** Clases que se inyectan directamente en el elemento `<input>` de HTML real. */
    input?: string;
  };
}

export const Input = forwardRef<InputRef, InputProps>(
  (
    {
      size,
      status,
      className,
      classNames: customClassNames,
      disabled,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      floating = false,
      label,
      labelColor,
      ...restProps
    },
    ref
  ) => {
    const { getPrefixCls } = useConfig();
    const prefixCls = getPrefixCls?.('input') || getDefaultPrefixCls('input');
    const rootPrefixCls = getPrefixCls?.('') || 'fi';
    const { size: contextSize, locale: contextLocale } = useConfig();
    const globalLocale = contextLocale?.global || defaultLocale.global!;
    const mergedSize = size || contextSize || 'middle';
    const [innerValue, setInnerValue] = useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      if (value !== undefined) {
        setInnerValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInnerValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const inputClasses = classNames(
      prefixCls,
      `${prefixCls}-${mergedSize}`,
      {
        [`${prefixCls}-status-${status}`]: status,
        [`${prefixCls}-disabled`]: disabled,
      },
      className
    );

    const showClear =
      restProps.allowClear &&
      !disabled &&
      innerValue !== '' &&
      innerValue !== null &&
      innerValue !== undefined;

    const hasValue = innerValue !== '' && innerValue !== null && innerValue !== undefined;
    const isActive = focused || hasValue;

    const inputNode = (
      <RcInput
        {...restProps}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={
          floating
            ? focused
              ? restProps.placeholder
              : undefined
            : restProps.placeholder || globalLocale.placeholder
        }
        prefixCls={prefixCls}
        className={inputClasses}
        classNames={customClassNames}
        allowClear={
          restProps.allowClear
            ? {
                clearIcon: (
                  <span
                    className={classNames(`${prefixCls}-clear-icon`, {
                      [`${prefixCls}-clear-icon-hidden`]: !showClear,
                    })}
                  >
                    <CloseCircleOutlined />
                  </span>
                ),
              }
            : false
        }
      />
    );

    if (!floating) return inputNode;

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
        {inputNode}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── TextArea ────────────────────────────────────────────────────────────────

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'prefix'
> {
  /**
   * Auto-ajusta la altura al contenido.
   * - `true` / `false`
   * - `{ minRows: 2, maxRows: 6 }` para limitar el rango.
   * @default false
   */
  autoSize?: boolean | { minRows?: number; maxRows?: number };

  /**
   * Muestra el contador de caracteres debajo del textarea.
   * - `true`: muestra "actual / max" si maxLength está definido, o solo "actual".
   * - `{ max: 100 }`: límite independiente de maxLength.
   */
  showCount?: boolean | { max?: number };

  /** Estado de validación visual. */
  status?: 'error' | 'warning' | 'success';

  /** Permite o bloquea el resize manual. @default true */
  resize?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      style,
      autoSize = false,
      showCount = false,
      status,
      disabled,
      maxLength,
      resize = true,
      value,
      defaultValue,
      onChange,
      ...restProps
    },
    ref
  ) => {
    const { getPrefixCls } = useConfig();
    const prefixCls = getPrefixCls?.('input') || getDefaultPrefixCls('input');
    const taRef = useRef<HTMLTextAreaElement | null>(null);

    const initialValue =
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : '';
    const [innerValue, setInnerValue] = useState<string>(String(initialValue));

    useEffect(() => {
      if (value !== undefined) setInnerValue(String(value));
    }, [value]);

    // Auto-size logic
    const calcHeight = useCallback(() => {
      const el = taRef.current;
      if (!el || !autoSize) return;

      const minRows = typeof autoSize === 'object' ? (autoSize.minRows ?? 1) : 1;
      const maxRows = typeof autoSize === 'object' ? autoSize.maxRows : undefined;

      el.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(el).lineHeight || '20', 10);
      const paddingTop = parseInt(getComputedStyle(el).paddingTop || '0', 10);
      const paddingBottom = parseInt(getComputedStyle(el).paddingBottom || '0', 10);
      const minH = minRows * lineHeight + paddingTop + paddingBottom;
      const scrollH = el.scrollHeight;
      const maxH = maxRows ? maxRows * lineHeight + paddingTop + paddingBottom : Infinity;

      el.style.height = `${Math.min(Math.max(scrollH, minH), maxH)}px`;
      el.style.overflowY = maxRows && scrollH > maxH ? 'auto' : 'hidden';
    }, [autoSize]);

    useEffect(() => {
      calcHeight();
    }, [innerValue, calcHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInnerValue(e.target.value);
      onChange?.(e);
    };

    // Count
    const countMax = showCount && typeof showCount === 'object' ? showCount.max : maxLength;
    const currentLen = [...innerValue].length; // unicode-safe
    const showCountEl = showCount !== false;

    const classes = classNames(
      `${prefixCls}-textarea`,
      {
        [`${prefixCls}-textarea-status-${status}`]: status,
        [`${prefixCls}-textarea-disabled`]: disabled,
        [`${prefixCls}-textarea-no-resize`]: !resize,
        [`${prefixCls}-textarea-autosize`]: !!autoSize,
      },
      className
    );

    const setRefs = (el: HTMLTextAreaElement | null) => {
      (taRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    };

    return (
      <div className={`${prefixCls}-textarea-wrapper`}>
        <textarea
          {...restProps}
          ref={setRefs}
          className={classes}
          style={{ ...style, ...(resize === false ? { resize: 'none' } : {}) }}
          disabled={disabled}
          maxLength={maxLength}
          value={value !== undefined ? value : innerValue}
          defaultValue={
            value === undefined && defaultValue !== undefined ? defaultValue : undefined
          }
          onChange={handleChange}
        />
        {showCountEl && (
          <span className={`${prefixCls}-textarea-count`}>
            {countMax !== undefined ? `${currentLen} / ${countMax}` : currentLen}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// Attach TextArea to Input for `Input.TextArea` pattern
(Input as typeof Input & { TextArea: typeof TextArea }).TextArea = TextArea;
