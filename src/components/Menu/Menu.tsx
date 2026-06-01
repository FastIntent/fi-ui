import React from 'react';
import RcMenu, {
  SubMenu as RcSubMenu,
  MenuItem as RcMenuItem,
  MenuItemGroup as RcMenuItemGroup,
  Divider as RcDivider,
  MenuProps as RcMenuProps,
  SubMenuProps as RcSubMenuProps,
} from '@rc-component/menu';
import type { MenuRef } from '@rc-component/menu';
import type { MenuItemProps as RcMenuItemProps } from '@rc-component/menu/lib/MenuItem';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Menu.
 * Sistema de navegación en lista (vertical u horizontal) con soporte para submenús desplegables.
 * Hereda todas las propiedades y accesibilidad de `@rc-component/menu`.
 */
export interface MenuProps extends RcMenuProps {
  /**
   * Variante visual optimizada para barras laterales completas (Sidebars) tipo "Dashboard".
   * Aplica estilos específicos de altura, color y espaciado de fondo.
   *
   * @default false
   */
  sidebar?: boolean;
}

// Context to propagate the root menu mode to SubMenu wrappers
const MenuModeContext = React.createContext<string>('vertical');

const getCollapseMotion = (prefixCls: string) => ({
  motionName: `${prefixCls}-collapse`,
  onAppearStart: (_node: HTMLElement) => ({
    height: 0,
    opacity: 0,
  }),
  onAppearActive: (node: HTMLElement) => ({
    height: node.scrollHeight,
    opacity: 1,
  }),
  onEnterStart: (_node: HTMLElement) => ({
    height: 0,
    opacity: 0,
  }),
  onEnterActive: (node: HTMLElement) => ({
    height: node.scrollHeight,
    opacity: 1,
  }),
  onLeaveStart: (node: HTMLElement) => ({
    height: node.scrollHeight,
    opacity: 1,
  }),
  onLeaveActive: (_node: HTMLElement) => ({
    height: 0,
    opacity: 0,
  }),
});

export const Menu = React.forwardRef<MenuRef, MenuProps>(
  (
    { className, prefixCls: customPrefixCls, mode = 'vertical', sidebar = false, ...props },
    ref
  ) => {
    const { getPopupContainer, getPrefixCls } = useConfig();
    const prefixCls = getPrefixCls?.('menu', customPrefixCls) || getDefaultPrefixCls('menu');
    const rootClasses = classNames(className, `${prefixCls}-root`, {
      [`${prefixCls}-sidebar`]: sidebar,
    });

    return (
      <MenuModeContext.Provider value={mode as string}>
        <RcMenu
          ref={ref}
          prefixCls={prefixCls}
          className={rootClasses}
          mode={mode}
          subMenuOpenDelay={0}
          subMenuCloseDelay={0.05}
          inlineIndent={-1}
          getPopupContainer={props.getPopupContainer || getPopupContainer}
          defaultMotions={{
            horizontal: { motionName: `${prefixCls}-slide-up` },
            inline: getCollapseMotion(prefixCls),
            other: { motionName: `${prefixCls}-zoom` },
          }}
          {...props}
        />
      </MenuModeContext.Provider>
    );
  }
);

Menu.displayName = 'Menu';

// MenuItem with optional icon/danger support
export interface MenuItemProps extends RcMenuItemProps {
  icon?: React.ReactNode;
  danger?: boolean;
}

export const MenuItem = React.forwardRef<HTMLElement, MenuItemProps>(
  ({ icon, danger, className, children, ...props }, ref) => {
    const { getPrefixCls } = useConfig();
    const prefixCls =
      ((props as Record<string, unknown>).prefixCls as string | undefined) ||
      getPrefixCls?.('menu') ||
      getDefaultPrefixCls('menu');
    const itemClasses = classNames(className, {
      [`${prefixCls}-item-danger`]: danger,
    });

    return (
      <RcMenuItem ref={ref} className={itemClasses} {...props}>
        {icon && <span className={`${prefixCls}-item-icon`}>{icon}</span>}
        {children && <span className={`${prefixCls}-item-label`}>{children}</span>}
      </RcMenuItem>
    );
  }
);
MenuItem.displayName = 'MenuItem';

// SubMenu with optional icon/danger support
export interface SubMenuProps extends RcSubMenuProps {
  icon?: React.ReactNode;
  danger?: boolean;
}

export const SubMenu = React.forwardRef<HTMLLIElement, SubMenuProps>(
  ({ icon, danger, title, className, popupClassName, ...props }, ref) => {
    const mode = React.useContext(MenuModeContext);
    const { getPrefixCls } = useConfig();
    const prefixCls =
      ((props as Record<string, unknown>).prefixCls as string | undefined) ||
      getPrefixCls?.('menu') ||
      getDefaultPrefixCls('menu');

    // When root menu is horizontal, tag the popup so CSS can hide nested arrows
    const resolvedPopupClassName = classNames(popupClassName, {
      [`${prefixCls}-submenu-popup-horizontal`]: mode === 'horizontal',
    });

    const itemClasses = classNames(className, {
      [`${prefixCls}-submenu-danger`]: danger,
    });

    const titleContent = (
      <>
        {icon && <span className={`${prefixCls}-item-icon`}>{icon}</span>}
        {title && <span className={`${prefixCls}-item-label`}>{title}</span>}
      </>
    );

    return (
      <RcSubMenu
        ref={ref}
        className={itemClasses}
        title={titleContent}
        popupClassName={resolvedPopupClassName}
        {...props}
      />
    );
  }
);
SubMenu.displayName = 'SubMenu';

export { RcMenuItemGroup as ItemGroup, RcDivider as Divider };
