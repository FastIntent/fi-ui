import React, { useContext } from 'react';
import classNames from 'classnames';
import { RadioGroupContext, RadioGroupContextProps } from './context';
import type { RadioChangeEvent } from './Radio';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

export interface RadioButtonProps {
  value?: string | number | boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  disabled,
  className,
  style,
  children,
}) => {
  const context = useContext(RadioGroupContext) as RadioGroupContextProps | null;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('radio-button') || getDefaultPrefixCls('radio-button');

  const isChecked = context ? context.value === value : false;
  const isDisabled = disabled || context?.disabled;

  const handleClick = () => {
    if (isDisabled || !context) return;
    const e: RadioChangeEvent = {
      target: { checked: true, value },
      stopPropagation: () => {},
      preventDefault: () => {},
      nativeEvent: new Event('change'),
    };
    context.onChange?.(e);
  };

  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-checked`]: isChecked,
      [`${prefixCls}-disabled`]: isDisabled,
    },
    className
  );

  return (
    <label className={cls} style={style} onClick={handleClick}>
      <span className={`${prefixCls}-inner`}>{children}</span>
    </label>
  );
};

RadioButton.displayName = 'RadioButton';
