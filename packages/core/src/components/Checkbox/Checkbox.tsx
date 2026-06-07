import React, { forwardRef } from 'react';
import RcCheckbox from '@rc-component/checkbox';
import type { CheckboxProps as RcCheckboxProps, CheckboxRef } from '@rc-component/checkbox';
import classNames from 'classnames';
import { Wave } from '../Wave/Wave';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';
import { CheckboxGroup } from './CheckboxGroup';

/**
 * Evento de cambio para el componente Checkbox.
 */
export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
    type?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    indeterminate?: boolean;
    [key: string]: unknown;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: Event; // Allow for both React.ChangeEvent and native Event
}

/**
 * Propiedades del componente Checkbox.
 */
export interface CheckboxProps {
  /**
   * Estado de selección controlado.
   */
  checked?: boolean;

  /**
   * Estado de selección por defecto (para uso no controlado).
   */
  defaultChecked?: boolean;

  /**
   * Deshabilita el checkbox.
   */
  disabled?: boolean;

  /**
   * Callback que se ejecuta cuando cambia el estado de selección.
   */
  onChange?: (e: CheckboxChangeEvent) => void;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;

  /**
   * Etiqueta de texto (o nodo de React) que se mostrará junto al checkbox y que
   * responderá a los eventos de clic para alternar el checkbox.
   */
  children?: React.ReactNode;

  /**
   * ID único para el elemento `<input>`. Útil para pruebas automatizadas o para asociar un `<label>` externo.
   */
  id?: string;

  /**
   * Estado de validación del checkbox (útil para formularios).
   * - `error`: Pinta el borde de color rojo.
   */
  status?: 'error' | '';

  /**
   * Determina si el checkbox está en estado "indeterminado" (una línea horizontal en lugar de la marca de verificación).
   * Esto es muy útil en interfaces de selección múltiple ("Seleccionar Todo") cuando solo
   * una parte de los elementos hijos están seleccionados.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Tipo subyacente del input HTML. En este componente casi siempre debe ser `checkbox`.
   *
   * @default 'checkbox'
   */
  type?: 'checkbox' | 'radio';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    className,
    children,
    style,
    disabled,
    indeterminate,
    type = 'checkbox',
    status,
    onChange,
    ...rest
  } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('checkbox') || getDefaultPrefixCls('checkbox');
  const innerRef = React.useRef<CheckboxRef>(null);

  React.useImperativeHandle(ref, () => innerRef.current?.input as HTMLInputElement);

  React.useEffect(() => {
    if (innerRef.current && innerRef.current.input) {
      innerRef.current.input.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const wrapperCls = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-disabled`]: disabled,
      [`${prefixCls}-wrapper-status-error`]: status === 'error',
      [`${prefixCls}-wrapper-indeterminate`]: indeterminate,
    },
    className
  );

  return (
    <label className={wrapperCls} style={style}>
      <Wave disabled={disabled}>
        <span className={`${prefixCls}-wave-wrapper`}>
          <RcCheckbox
            {...rest}
            type={type}
            disabled={disabled}
            prefixCls={prefixCls}
            onChange={onChange as RcCheckboxProps['onChange']}
            ref={innerRef}
          />
        </span>
      </Wave>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

const CheckboxWithGroup = Checkbox as typeof Checkbox & { Group: typeof CheckboxGroup };
CheckboxWithGroup.Group = CheckboxGroup;

export { CheckboxWithGroup as Checkbox };
