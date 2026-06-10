import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';
import type { InputSize } from '../Input/Input';

/**
 * Propiedades del componente InputOTP.
 * Especializado en capturar contraseñas de un solo uso (One-Time Passwords) o códigos de verificación.
 * Maneja automáticamente el focus saltando al siguiente campo, el pegado masivo de códigos, y la navegación con flechas.
 */
export interface InputOTPProps {
  /**
   * Cantidad de cuadros de texto (dígitos) que tendrá el código OTP.
   * @default 4
   */
  length?: number;

  /**
   * Valor actual del OTP completo (como un solo string continuo).
   */
  value?: string;

  /**
   * Callback ejecutado cada vez que cambia el valor, entregando el string concatenado.
   */
  onChange?: (value: string) => void;

  /**
   * Estado de validación.
   * - `error`: Bordes rojos, usualmente cuando el usuario ingresó un código incorrecto.
   * - `warning`: Bordes amarillos.
   */
  status?: 'error' | 'warning' | '';

  /**
   * Deshabilita todos los campos, impidiendo la escritura.
   * @default false
   */
  disabled?: boolean;

  /**
   * El tamaño visual de los cuadros. Hereda el `componentSize` del
   * ConfigProvider más cercano si no se especifica explícitamente,
   * igual que `<Input>`.
   * @default 'middle'
   */
  size?: InputSize;

  /**
   * Determina el tipo de input de cada cuadro y el comportamiento de validación.
   * - `number`: Solo acepta dígitos y abre el teclado numérico en móviles.
   * - `text`: Acepta caracteres alfanuméricos.
   * - `password`: Oculta visualmente el dígito ingresado.
   *
   * @default 'text'
   */
  inputType?: 'number' | 'text' | 'password';

  /**
   * Clases CSS opcionales para el contenedor del componente.
   */
  className?: string;

  /**
   * Estilos CSS en línea para el contenedor.
   */
  style?: React.CSSProperties;
}

export const InputOTP: React.FC<InputOTPProps> = ({
  length = 4,
  value = '',
  onChange,
  status = '',
  disabled = false,
  size,
  inputType = 'text',
  className,
  style,
}) => {
  const { getPrefixCls, size: contextSize } = useConfig();
  const prefixCls = getPrefixCls?.('otp') || getDefaultPrefixCls('otp');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Resolution order matches <Input>: explicit prop > ConfigProvider
  // context > built-in default ('middle'). The InputOTP previously
  // ignored the context — wrapping a tree in
  // `<ConfigProvider componentSize="large">` left every OTP at middle.
  const mergedSize: InputSize = size || contextSize || 'middle';

  // Split value into array, padding with empty strings
  const values = value.split('').slice(0, length);
  while (values.length < length) {
    values.push('');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newVal = e.target.value.slice(-1);

    // Only allow digits
    if (newVal && !/^\d+$/.test(newVal)) return;

    if (!newVal && e.target.value !== '') return;

    const newValues = [...values];
    newValues[index] = newVal;
    const combinedValue = newValues.join('');

    onChange?.(combinedValue);

    // Auto focus next
    if (newVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;
    onChange?.(pastedData);

    // Focus the box after the last pasted character
    const targetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  const containerClasses = classNames(
    prefixCls,
    {
      [`${prefixCls}-${mergedSize}`]: mergedSize !== 'middle',
      [`${prefixCls}-status-${status}`]: status,
      [`${prefixCls}-disabled`]: disabled,
    },
    className
  );

  return (
    <div className={containerClasses} style={style} onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el!;
          }}
          type={inputType === 'number' ? 'tel' : inputType}
          value={values[index]}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className={`${prefixCls}-input`}
          autoComplete="one-time-code"
          pattern={inputType === 'number' ? '[0-9]*' : undefined}
          inputMode={inputType === 'number' ? 'numeric' : 'text'}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
};

InputOTP.displayName = 'InputOTP';
