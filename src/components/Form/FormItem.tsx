import React, { useContext } from 'react';
import type { FieldProps } from '@rc-component/form/lib/Field';
import { Field } from '@rc-component/form';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';
import { FormContext } from './context';

export interface FormItemProps extends Omit<FieldProps, 'children'> {
  label?: React.ReactNode;
  children?: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  required?: boolean;
}

export const FormItem: React.FC<FormItemProps> = ({
  label,
  children,
  className,
  style,
  required,
  ...fieldProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('form-item') || getDefaultPrefixCls('form-item');
  const { requiredMark } = useContext(FormContext);

  // Show required mark if field is required and requiredMark is not explicitly false
  const showRequiredMark = required && requiredMark !== false;

  return (
    <Field {...fieldProps}>
      {(control, meta) => {
        const { errors } = meta;
        const hasError = errors.length > 0;

        // Clone child and inject status="error" if needed
        const childNode = React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
              ...control,
              status: hasError ? 'error' : (children.props as Record<string, unknown>).status,
            })
          : children;

        return (
          <div
            className={classNames(
              prefixCls,
              {
                [`${prefixCls}-has-error`]: hasError,
                [`${prefixCls}-required`]: showRequiredMark,
              },
              className
            )}
            style={style}
          >
            {label && (
              <div className={`${prefixCls}-label`}>
                <label title={typeof label === 'string' ? label : ''}>{label}</label>
              </div>
            )}
            <div className={`${prefixCls}-control`}>
              {childNode}
              {hasError && <div className={`${prefixCls}-explain`}>{errors[0]}</div>}
            </div>
          </div>
        );
      }}
    </Field>
  );
};
