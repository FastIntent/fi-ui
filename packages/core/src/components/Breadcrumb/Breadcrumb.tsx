import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Propiedades de un ítem individual del Breadcrumb.
 */
export interface BreadcrumbItemProps {
  /**
   * Ruta opcional a la que redirigir al hacer clic.
   */
  href?: string;

  /**
   * Callback opcional de clic.
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;

  /**
   * Separador personalizado para este ítem.
   */
  separator?: React.ReactNode;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Contenido del ítem (texto, iconos, etc.).
   */
  children?: React.ReactNode;
}

/**
 * BreadcrumbItem - Componente interno para cada eslabón de la ruta.
 */
export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  onClick,
  separator = '/',
  className,
  children,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('breadcrumb-item') || getDefaultPrefixCls('breadcrumb-item');
  const classes = classNames(prefixCls, className);
  return (
    <span className={classes}>
      {href ? (
        <a className={`${prefixCls}-link`} href={href} onClick={onClick}>
          {children}
        </a>
      ) : onClick ? (
        <button type="button" className={`${prefixCls}-link`} onClick={onClick}>
          {children}
        </button>
      ) : (
        <span className={`${prefixCls}-link`}>{children}</span>
      )}
      {separator && <span className={`${prefixCls}-separator`}>{separator}</span>}
    </span>
  );
};

/**
 * Propiedades del componente Breadcrumb.
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Separador global entre ítems.
   * @default '/'
   */
  separator?: React.ReactNode;

  /**
   * Lista de ítems o nodos `Breadcrumb.Item`.
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

interface BreadcrumbInterface extends React.FC<BreadcrumbProps> {
  Item: typeof BreadcrumbItem;
}

/**
 * Breadcrumb - Componente de navegación jerárquica.
 */
export const Breadcrumb: BreadcrumbInterface = ({
  separator = '/',
  children,
  className,
  style,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('breadcrumb') || getDefaultPrefixCls('breadcrumb');
  const classes = classNames(prefixCls, className);

  // Inyectar el separador a los hijos si son BreadcrumbItem
  const renderedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    // Si es el último hijo, no mostrar separador por defecto
    const isLast = index === React.Children.count(children) - 1;

    const element = child as React.ReactElement<BreadcrumbItemProps>;

    return React.cloneElement(element, {
      separator: isLast ? null : element.props.separator || separator,
    });
  });

  return (
    <nav className={classes} style={style} {...props}>
      {renderedChildren}
    </nav>
  );
};

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.displayName = 'Breadcrumb';
