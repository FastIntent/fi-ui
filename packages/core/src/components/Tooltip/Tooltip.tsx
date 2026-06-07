import React from 'react';
import RCTooltip from '@rc-component/tooltip';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls, getPrefixedCssVarStyle } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Tooltip.
 */
export interface TooltipProps extends Partial<React.ComponentProps<typeof RCTooltip>> {
  /**
   * El contenido o texto que se mostrará dentro del globo del Tooltip.
   */
  title?: React.ReactNode;

  /**
   * El elemento de React sobre el cual el Tooltip actuará como un "envoltorio".
   */
  children: React.ReactElement;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Color de fondo personalizado.
   */
  color?: string;

  /**
   * Color de texto personalizado.
   */
  textColor?: string;

  // Explicitly defining props that are causing build issues
  prefixCls?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  trigger?: ('hover' | 'focus' | 'click' | 'contextMenu')[];
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  overlay?: React.ReactNode | (() => React.ReactNode);
  overlayStyle?: React.CSSProperties;
  overlayClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { getPopupContainer, getPrefixCls, prefixCls: configPrefixCls } = useConfig();
  const {
    prefixCls: customPrefixCls,
    className,
    title,
    children,
    placement = 'top',
    trigger = ['hover'],
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    color,
    textColor,
    overlayClassName,
    overlayStyle: customOverlayStyle,
    ...restProps
  } = props;
  const prefixCls = getPrefixCls?.('tooltip', customPrefixCls) || getDefaultPrefixCls('tooltip');

  const overlay = title || props.overlay;

  const overlayStyle: React.CSSProperties = {
    ...customOverlayStyle,
    ...getPrefixedCssVarStyle(
      {
        'tooltip-bg': color,
        'tooltip-color': textColor,
      },
      configPrefixCls
    ),
  };

  // Safe cast for third-party component wrapper
  const TooltipComponent = RCTooltip as unknown as React.FC<React.ComponentProps<typeof RCTooltip>>;

  return (
    <TooltipComponent
      {...restProps}
      prefixCls={prefixCls}
      overlay={overlay}
      placement={placement}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      motion={{
        motionName: `${prefixCls}-zoom`,
        motionAppear: true,
        motionEnter: true,
        motionLeave: true,
      }}
      classNames={{ root: classNames(className, overlayClassName) }}
      styles={{ root: overlayStyle }}
    >
      {children}
    </TooltipComponent>
  );
};

Tooltip.displayName = 'Tooltip';
