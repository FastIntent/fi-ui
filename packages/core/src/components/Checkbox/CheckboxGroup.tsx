import React from 'react';
import classNames from 'classnames';
import { Checkbox } from './Checkbox';
import type { CheckboxChangeEvent } from './Checkbox';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface CheckboxGroupProps {
  /** Lista de opciones como strings o configuración de objeto. */
  options?: (string | CheckboxOptionType)[];
  /** Valores actualmente marcados (controlado). */
  value?: string[];
  /** Valores marcados por defecto (no controlado). */
  defaultValue?: string[];
  /** Deshabilita todos los checkboxes del grupo. */
  disabled?: boolean;
  /** Callback al cambiar la selección, recibe el array de valores marcados. */
  onChange?: (checkedValues: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value: valueProp,
  defaultValue,
  disabled,
  onChange,
  className,
  style,
  children,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('checkbox') || getDefaultPrefixCls('checkbox');

  const [checkedValues, setCheckedValues] = React.useState<string[]>(
    valueProp !== undefined ? valueProp : (defaultValue ?? [])
  );

  // Sync when controlled value changes
  React.useEffect(() => {
    if (valueProp !== undefined) {
      setCheckedValues(valueProp);
    }
  }, [valueProp]);

  const handleChange = (optionValue: string, checked: boolean) => {
    const next = checked
      ? [...checkedValues, optionValue]
      : checkedValues.filter((v) => v !== optionValue);

    if (valueProp === undefined) {
      setCheckedValues(next);
    }
    onChange?.(next);
  };

  const cls = classNames(`${prefixCls}-group`, className);

  // Render from `options` prop
  if (options && options.length > 0) {
    const normalizedOptions: CheckboxOptionType[] = options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    return (
      <div className={cls} style={style}>
        {normalizedOptions.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={checkedValues.includes(opt.value)}
            disabled={disabled || opt.disabled}
            style={opt.style}
            onChange={(e: CheckboxChangeEvent) => handleChange(opt.value, e.target.checked)}
          >
            {opt.label}
          </Checkbox>
        ))}
      </div>
    );
  }

  // Render children directly (manual layout)
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
