import React from 'react';
import classNames from 'classnames';
import { useConfig, usePrefixCls } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';

/**
 * Propiedades del componente Tag.
 * Se utiliza para clasificar o etiquetar contenido, ofreciendo colores predefinidos o personalizados, y la opción de cerrar/eliminar la etiqueta.
 *
 * @example
 * ```tsx
 * <Tag color="success" closable onClose={() => console.log('cerrado')}>
 *   Operación Exitosa
 * </Tag>
 * ```
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Define el color de fondo y borde de la etiqueta.
   * Puede ser uno de los estados semánticos predefinidos o cualquier valor de color válido en CSS (hex, rgb, etc.).
   *
   * **Estados Predefinidos:**
   * - `success`: Verde, para éxito o completado.
   * - `processing`: Azul, para tareas en curso.
   * - `error`: Rojo, para fallos o alertas graves.
   * - `warning`: Amarillo/Naranja, para advertencias.
   * - `default`: Gris claro, para uso genérico.
   *
   * @default 'default'
   */
  color?: 'success' | 'processing' | 'error' | 'warning' | 'default' | string;

  /**
   * Determina si la etiqueta muestra un icono de "X" y puede ser cerrada/eliminada por el usuario.
   * Si es `true`, al hacer clic en la "X" el Tag se desmontará automáticamente a menos que prevengas el evento por defecto en `onClose`.
   *
   * @default false
   */
  closable?: boolean;

  /**
   * Callback que se ejecuta cuando el usuario hace clic en el icono de cerrar.
   * Para evitar que el componente se cierre y desaparezca automáticamente del DOM,
   * puedes llamar a `e.preventDefault()` dentro de esta función.
   *
   * @param e - Evento de clic nativo de React.
   */
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Determina si la etiqueta debe tener un borde exterior visible.
   * Cuando se desactiva, la etiqueta se verá más plana (útil para estilos tipo "pill" o chips en fondos contrastantes).
   *
   * @default true
   */
  bordered?: boolean;

  /**
   * Un nodo de React (comúnmente un elemento `<svg>` o un icono) que se renderizará
   * a la izquierda del texto de la etiqueta, ayudando a contextualizar el contenido.
   *
   * @example
   * ```tsx
   * <Tag icon={<CheckCircleOutlined />}>Aprobado</Tag>
   * ```
   */
  icon?: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({
  children,
  className,
  color = 'default',
  closable,
  onClose,
  bordered = true,
  icon,
  style,
  ...props
}) => {
  const prefixCls = usePrefixCls('tag');
  const { locale: contextLocale } = useConfig();
  const tagLocale = contextLocale?.Tag || defaultLocale.Tag!;
  const [visible, setVisible] = React.useState(true);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClose?.(e);
    if (!e.defaultPrevented) {
      setVisible(false);
    }
  };

  const handleCloseKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    e.preventDefault();
    e.stopPropagation();
    onClose?.(e as unknown as React.MouseEvent<HTMLElement>);
    if (!e.defaultPrevented) {
      setVisible(false);
    }
  };

  if (!visible) return null;

  const isPresetColor = ['success', 'processing', 'error', 'warning', 'default'].includes(color);

  const tagCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-${color}`]: isPresetColor,
      [`${prefixCls}-has-color`]: color && !isPresetColor,
      [`${prefixCls}-borderless`]: !bordered,
    },
    className
  );

  const tagStyle: React.CSSProperties = {
    ...style,
    ...(color && !isPresetColor
      ? { backgroundColor: color, borderColor: color, color: '#fff' }
      : {}),
  };

  return (
    <span className={tagCls} style={tagStyle} {...props}>
      {icon && <span className={`${prefixCls}-icon`}>{icon}</span>}
      <span className={`${prefixCls}-content`}>{children}</span>
      {closable && (
        <span
          role="button"
          aria-label={tagLocale.closeAriaLabel}
          tabIndex={0}
          className={`${prefixCls}-close-icon`}
          onClick={handleClose}
          onKeyDown={handleCloseKeyDown}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
};

export { Tag };

Tag.displayName = 'Tag';
