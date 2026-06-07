import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Wave } from '../Wave/Wave';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

export type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text' | 'danger';
export type ButtonSize = 'large' | 'middle' | 'small';

/**
 * Propiedades del componente Button.
 * Extiende las propiedades nativas de un elemento `<button>` de HTML.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * Determina la jerarquía visual y el color del botón.
   * - `primary`: Para la acción principal (ej. Guardar).
   * - `default`: Para acciones secundarias (fondo blanco con borde).
   * - `link` / `text`: Para acciones menos intrusivas.
   * - `dashed`: Bordes punteados, comúnmente usado para acciones como "Añadir".
   *
   * @default 'default'
   */
  type?: ButtonType;

  /**
   * El tipo nativo del botón HTML.
   * Usa `submit` si el botón está dentro de un `<form>`.
   *
   * @default 'button'
   */
  htmlType?: 'button' | 'submit' | 'reset';

  /**
   * El tamaño del botón.
   * @default 'middle'
   */
  size?: ButtonSize;

  /**
   * Establece el estado de peligro del botón (color rojo).
   * Ideal para acciones destructivas como "Eliminar" o "Borrar".
   *
   * @default false
   */
  danger?: boolean;

  /**
   * Deshabilita el botón, impidiendo que el usuario pueda hacer clic en él.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Forma del botón.
   * @default 'default'
   */
  shape?: 'default' | 'circle' | 'round';

  /**
   * Ajusta el ancho del botón para que ocupe el 100% del contenedor padre.
   *
   * @default false
   */
  block?: boolean;

  /**
   * Muestra un indicador de carga animado (spinner) y deshabilita temporalmente el clic.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Icono que se colocará dentro del botón (alias de prefixIcon).
   */
  icon?: React.ReactNode;

  /**
   * Icono que se colocará a la izquierda del texto del botón.
   */
  prefixIcon?: React.ReactNode;

  /**
   * Icono que se colocará a la derecha del texto del botón.
   */
  suffixIcon?: React.ReactNode;

  /**
   * Clases CSS adicionales para customizar el contenedor.
   */
  className?: string;

  /**
   * El texto o contenido que irá dentro del botón.
   */
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'default',
      htmlType = 'button',
      size,
      shape = 'default',
      danger = false,
      disabled = false,
      block = false,
      loading = false,
      icon,
      prefixIcon,
      suffixIcon,
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    const { size: contextSize, getPrefixCls } = useConfig();
    const basePrefixCls = getDefaultPrefixCls('btn');
    const prefixCls = getPrefixCls?.('btn') || basePrefixCls;
    const mergedSize = size || contextSize || 'middle';
    const isIconOnly = !children && Boolean(icon || prefixIcon || suffixIcon || loading);
    const getClassNames = (suffix = '') =>
      classNames(
        `${basePrefixCls}${suffix}`,
        prefixCls !== basePrefixCls && `${prefixCls}${suffix}`
      );

    const classes = classNames(
      getClassNames(),
      getClassNames(`-${type}`),
      shape !== 'default' && getClassNames(`-${shape}`),
      mergedSize !== 'middle' && getClassNames(`-${mergedSize}`),
      danger && getClassNames('-danger'),
      block && getClassNames('-block'),
      loading && getClassNames('-loading'),
      (disabled || loading) && getClassNames('-disabled'),
      isIconOnly && getClassNames('-icon-only'),
      className
    );

    const buttonNode = (
      <button
        {...restProps}
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        type={htmlType}
      >
        {/* If loading, spinner overrides prefixIcon completely to avoid layout shift */}
        {loading ? (
          <span className={getClassNames('-loading-icon')}></span>
        ) : (
          (icon || prefixIcon) && (
            <span className={getClassNames('-prefix-icon')}>{icon || prefixIcon}</span>
          )
        )}
        {children && <span className={getClassNames('-content')}>{children}</span>}
        {suffixIcon && <span className={getClassNames('-suffix-icon')}>{suffixIcon}</span>}
      </button>
    );

    // Link and Text variants don't trigger the Wave animation usually
    if (type === 'link' || type === 'text' || disabled || loading) {
      return buttonNode;
    }

    return <Wave disabled={disabled || loading}>{buttonNode}</Wave>;
  }
);

Button.displayName = 'Button';
