import React from 'react';
import RCTooltip from '@rc-component/tooltip';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls, getPrefixedCssVarStyle } from '../ConfigProvider/prefix';

// ---------------------------------------------------------------------------
// Placement type — same union as Tooltip for API consistency
// ---------------------------------------------------------------------------
export type PopoverPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

export type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface PopoverProps {
  /**
   * Título que aparece en la cabecera del popover.
   * Si no se define, la cabecera queda oculta.
   */
  title?: React.ReactNode;

  /**
   * Contenido principal del cuerpo del popover.
   */
  content?: React.ReactNode;

  /**
   * Posición del popover respecto al elemento hijo.
   * @default 'top'
   */
  placement?: PopoverPlacement;

  /**
   * Evento(s) que abren/cierran el popover.
   * @default ['hover']
   */
  trigger?: PopoverTrigger | PopoverTrigger[];

  /**
   * Controlado externamente: si el popover está abierto.
   */
  open?: boolean;

  /**
   * Callback ejecutado cuando cambia la visibilidad del popover.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Retraso en segundos antes de mostrar el popover al hacer hover.
   * @default 0.1
   */
  mouseEnterDelay?: number;

  /**
   * Retraso en segundos antes de ocultar el popover al salir del hover.
   * @default 0.1
   */
  mouseLeaveDelay?: number;

  /**
   * Clase CSS adicional aplicada al overlay del popover.
   */
  overlayClassName?: string;

  /**
   * Estilos en línea adicionales aplicados al overlay del popover.
   */
  overlayStyle?: React.CSSProperties;

  /**
   * Color de fondo personalizado.
   */
  color?: string;

  /**
   * Clase CSS adicional aplicada al wrapper del componente.
   */
  className?: string;

  /**
   * Selector de prefijo CSS del popover.
   */
  prefixCls?: string;

  /**
   * El elemento hijo sobre el que el popover actúa como disparador.
   */
  children: React.ReactElement;

  /**
   * Función que retorna el contenedor donde se montará el popup.
   */
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  /**
   * Si el popover se destruye del DOM al cerrarse.
   * @default false
   */
  destroyTooltipOnHide?: boolean;

  /**
   * Estilos en línea para el elemento interno del popover.
   */
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Overlay content — title + content panel
// ---------------------------------------------------------------------------
const PopoverOverlay: React.FC<Pick<PopoverProps, 'title' | 'content' | 'prefixCls'>> = ({
  title,
  content,
  prefixCls = getDefaultPrefixCls('popover'),
}) => (
  <div className={`${prefixCls}-inner-content`}>
    {title !== undefined && title !== null && <div className={`${prefixCls}-title`}>{title}</div>}
    {content !== undefined && content !== null && (
      <div className={`${prefixCls}-inner-body`}>{content}</div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Popover component
// ---------------------------------------------------------------------------
export const Popover: React.FC<PopoverProps> = ({
  prefixCls: customPrefixCls,
  className,
  title,
  content,
  placement = 'top',
  trigger = ['hover'],
  open,
  onOpenChange,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  overlayClassName,
  overlayStyle: customOverlayStyle,
  color,
  children,
  getPopupContainer,
  destroyTooltipOnHide = false,
  style,
}) => {
  const {
    getPopupContainer: configGetPopupContainer,
    getPrefixCls,
    prefixCls: configPrefixCls,
  } = useConfig();
  const prefixCls = getPrefixCls?.('popover', customPrefixCls) || getDefaultPrefixCls('popover');

  const overlayStyle: React.CSSProperties = {
    ...customOverlayStyle,
    ...getPrefixedCssVarStyle({ 'popover-bg': color }, configPrefixCls),
  };

  const overlayNode = <PopoverOverlay title={title} content={content} prefixCls={prefixCls} />;

  const triggerArray = Array.isArray(trigger) ? trigger : [trigger];

  // Safe cast — rc-tooltip typings are not perfectly aligned with the DOM
  const TooltipComponent = RCTooltip as unknown as React.FC<React.ComponentProps<typeof RCTooltip>>;

  return (
    <TooltipComponent
      prefixCls={prefixCls}
      overlay={overlayNode}
      placement={placement}
      trigger={triggerArray}
      visible={open}
      onVisibleChange={onOpenChange}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      motion={{
        motionName: `${prefixCls}-zoom`,
        motionAppear: true,
        motionEnter: true,
        motionLeave: true,
      }}
      getTooltipContainer={getPopupContainer ?? configGetPopupContainer}
      classNames={{ root: classNames(className, overlayClassName) }}
      styles={{ root: { ...style, ...overlayStyle } }}
    >
      {children}
    </TooltipComponent>
  );
};

Popover.displayName = 'Popover';
