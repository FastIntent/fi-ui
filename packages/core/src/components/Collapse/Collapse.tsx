import React, { useMemo } from 'react';

import RcCollapse, { Panel as RcPanel } from '@rc-component/collapse';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

export interface CollapseProps {
  /** Clave(s) de los paneles activos actualmente (Modo controlado) */
  activeKey?: React.Key | React.Key[];
  /** Clave(s) de los paneles activos por defecto */
  defaultActiveKey?: React.Key | React.Key[];
  /** Callback al cambiar el panel activo */
  onChange?: (key: React.Key | React.Key[]) => void;
  /** Si es true, solo un panel puede estar abierto a la vez */
  accordion?: boolean;
  /** Elimina los bordes y el fondo (ideal para layouts) */
  ghost?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Destruir el DOM del panel si está cerrado */
  destroyInactivePanel?: boolean;
  /** Función para renderizar icono personalizado */
  expandIcon?: (panelProps: { isActive?: boolean }) => React.ReactNode;
  /** Posición del icono de expansión */
  expandIconPosition?: 'start' | 'end';
  /** Elimina los bordes y el fondo (ideal para layouts) */
  /** Elimina el borde exterior del componente */
  bordered?: boolean;
  /** Limita qué parte es clicable para expandir */
  collapsible?: 'header' | 'icon' | 'disabled';
  /** Tamaño del componente */
  size?: 'small' | 'middle' | 'large';
  children?: React.ReactNode;
  prefixCls?: string;
  /** Lista de paneles. Se recomienda usar esta propiedad en lugar de children */
  items?: (CollapsePanelProps & { key: React.Key; label?: React.ReactNode })[];
}

export interface CollapsePanelProps {
  key?: React.Key;
  header: React.ReactNode;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  collapsible?: 'header' | 'icon' | 'disabled';
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

// Icono por defecto (Chevron)
const defaultArrow = (prefixCls: string) => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    className={`${prefixCls}-arrow`}
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
  </svg>
);

export const CollapsePanel: React.FC<CollapsePanelProps> = (props) => {
  return <RcPanel {...props} />;
};

const CollapseComponent: React.FC<CollapseProps> = ({
  prefixCls: customPrefixCls,
  className,
  ghost,
  bordered = true,
  expandIconPosition = 'start',
  size,
  expandIcon,
  children,
  items,
  ...restProps
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('collapse', customPrefixCls) || getDefaultPrefixCls('collapse');

  const mergedItems = useMemo(() => {
    if (items) {
      return items.map((item) => ({
        ...item,
        label: item.label || item.header, // rc-collapse uses label, we support header for compat
      }));
    }

    const childItems: CollapseProps['items'] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      const {
        header,
        children: panelChildren,
        label,
        ...panelProps
      } = child.props as CollapsePanelProps & { label?: React.ReactNode };

      const key = child.key ?? `collapse-panel-${childItems.length}`;

      childItems.push({
        ...panelProps,
        key,
        header,
        label: label || header,
        children: panelChildren,
      });
    });

    return childItems;
  }, [children, items]);

  const classes = classNames(prefixCls, className, {
    [`${prefixCls}-borderless`]: !bordered,
    [`${prefixCls}-ghost`]: ghost,
    [`${prefixCls}-icon-position-${expandIconPosition}`]: true,
    [`${prefixCls}-${size}`]: size,
  });

  const renderExpandIcon = (panelProps: { isActive?: boolean }) => {
    const icon = expandIcon ? expandIcon(panelProps) : defaultArrow(prefixCls);
    return (
      <div
        className={classNames(`${prefixCls}-expand-icon`, {
          [`${prefixCls}-expand-icon-active`]: panelProps.isActive,
        })}
      >
        {icon}
      </div>
    );
  };

  // Configuración de la animación fluida usando rc-motion (calcula scrollHeight dinámicamente)
  const collapseMotion = useMemo(
    () => ({
      motionName: `${prefixCls}-motion`,
      onEnterStart: () => ({ height: 0 }),
      onEnterActive: (node: HTMLElement) => ({ height: node.scrollHeight }),
      onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
      onLeaveActive: () => ({ height: 0 }),
    }),
    [prefixCls]
  );

  return (
    <RcCollapse
      {...restProps}
      prefixCls={prefixCls}
      className={classes}
      expandIcon={renderExpandIcon}
      openMotion={collapseMotion}
      items={mergedItems}
    />
  );
};

export const Collapse = CollapseComponent as React.FC<CollapseProps> & {
  Panel: typeof CollapsePanel;
};

Collapse.Panel = CollapsePanel;
Collapse.displayName = 'Collapse';
