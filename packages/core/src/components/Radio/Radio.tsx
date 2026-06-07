import React, { forwardRef, useContext } from 'react';
import RcCheckbox from '@rc-component/checkbox';
import type { CheckboxProps as RcCheckboxProps, CheckboxRef } from '@rc-component/checkbox';
import classNames from 'classnames';
import { Wave } from '../Wave/Wave';
import { RadioGroup } from './RadioGroup';
import { RadioButton } from './RadioButton';
import { RadioGroupContext, RadioGroupContextProps } from './context';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Evento de cambio para el componente Radio.
 */
export interface RadioChangeEvent {
  target: {
    checked: boolean;
    value?: string | number | boolean;
    type?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: unknown;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: Event;
}

/**
 * Propiedades del componente Radio.
 */
export interface RadioProps {
  /** Valor único que representa este Radio dentro de un Grupo. */
  value?: unknown;
  /** Determina si está seleccionado. */
  checked?: boolean;
  /** Estado inicial si no es controlado. */
  defaultChecked?: boolean;
  /** Deshabilita el componente. */
  disabled?: boolean;
  /** Callback al cambiar el estado. */
  onChange?: (e: RadioChangeEvent) => void;
  /** Clases CSS adicionales. */
  className?: string;
  /** Estilos en línea. */
  style?: React.CSSProperties;
  /** Etiqueta de texto. */
  children?: React.ReactNode;
  /** ID para el input. */
  id?: string;
}

interface CompoundedComponent extends React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<unknown>
> {
  Group: typeof RadioGroup;
  Button: typeof RadioButton;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const context = useContext(RadioGroupContext) as RadioGroupContextProps | null;
  const { className, children, style, disabled, ...rest } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('radio') || getDefaultPrefixCls('radio');
  const innerRef = React.useRef<CheckboxRef>(null);

  React.useImperativeHandle(ref, () => innerRef.current?.input as HTMLInputElement);

  // Always start with the prop's own disabled value so standalone <Radio disabled>
  // correctly applies the disabled class and attribute.
  const radioProps: RadioProps = { ...rest, disabled };

  if (context) {
    const { onChange: contextOnChange, value: contextValue, disabled: contextDisabled } = context;

    radioProps.onChange = (e) => {
      props.onChange?.(e);
      contextOnChange?.(e);
    };
    radioProps.checked = props.value === contextValue;
    radioProps.disabled = disabled || contextDisabled;
  }

  const wrapperCls = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-checked`]: radioProps.checked,
      [`${prefixCls}-wrapper-disabled`]: radioProps.disabled,
    },
    className
  );

  return (
    <label className={wrapperCls} style={style}>
      <Wave disabled={radioProps.disabled}>
        <span className={`${prefixCls}-wave-wrapper`}>
          <RcCheckbox
            {...(radioProps as Omit<RcCheckboxProps, 'onChange'>)}
            type="radio"
            prefixCls={prefixCls}
            onChange={radioProps.onChange as RcCheckboxProps['onChange']}
            ref={innerRef}
          />
        </span>
      </Wave>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
}) as CompoundedComponent;

Radio.displayName = 'Radio';
Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export { Radio };
