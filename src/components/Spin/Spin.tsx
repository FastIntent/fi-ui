import React, { useEffect, useId, useState } from 'react';
import classNames from 'classnames';
import './Spin.scss';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

export type SpinSize = 'small' | 'middle' | 'large';
export type SpinType = 'default' | 'comet';

/**
 * Propiedades del componente Spin.
 * Indicador de carga que puede usarse standalone o envolviendo contenido.
 */
export interface SpinProps {
  /**
   * Si el spinner está activo.
   * @default true
   */
  spinning?: boolean;

  /**
   * Tamaño del spinner.
   * @default 'middle'
   */
  size?: SpinSize;

  /**
   * Variante visual del spinner.
   * - 'default': cuatro puntos animados
   * - 'comet': arco giratorio con difuminado
   * @default 'default'
   */
  type?: SpinType;

  /**
   * Texto descriptivo mostrado debajo del spinner.
   */
  tip?: React.ReactNode;

  /**
   * Indicador personalizado que reemplaza el spinner por defecto.
   */
  indicator?: React.ReactNode;

  /**
   * Retardo en ms antes de mostrar el spinner (evita flash en cargas rápidas).
   * @default 0
   */
  delay?: number;

  /**
   * Si es true, cubre toda la pantalla con un backdrop.
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Contenido que será envuelto por el Spin. Cuando se provee,
   * el spinner se superpone sobre el contenido.
   */
  children?: React.ReactNode;

  /**
   * Clase CSS adicional para el contenedor wrapper (solo cuando hay children).
   */
  wrapperClassName?: string;

  /**
   * Clase CSS adicional para el spinner.
   */
  className?: string;

  /**
   * Estilos en línea.
   */
  style?: React.CSSProperties;
}

const defaultIndicator = (prefixCls: string) => (
  <span className={`${prefixCls}-dot ${prefixCls}-dot-spin`}>
    <i className={`${prefixCls}-dot-item`} />
    <i className={`${prefixCls}-dot-item`} />
    <i className={`${prefixCls}-dot-item`} />
    <i className={`${prefixCls}-dot-item`} />
  </span>
);

const CometIndicator: React.FC<{ prefixCls: string }> = ({ prefixCls }) => {
  const uid = useId();
  const gradientId = `${prefixCls}-comet-grad-${uid.replace(/:/g, '')}`;
  return (
    <svg
      className={`${prefixCls}-comet`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="50"
          y1="8"
          x2="14"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="35%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M 50 8 A 42 42 0 1 1 14 29"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Spin: React.FC<SpinProps> = ({
  spinning = true,
  size = 'middle',
  type = 'default',
  tip,
  indicator,
  delay = 0,
  fullscreen = false,
  children,
  wrapperClassName,
  className,
  style,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('spin') || getDefaultPrefixCls('spin');

  // Delay support: debounce visibility to avoid flash on fast loads
  const [visible, setVisible] = useState(delay === 0 ? spinning : false);

  useEffect(() => {
    if (!delay) {
      setVisible(spinning);
      return undefined;
    }
    if (spinning) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
    setVisible(false);
    return undefined;
  }, [spinning, delay]);

  const spinnerNode =
    indicator ??
    (type === 'comet' ? <CometIndicator prefixCls={prefixCls} /> : defaultIndicator(prefixCls));

  const spinCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-spinning`]: visible,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-show-text`]: !!tip,
      [`${prefixCls}-fullscreen`]: fullscreen,
    },
    className
  );

  const spinElement = (
    <div
      className={spinCls}
      style={children ? undefined : style}
      aria-live="polite"
      aria-busy={visible}
    >
      {visible && (
        <>
          {spinnerNode}
          {tip && <div className={`${prefixCls}-text`}>{tip}</div>}
        </>
      )}
    </div>
  );

  // Fullscreen mode: portal-like fixed overlay
  if (fullscreen) {
    return visible ? (
      <div className={`${prefixCls}-fullscreen-container`}>{spinElement}</div>
    ) : null;
  }

  // Wrapper mode: overlay on top of children
  if (children) {
    return (
      <div className={classNames(`${prefixCls}-nested-loading`, wrapperClassName)} style={style}>
        {visible && spinElement}
        <div
          className={classNames(`${prefixCls}-container`, {
            [`${prefixCls}-blur`]: visible,
          })}
        >
          {children}
        </div>
      </div>
    );
  }

  // Standalone mode
  return spinElement;
};

Spin.displayName = 'Spin';
