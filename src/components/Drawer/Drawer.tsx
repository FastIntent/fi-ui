import React from 'react';
import RcDrawer, { DrawerProps as RcDrawerProps } from '@rc-component/drawer';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';

/**
 * Propiedades del componente Drawer.
 * Un panel deslizante que emerge desde un borde de la pantalla, útil para navegación,
 * inspección de detalles o formularios largos que no caben en un Modal.
 * Hereda todas las propiedades de `@rc-component/drawer`.
 */
export interface DrawerProps extends RcDrawerProps {
  /**
   * El título que se mostrará en la cabecera del Drawer.
   */
  title?: React.ReactNode;

  /**
   * Contenido del pie de página del Drawer.
   * Usualmente utilizado para alojar botones de acción principales (ej. "Guardar" / "Cancelar").
   * Se queda fijo en la parte inferior mientras el cuerpo interno hace scroll.
   */
  footer?: React.ReactNode;

  /**
   * Nodos adicionales que se renderizan en la esquina superior derecha de la cabecera,
   * junto al botón de cerrar.
   */
  extra?: React.ReactNode;

  /**
   * Determina si se debe mostrar un botón con una "X" para cerrar el Drawer en la esquina superior derecha.
   * @default true
   */
  closable?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  title,
  footer,
  extra,
  children,
  closable = true,
  onClose,
  prefixCls: customPrefixCls,
  placement = 'right',
  maskClosable = true,
  styles,
  ...props
}) => {
  const { locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('drawer', customPrefixCls) || getDefaultPrefixCls('drawer');
  const drawerLocale = contextLocale?.Drawer || defaultLocale.Drawer!;
  // Explicitly mapping placement to styles for 0px anchoring
  const placementStyles: React.CSSProperties = {
    position: 'fixed',
  };

  if (placement === 'left') placementStyles.left = 0;
  if (placement === 'right') placementStyles.right = 0;
  if (placement === 'top') placementStyles.top = 0;
  if (placement === 'bottom') placementStyles.bottom = 0;

  // Use RcMotion logic to ensure animations trigger on mount/first show
  const maskMotion = {
    motionName: `${prefixCls}-mask-motion`,
  };

  const panelMotion = {
    motionName: `${prefixCls}-panel-motion-${placement}`,
  };

  return (
    <RcDrawer
      prefixCls={prefixCls}
      open={open}
      onClose={onClose}
      getContainer={props.getContainer}
      placement={placement}
      maskClosable={maskClosable}
      styles={{ ...styles, wrapper: { ...placementStyles, ...styles?.wrapper } }}
      maskMotion={maskMotion}
      motion={panelMotion}
      {...props}
    >
      <div className={`${prefixCls}-wrapper-body`}>
        {(title || closable || extra) && (
          <div className={`${prefixCls}-header`}>
            <div className={`${prefixCls}-header-title`}>
              {closable && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={drawerLocale.closeAriaLabel}
                  className={`${prefixCls}-close`}
                >
                  <span className={`${prefixCls}-close-x`}>×</span>
                </button>
              )}
              {title && <div className={`${prefixCls}-title`}>{title}</div>}
            </div>
            {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
          </div>
        )}
        <div className={`${prefixCls}-body`}>{children}</div>
        {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
      </div>
    </RcDrawer>
  );
};

Drawer.displayName = 'Drawer';
