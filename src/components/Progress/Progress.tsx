import React from 'react';
import { Line, Circle } from '@rc-component/progress';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades del componente Progress.
 * Visualiza el estado actual de un proceso o tarea.
 */
export interface ProgressProps {
  /**
   * El tipo de progreso a mostrar.
   * @default 'line'
   */
  type?: 'line' | 'circle' | 'dashboard';

  /**
   * El porcentaje de progreso completado (0 a 100).
   * @default 0
   */
  percent?: number;

  /**
   * Si es `true`, el progreso mostrará una animación de movimiento (solo en `type="line"`).
   * @default false
   */
  active?: boolean;

  /**
   * El estado actual del progreso. Determina el color.
   * - `success`: Color verde.
   * - `exception`: Color rojo.
   * - `normal`: Color primario.
   */
  status?: 'normal' | 'success' | 'exception' | 'active';

  /**
   * El ancho de la línea de progreso (en píxeles).
   * @default 8
   */
  strokeWidth?: number;

  /**
   * El color de la línea de progreso.
   */
  strokeColor?: string | string[] | object;

  /**
   * El color del riel (fondo) del progreso.
   */
  trailColor?: string;

  /**
   * Si es `true`, muestra el texto del porcentaje.
   * @default true
   */
  showInfo?: boolean;

  /**
   * Función para formatear el texto que se muestra.
   */
  format?: (percent?: number) => React.ReactNode;

  /**
   * El tamaño visual del progreso (en píxeles). Solo aplica a `circle` o `dashboard`.
   * @default 120
   */
  width?: number;

  /**
   * Clases CSS adicionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

const Progress: React.FC<ProgressProps> = (props) => {
  const {
    type = 'line',
    percent = 0,
    status,
    showInfo = true,
    strokeWidth,
    strokeColor,
    trailColor,
    format,
    width = 120,
    active,
    className,
    style,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('progress') || getDefaultPrefixCls('progress');

  const progressStatus = status || (percent >= 100 ? 'success' : 'normal');

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-status-${progressStatus}`]: progressStatus,
      [`${prefixCls}-active`]: active || progressStatus === 'active',
    },
    className
  );

  const renderInfo = () => {
    if (!showInfo) return null;
    let text: React.ReactNode;
    const textFormatter = format || ((p) => `${p}%`);

    if (progressStatus === 'success') {
      text = textFormatter(100);
    } else if (progressStatus === 'exception') {
      text = textFormatter(percent);
    } else {
      text = textFormatter(percent);
    }

    return <span className={`${prefixCls}-text`}>{text}</span>;
  };

  let progressElement: React.ReactNode;

  if (type === 'line') {
    const percentStyle: React.CSSProperties = {
      width: `${percent}%`,
      height: strokeWidth || 8,
      backgroundColor: typeof strokeColor === 'string' ? strokeColor : undefined,
    };

    const innerStyle: React.CSSProperties = {
      backgroundColor: trailColor,
    };

    progressElement = (
      <div className={`${prefixCls}-line`}>
        <div className={`${prefixCls}-outer`}>
          <div className={`${prefixCls}-inner`} style={innerStyle}>
            <div className={`${prefixCls}-bg`} style={percentStyle} />
          </div>
        </div>
        {renderInfo()}
      </div>
    );
  } else {
    progressElement = (
      <div className={`${prefixCls}-circle`} style={{ width, height: width }}>
        <Circle
          percent={percent}
          strokeWidth={strokeWidth || 6}
          strokeColor={strokeColor as Record<string, string>}
          railColor={trailColor}
          prefixCls={prefixCls}
        />
        {showInfo && <div className={`${prefixCls}-circle-text`}>{renderInfo()}</div>}
      </div>
    );
  }

  return (
    <div className={classes} style={style}>
      {progressElement}
    </div>
  );
};

Progress.displayName = 'Progress';

export { Progress };
