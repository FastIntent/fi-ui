import React, { forwardRef } from 'react';
import RcSwitch from '@rc-component/switch';
import classNames from 'classnames';
import { Wave } from '../Wave/Wave';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Switch.
 * Un interruptor (toggle) diseñado para alternar entre dos estados (encendido/apagado).
 * Es un reemplazo visual moderno para los clásicos checkboxes.
 */
export interface SwitchProps {
  /**
   * Determina si el interruptor está encendido (true) o apagado (false).
   * Al proveer esto, el componente se vuelve "controlado".
   */
  checked?: boolean;

  /**
   * El estado inicial del interruptor cuando se usa de forma no controlada.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Deshabilita el interruptor, haciéndolo de solo lectura y previniendo clics.
   * @default false
   */
  disabled?: boolean;

  /**
   * Muestra un icono de carga giratorio (spinner) dentro del botón del interruptor.
   * También deshabilita el componente automáticamente mientras carga.
   * @default false
   */
  loading?: boolean;

  /**
   * El tamaño del interruptor.
   * `small` es muy útil para insertar el interruptor dentro de tablas o listas densas.
   * @default 'default'
   */
  size?: 'small' | 'default';

  /**
   * Callback que se ejecuta cuando el usuario hace clic en el interruptor.
   *
   * @param checked - El nuevo estado del interruptor.
   * @param event - El evento nativo de clic o teclado.
   */
  onChange?: (
    checked: boolean,
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
  ) => void;

  /**
   * Clases CSS opcionales para el contenedor del interruptor.
   */
  className?: string;

  /**
   * Estilos CSS en línea para el contenedor del interruptor.
   */
  style?: React.CSSProperties;

  /**
   * Texto o icono a mostrar en el interior del interruptor cuando está encendido (ON).
   *
   * @example
   * ```tsx
   * <Switch checkedChildren="Activado" unCheckedChildren="Desactivado" />
   * ```
   */
  checkedChildren?: React.ReactNode;

  /**
   * Texto o icono a mostrar en el interior del interruptor cuando está apagado (OFF).
   */
  unCheckedChildren?: React.ReactNode;

  /**
   * Estado de validación del interruptor (útil si forma parte de un formulario).
   * - `error`: Pinta el fondo del interruptor rojo para indicar un problema.
   */
  status?: 'error' | '';
}

const Switch = forwardRef<HTMLElement, SwitchProps>((props, ref) => {
  const { className, size, disabled, loading, ...rest } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('switch') || getDefaultPrefixCls('switch');
  const { size: contextSize } = useConfig();
  const mergedSize = size || contextSize || 'middle';

  const switchCls = classNames(
    {
      [`${prefixCls}-small`]: mergedSize === 'small',
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-status-error`]: props.status === 'error',
    },
    className
  );

  return (
    <Wave disabled={disabled || loading}>
      <RcSwitch
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        prefixCls={prefixCls}
        className={switchCls}
        disabled={disabled || loading}
        loadingIcon={loading ? <span className={`${prefixCls}-loading-icon`} /> : null}
      />
    </Wave>
  );
});

Switch.displayName = 'Switch';

export { Switch };
