import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Menu } from '../Menu/Menu';
import { MenuItem, SubMenu, ItemGroup, Divider } from '../Menu/Menu';
import { Drawer } from '../Drawer/Drawer';
import { Input } from '../Input/Input';
import { IconPanelOpen, IconPanelClose, IconSearch, IconBell, IconHelp } from './Icons';
import { useConfig, usePrefixCls } from '../ConfigProvider';
import { getPrefixedCssVarStyle } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';

// ─────────────────────────────────────────────
// Inline Icons (no external deps)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/**
 * Estructura de datos para generar recursivamente los elementos del menú en el Sidebar.
 */
export interface MenuDataItem {
  /** Llave única obligatoria para identificar el elemento. */
  key: string;
  /** Texto visible de la opción del menú. */
  label: string;
  /** Icono de React que se mostrará junto al texto. */
  icon?: React.ReactNode;
  /** Sub-elementos que se desplegarán al hacer clic. */
  children?: MenuDataItem[];
  /** Ruta opcional de navegación. */
  path?: string;
  /**
   * Tipo especial de nodo:
   * - `group`: Un título estático no cliqueable que agrupa varios items.
   * - `divider`: Una línea divisoria.
   */
  type?: 'group' | 'divider';
  /** Nodos adicionales a la derecha (ej. un Badge con número de alertas). */
  extra?: React.ReactNode;
}

/**
 * Información del usuario actual para mostrar en la esquina superior derecha (cabecera).
 */
export interface LayoutUserInfo {
  /** Nombre a mostrar junto al avatar. */
  name?: string;
  /** Iniciales o componente `<Avatar>` renderizado visualmente. */
  avatar?: React.ReactNode;
  /** Función ejecutada al hacer clic en la zona del usuario (ideal para abrir un Dropdown de sesión). */
  onClick?: () => void;
}

/**
 * Propiedades principales del componente Layout (Admin Shell).
 * Una plantilla de alto nivel "llave en mano" para crear rápidamente
 * consolas de administración y dashboards corporativos con diseño responsivo.
 */
export interface LayoutProps {
  // ── Contenido ────────────────────────────────
  /** El contenido principal de la página (dentro del tag `<main>`). */
  children?: React.ReactNode;

  /** Un nodo inyectado al final de la cabecera (lado derecho), después del usuario. */
  headerRight?: React.ReactNode;

  /** Anula por completo todo el bloque derecho de la cabecera, dándote control total. */
  headerRightRender?: React.ReactNode;

  /** Contenido renderizado en la parte inferior (footer) del layout. */
  footerRender?: React.ReactNode;

  // ── Marca ───────────────────────────────
  /** Logo de la aplicación renderizado en la esquina superior izquierda. */
  logo?: React.ReactNode;

  /** Nombre del producto o proyecto mostrado junto al logo. @default 'Fast Admin' */
  title?: string;

  // ── Navegación (Menú) ───────────────────────────────────
  /** Arreglo JSON con la estructura del menú lateral a generar automáticamente. */
  menuData?: MenuDataItem[];

  /** Llaves de los menús que deben aparecer seleccionados/activos al iniciar. */
  defaultSelectedKeys?: string[];

  /** Llaves de los submenús que deben aparecer expandidos/abiertos al iniciar. */
  defaultOpenKeys?: string[];

  // ── Comportamiento Lateral (Sidebar) ───────────────────────────────
  /** Control manual del estado colapsado del menú lateral. Al proveerlo se vuelve controlado. */
  collapsed?: boolean;

  /** Estado colapsado inicial (no controlado). @default false */
  defaultCollapsed?: boolean;

  /** Callback ejecutado al dar clic en el botón de colapsar/expandir. */
  onCollapse?: (collapsed: boolean) => void;

  // ── Búsqueda ─────────────────────────────────
  /** Determina si se muestra la barra global de búsqueda en la cabecera. @default true */
  showSearch?: boolean;

  /** Callback que recibe el texto tipeado por el usuario en la barra de búsqueda. */
  onSearch?: (value: string) => void;

  // ── Notificaciones ──────────────────────────
  /** Muestra la campana de alertas en la cabecera. @default true */
  showNotifications?: boolean;

