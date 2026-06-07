import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades del componente Badge.
 * Pequeña insignia numérica o de estado para indicar conteos o estados.
 */
export interface BadgeProps {
  /**
   * Número mostrado dentro de la insignia.
   */
  count?: React.ReactNode;

  /**
   * Número máximo que se muestra. Si el conteo es mayor, se muestra `{overflowCount}+`.
   * @default 99
   */
  overflowCount?: number;

  /**
   * Si es `true`, solo muestra un punto rojo sin número.
   * @default false
   */
  dot?: boolean;

  /**
   * Si es `true`, la insignia se oculta cuando el conteo es 0.
   * @default false
   */
  showZero?: boolean;

  /**
   * Establece el color de la insignia (fondo en `filled`, borde/texto en `outline`).
   */
  color?: string;

  /**
   * Variante visual del badge standalone.
   * - `filled`: fondo sólido, texto blanco (default).
   * - `outline`: solo borde y texto con el color, sin fondo.
   */
  variant?: 'filled' | 'outline';

  /**
   * Icono que se muestra a la izquierda del conteo en badges standalone.
   */
  icon?: React.ReactNode;

  /**
   * Estado de la insignia cuando se usa sin hijos.
   * - `success`, `processing`, `default`, `error`, `warning`.
   */
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';

  /**
   * Texto que acompaña al estado (solo cuando se usa `status`).
   */
  text?: React.ReactNode;

  /**
   * El elemento al cual se le añade la insignia.
   */
  children?: React.ReactNode;

  /**
   * Desplazamiento de la insignia [x, y].
   */
  offset?: [number | string, number | string];

  /**
   * Clases CSS adicionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = (props) => {
  const {
    count,
    overflowCount = 99,
    dot = false,
    showZero = false,
    color,
    variant = 'filled',
    icon,
    status,
    text,
    children,
    offset,
    className,
    style,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('badge') || getDefaultPrefixCls('badge');

  const isZero = count === 0 || count === '0';
  const showBadge = (count !== null && count !== undefined && (!isZero || showZero)) || dot;

  // ── Standalone pill badge (no overlay children) ──────────────────────────
  // Renders when there are no children AND count/icon is provided with a color,
  // OR when icon is provided (icon-only pill).
  const isStandalonePill = !children && !status && (color || icon) && !dot;

  if (isStandalonePill) {
    let displayCount: React.ReactNode = count;
    if (typeof count === 'number' && count > overflowCount) {
      displayCount = `${overflowCount}+`;
    }

    const pillCls = classNames(`${prefixCls}-pill`, `${prefixCls}-pill-${variant}`, className);

    const pillStyle: React.CSSProperties =
      variant === 'filled'
        ? { backgroundColor: color, ...style }
        : { borderColor: color, color, ...style };

    return (
      <span className={pillCls} style={pillStyle}>
        {icon && <span className={`${prefixCls}-pill-icon`}>{icon}</span>}
        {displayCount !== undefined && displayCount !== null && displayCount !== '' && (
          <span className={`${prefixCls}-pill-count`}>{displayCount}</span>
        )}
      </span>
    );
  }

  // ── Status dot (no children, status or bare color) ────────────────────────
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-status`]: !!status,
      [`${prefixCls}-not-a-wrapper`]: !children,
    },
    className
  );

  if (!children && status) {
    const statusCls = classNames(`${prefixCls}-status-dot`, {
      [`${prefixCls}-status-${status}`]: !!status,
    });
    const statusStyle: React.CSSProperties = color ? { backgroundColor: color } : {};

    return (
      <span className={classes} style={style}>
        <span className={statusCls} style={statusStyle} />
        {text && <span className={`${prefixCls}-status-text`}>{text}</span>}
      </span>
    );
  }

  // ── Overlay badge (wraps children) ────────────────────────────────────────
  const renderCount = () => {
    if (!showBadge) return null;

    if (dot) {
      const dotStyle: React.CSSProperties = color ? { backgroundColor: color } : {};
      return <span className={`${prefixCls}-dot`} style={dotStyle} />;
    }

    let displayCount: React.ReactNode = count;
    if (typeof count === 'number' && count > overflowCount) {
      displayCount = `${overflowCount}+`;
    }

    const countStyle: React.CSSProperties = {
      ...(color ? { backgroundColor: color } : {}),
      ...(offset ? { right: -Number(offset[0]), marginTop: offset[1] } : {}),
    };

    return (
      <span className={`${prefixCls}-count`} style={countStyle}>
        {displayCount}
      </span>
    );
  };

  return (
    <span className={classes} style={style}>
      {children}
      {renderCount()}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };
