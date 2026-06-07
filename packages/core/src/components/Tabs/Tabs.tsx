import React from 'react';
import RcTabs, { TabsProps as RcTabsProps } from '@rc-component/tabs';
import type { Tab } from '@rc-component/tabs/lib/interface';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export type SizeType = 'small' | 'middle' | 'large';

/**
 * Definición de un elemento individual de la pestaña.
 */
export interface TabItemType extends Omit<Tab, 'label'> {
  /**
   * El título visible de la pestaña.
   */
  label: React.ReactNode;
  /**
   * Icono opcional que se mostrará junto al título de la pestaña.
   */
  icon?: React.ReactNode;
}

/**
 * Propiedades del componente Tabs.
 * Proporciona un sistema de navegación por pestañas para cambiar de contenido en un mismo espacio.
 *
 * @example
 * ```tsx
 * const items = [
 *   { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
 *   { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
 * ];
 * <Tabs defaultActiveKey="1" items={items} />
 * ```
 */
export interface TabsProps extends Omit<RcTabsProps, 'editable' | 'items'> {
  /**
   * Estilo visual general de las pestañas.
   * - `line`: Línea inferior indicadora (estilo por defecto).
   * - `card`: Forma de pestañas de carpeta, ideal para organizar grandes contenedores.
   * - `editable-card`: Añade botones dinámicos para añadir o cerrar pestañas.
   *
   * @default 'line'
   */
  type?: TabsType;

  /**
   * El tamaño de las pestañas.
   * @default 'middle'
   */
  size?: SizeType;

  /**
   * Si es `true`, centra las pestañas horizontalmente dentro del contenedor de navegación.
   * @default false
   */
  centered?: boolean;

  /**
   * Icono personalizado para el botón de "Añadir".
   * Solo funciona cuando `type="editable-card"`.
   */
  addIcon?: React.ReactNode;

  /**
   * Icono personalizado para el botón de "Cerrar" en cada pestaña.
   * Solo funciona cuando `type="editable-card"`.
   */
  removeIcon?: React.ReactNode;

  /**
   * Si es `true`, oculta el botón de añadir una nueva pestaña en el modo `editable-card`.
   * @default false
   */
  hideAdd?: boolean;

  /**
   * Un arreglo con la configuración de las pestañas a renderizar.
   * En lugar de usar componentes anidados, se pasa la data estructurada aquí.
   */
  items?: TabItemType[];

  /**
   * Configuración avanzada para el indicador (la línea animada inferior en modo `line`).
   * Permite ajustar su tamaño y alineación respecto al texto.
   */
  indicator?: { size?: number | ((origin: number) => number); align?: 'start' | 'center' | 'end' };

  /**
   * Callback ejecutado al añadir o eliminar pestañas.
   * Solo aplicable cuando `type="editable-card"`.
   *
   * @param e - Evento o key de la pestaña a eliminar.
   * @param action - Qué acción ocurrió: `'add'` o `'remove'`.
   */
  onEdit?: (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => void;
}

export const Tabs: React.FC<TabsProps> = ({
  prefixCls: customPrefixCls,
  className,
  type = 'line',
  size,
  centered,
  items,
  indicator,
  onEdit,
  addIcon,
  removeIcon,
  hideAdd,
  animated = { inkBar: true, tabPane: false },
  ...restProps
}) => {
  const { size: contextSize, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('tabs', customPrefixCls) || getDefaultPrefixCls('tabs');
  const mergedSize = size || contextSize || 'middle';

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-centered`]: centered,
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
    },
    className
  );

  let editable: RcTabsProps['editable'] | undefined;
  if (type === 'editable-card') {
    editable = {
      onEdit: (editType, { key, event }) => {
        onEdit?.(editType === 'add' ? event : key!, editType);
      },
      removeIcon: removeIcon || <span style={{ fontSize: '14px', lineHeight: 1 }}>&times;</span>,
      addIcon: addIcon || <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>,
      showAdd: !hideAdd,
    };
  }

  const mergedItems = items?.map((item) => ({
    ...item,
    label: item.icon ? (
      <span className={`${prefixCls}-tab-icon-wrapper`}>
        {item.icon}
        {item.label}
      </span>
    ) : (
      item.label
    ),
  }));

  return (
    <RcTabs
      {...restProps}
      prefixCls={prefixCls}
      className={classes}
      editable={editable}
      animated={animated}
      indicator={indicator as Record<string, unknown>}
      items={mergedItems}
    />
  );
};

Tabs.displayName = 'Tabs';