  /** Número a mostrar en un Badge rojo sobre la campana. (Más de 99 muestra "99+"). */
  notificationCount?: number;

  /** Acción al dar clic en la campana de notificaciones. */
  onNotificationClick?: () => void;

  // ── Ayuda ───────────────────────────────────
  /** Muestra el botón de Ayuda/Documentación en la cabecera. @default true */
  showHelp?: boolean;

  /** Acción al dar clic en el icono de ayuda. */
  onHelpClick?: () => void;

  // ── Usuario ───────────────────────────────────
  /**
   * Objeto con la información del usuario en sesión.
   * Si no se provee, toda la sección de usuario desaparece de la cabecera.
   */
  userInfo?: LayoutUserInfo;

  // ── Estilo Global ─────────────────────────
  /** Fija la cabecera (position: fixed) para que se mantenga visible al hacer scroll. @default true */
  fixedHeader?: boolean;

  /** Punto de quiebre (en píxeles) para colapsar automáticamente el menú y cambiar a modo móvil (Drawer). @default 768 */
  breakpoint?: number;

  /** Anchura del menú lateral cuando está expandido. @default 250 */
  siderWidth?: number | string;

  /** Clases CSS extra inyectadas al contenedor global del Layout. */
  className?: string;

  /** Callback ejecutado al seleccionar un ítem del menú lateral. Recibe la key del ítem. */
  onMenuSelect?: (key: string) => void;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function renderMenuItems(items: MenuDataItem[]): React.ReactNode {
  return items.map((item) => {
    if (item.type === 'divider') {
      return <Divider key={item.key} />;
    }

    if (item.type === 'group') {
      return (
        <ItemGroup key={item.key} title={item.label}>
          {item.children && renderMenuItems(item.children)}
        </ItemGroup>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <SubMenu key={item.key} icon={item.icon} title={item.label}>
          {renderMenuItems(item.children)}
        </SubMenu>
      );
    }

    const labelContent = item.extra ? (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{item.label}</span>
        <span style={{ flexShrink: 0, marginLeft: 8 }}>{item.extra}</span>
      </span>
    ) : (
      item.label
    );

    return (
      <MenuItem key={item.key} icon={item.icon}>
        {labelContent}
      </MenuItem>
    );
  });
}

// ─────────────────────────────────────────────
// Layout Component
// ─────────────────────────────────────────────

const EMPTY_MENU_DATA: MenuDataItem[] = [];
const EMPTY_SELECTED_KEYS: string[] = [];
const EMPTY_OPEN_KEYS: string[] = [];

export const Layout: React.FC<LayoutProps> = ({
  children,
  headerRight,
  headerRightRender,
  footerRender,
  logo,
  title = 'Fast Admin',
  menuData = EMPTY_MENU_DATA,
  defaultSelectedKeys = EMPTY_SELECTED_KEYS,
  defaultOpenKeys = EMPTY_OPEN_KEYS,
  collapsed: propsCollapsed,
  defaultCollapsed = false,
  onCollapse,
  showSearch = true,
  onSearch,
  showNotifications = true,
  notificationCount,
  onNotificationClick,
  showHelp = true,
  onHelpClick,
  userInfo,
  fixedHeader = true,
  breakpoint = 768,
  siderWidth = 250,
  className,
  onMenuSelect,
}) => {
  const prefixCls = usePrefixCls('layout');
  const { locale: contextLocale, prefixCls: configPrefixCls } = useConfig();
  const layoutLocale = contextLocale?.Layout || defaultLocale.Layout!;

  const [mounted, setMounted] = useState(false);
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  const isCollapsed = propsCollapsed !== undefined ? propsCollapsed : innerCollapsed;

  const handleToggleCollapse = () => {
    if (isMobile) {
      setShowDrawer((prev) => !prev);
    } else {
      const next = !isCollapsed;
      onCollapse ? onCollapse(next) : setInnerCollapsed(next);
    }
  };

  const handleUserKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!userInfo?.onClick || (event.key !== 'Enter' && event.key !== ' ')) return;

