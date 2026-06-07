import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades de un ítem individual de la línea de tiempo.
 */
export interface TimelineItemProps {
  /**
   * Color del punto (dot). Puede ser un color semántico o hexadecimal.
   * @default 'primary'
   */
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | string;

  /**
   * Icono o nodo personalizado para el punto.
   */
  dot?: React.ReactNode;

  /**
   * Indica si el ítem es el último y debe ocultar su línea de conexión.
   */
  isLast?: boolean;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Contenido del ítem (el evento o descripción).
   */
  children?: React.ReactNode;

  /**
   * Etiqueta de tiempo o fecha opcional.
   */
  label?: React.ReactNode;
}

/**
 * TimelineItem - Subcomponente para cada evento cronológico.
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({
  color = 'primary',
  dot,
  isLast,
  className,
  children,
  label,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('timeline-item') || getDefaultPrefixCls('timeline-item');
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-last`]: isLast,
    },
    className
  );

  const dotClasses = classNames(`${prefixCls}-dot`, {
    [`${prefixCls}-dot-${color}`]: ['primary', 'success', 'error', 'warning', 'info'].includes(
      color
    ),
  });

  const dotStyle = !['primary', 'success', 'error', 'warning', 'info'].includes(color)
    ? { borderColor: color, color }
    : {};

  return (
    <li className={classes}>
      {label && <div className={`${prefixCls}-label`}>{label}</div>}
      <div className={`${prefixCls}-tail`} />
      <div className={dotClasses} style={dotStyle}>
        {dot}
      </div>
      <div className={`${prefixCls}-content`}>{children}</div>
    </li>
  );
};

/**
 * Propiedades del componente Timeline.
 */
export interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Modo de visualización.
   * @default 'left'
   */
  mode?: 'left' | 'alternate' | 'right';

  /**
   * Nodos hijos (componentes `Timeline.Item`).
   */
  children?: React.ReactNode;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

interface TimelineInterface extends React.FC<TimelineProps> {
  Item: typeof TimelineItem;
}

/**
 * Timeline - Componente de visualización cronológica.
 */
export const Timeline: TimelineInterface = ({
  mode = 'left',
  children,
  className,
  style,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('timeline') || getDefaultPrefixCls('timeline');
  const classes = classNames(prefixCls, `${prefixCls}-mode-${mode}`, className);

  const renderedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      isLast: index === React.Children.count(children) - 1,
    });
  });

  return (
    <ul className={classes} style={style} {...props}>
      {renderedChildren}
    </ul>
  );
};

Timeline.Item = TimelineItem;
Timeline.displayName = 'Timeline';
