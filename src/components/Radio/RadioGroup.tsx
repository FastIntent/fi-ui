import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { RadioGroupContext } from './context';
import type { RadioChangeEvent } from './Radio';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

export type { RadioGroupContextProps } from './context';

export interface RadioGroupProps {
  /** Valor seleccionado actualmente. */
  value?: unknown;
  /** Valor inicial. */
  defaultValue?: unknown;
  /** Callback cuando cambia la selección del grupo. */
  onChange?: (e: RadioChangeEvent) => void;
  /** Deshabilita todos los radios del grupo. */
  disabled?: boolean;
  /** Dirección del flujo de los radios. */
  direction?: 'horizontal' | 'vertical';
  /** Clases CSS. */
  className?: string;
  /** Estilos. */
  style?: React.CSSProperties;
  /** Radios hijos. */
  children?: React.ReactNode;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const {
    className,
    style,
    children,
    direction = 'horizontal',
    disabled,
    value: propsValue,
    defaultValue,
    onChange,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('radio-group') || getDefaultPrefixCls('radio-group');

  const [value, setValue] = React.useState(propsValue !== undefined ? propsValue : defaultValue);

  React.useEffect(() => {
    if (propsValue !== undefined) {
      setValue(propsValue);
    }
  }, [propsValue]);

  const onRadioChange = (e: RadioChangeEvent) => {
    const lastValue = value;
    const val = e.target.value;
    if (propsValue === undefined) {
      setValue(val);
    }
    if (onChange && val !== lastValue) {
      onChange(e);
    }
  };

  const groupContextValue = React.useMemo(
    () => ({
      onChange: onRadioChange,
      value,
      disabled,
    }),
    [onRadioChange, value, disabled]
  );

  const classes = classNames(prefixCls, `${prefixCls}-${direction}`, className);

  return (
    <div className={classes} style={style} ref={ref}>
      <RadioGroupContext.Provider value={groupContextValue}>{children}</RadioGroupContext.Provider>
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';