    event.preventDefault();
    userInfo.onClick();
  };

  const userInteractionProps = userInfo?.onClick
    ? {
        onClick: userInfo.onClick,
        onKeyDown: handleUserKeyDown,
        role: 'button',
        tabIndex: 0,
      }
    : {};

  const menuContent = useMemo(
    () => (
      <Menu
        mode="inline"
        className={`${prefixCls}-menu mt-2`}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        inlineCollapsed={!isMobile && isCollapsed}
        sidebar
        onClick={onMenuSelect ? ({ key }) => onMenuSelect(key) : undefined}
      >
        {renderMenuItems(menuData)}
      </Menu>
    ),
    [isMobile, isCollapsed, defaultSelectedKeys, defaultOpenKeys, menuData, onMenuSelect]
  );

  return (
    <div
      className={classNames(prefixCls, className)}
      style={
        {
          ...getPrefixedCssVarStyle(
            {
              'layout-sider-width': typeof siderWidth === 'number' ? `${siderWidth}px` : siderWidth,
            },
            configPrefixCls
          ),
        } as React.CSSProperties
      }
    >
      {/* ── Mobile Drawer ── */}
      {mounted && (
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {logo}
              <span>{title}</span>
            </div>
          }
          size={siderWidth}
          open={isMobile && showDrawer}
          onClose={() => setShowDrawer(false)}
          placement="left"
          className={`${prefixCls}-drawer`}
        >
          {menuContent}
        </Drawer>
      )}

      {/* ── Header ── */}
      <header
        className={classNames(`${prefixCls}-header`, {
          [`${prefixCls}-header-fixed`]: fixedHeader,
        })}
      >
        {/* Left */}
        <div className={`${prefixCls}-header-left`}>
          <div
            className={`${prefixCls}-collapse-trigger`}
            onClick={handleToggleCollapse}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleCollapse();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isCollapsed ? layoutLocale.expandSidebar : layoutLocale.collapseSidebar}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <IconPanelOpen /> : <IconPanelClose />}
          </div>
          <div className={`${prefixCls}-logo`}>
            {logo}
            {title && (
              <h1
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </h1>
            )}
          </div>
        </div>

        {/* Right */}
        {headerRightRender !== undefined ? (
          headerRightRender
        ) : (
          <div className={`${prefixCls}-header-right`}>
            {/* Search */}
            {showSearch && (
              <Input
                prefix={<IconSearch />}
                placeholder={layoutLocale.searchPlaceholder}
                className={`${prefixCls}-search`}
                classNames={{
                  input: `${prefixCls}-search-input`,
                }}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            )}

            {/* Notifications */}
            {showNotifications && (
              <button
                className={`${prefixCls}-action-btn`}
                onClick={onNotificationClick}
                aria-label={layoutLocale.notifications}
                style={{ position: 'relative' }}
              >
                <IconBell />
                {notificationCount !== undefined && notificationCount > 0 && (
                  <span className={`${prefixCls}-badge`}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Help */}
            {showHelp && (
              <button
                className={`${prefixCls}-action-btn`}
                onClick={onHelpClick}
                aria-label={layoutLocale.help}
              >
                <IconHelp />
              </button>
            )}

            {/* Divider */}
            {userInfo && <div className={`${prefixCls}-header-divider`} />}

            {/* User */}
            {userInfo && (
              <div
                className={`${prefixCls}-user`}
                style={{ cursor: userInfo.onClick ? 'pointer' : 'default' }}
                {...userInteractionProps}
              >
                <div className={`${prefixCls}-user-avatar`}>
                  {userInfo.avatar ?? userInfo.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                {userInfo.name && <span className={`${prefixCls}-user-name`}>{userInfo.name}</span>}
              </div>
            )}

            {/* Extra slot */}
            {headerRight}
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div className={`${prefixCls}-container`}>
        {/* Sider – desktop only (CSS handles hiding on mobile) */}
        <aside
          className={classNames(`${prefixCls}-sider`, {
            [`${prefixCls}-sider-collapsed`]: isCollapsed,
          })}
        >
          {menuContent}
        </aside>

        {/* Main */}
        <div className={`${prefixCls}-main`}>
          <main className={`${prefixCls}-content`}>{children}</main>
          {footerRender && <footer className={`${prefixCls}-footer`}>{footerRender}</footer>}
        </div>
      </div>
    </div>
  );
};

Layout.displayName = 'Layout';
