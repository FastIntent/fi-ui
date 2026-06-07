import React from 'react';
import RCTable from '@rc-component/table';
import type { ColumnType, ColumnsType, TableProps as RcTableProps } from '@rc-component/table';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';
import { Checkbox, CheckboxChangeEvent } from '../Checkbox/Checkbox';
import { Pagination, PaginationProps } from '../Pagination';
import { Skeleton } from '../Skeleton';

/**
 * Configuración para la selección de filas en la tabla.
 */
export interface TableRowSelection<T> {
  /**
   * Arreglo con las llaves (`key`) de las filas actualmente seleccionadas.
   */
  selectedRowKeys?: React.Key[];

  /**
   * Callback ejecutado cuando la selección cambia.
   */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;

  /**
   * Personaliza las propiedades del checkbox.
   */
  getCheckboxProps?: (record: T) => { disabled?: boolean; [key: string]: unknown };

  /**
   * Determina si la selección es múltiple (`checkbox`) o única (`radio`).
   */
  type?: 'checkbox' | 'radio';

  /**
   * Opciones personalizadas para el menú de selección.
   */
  selections?: (
    | string
    | { key: string; text: React.ReactNode; onSelect?: (changeableRowKeys: React.Key[]) => void }
  )[];
}

/**
 * Propiedades del componente Table.
 */
export interface TableProps<
  T extends { key?: React.Key; [key: string]: unknown } = Record<string, unknown>,
> extends Omit<RcTableProps<T>, 'data' | 'columns'> {
  /**
   * Fuente de datos de la tabla.
   */
  data?: T[];

  /**
   * Definición de columnas.
   */
  columns?: ColumnsType<T>;

  /**
   * Muestra filas skeleton mientras se cargan los datos.
   */
  loading?: boolean;

  /**
   * Número de filas skeleton a mostrar cuando `loading` es `true`.
   * @default 5
   */
  skeletonRows?: number;

  /**
   * Añade bordes.
   */
  bordered?: boolean;

  /**
   * Tamaño de las celdas.
   */
  size?: 'small' | 'middle' | 'large';

  /**
   * Alterna color de fondo de filas.
   */
  striped?: boolean;

  /**
   * Configuración de selección de filas.
   */
  rowSelection?: TableRowSelection<T>;

  /**
   * Configuración de paginación.
   */
  pagination?: PaginationProps | false;
}

/** Wrapper that resets scrollLeft to 0 when the row closes. */
function ExpandContentWrapper({
  isOpen,
  prefixCls,
  children,
}: {
  isOpen: boolean;
  prefixCls: string;
  children: React.ReactNode;
}) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const prevOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (prevOpen.current && !isOpen && innerRef.current) {
      const scrollable = innerRef.current.firstElementChild as HTMLElement | null;
      if (scrollable) scrollable.scrollTo({ left: 0, behavior: 'smooth' });
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div
      className={`${prefixCls}-expand-content${isOpen ? ` ${prefixCls}-expand-content-open` : ''}`}
    >
      <div ref={innerRef} className={`${prefixCls}-expand-content-inner`}>
        {children}
      </div>
    </div>
  );
}

const SELECTION_ALL = 'SELECT_ALL';
const SELECTION_INVERT = 'SELECT_INVERT';
const SELECTION_NONE = 'SELECT_NONE';

function Table<T extends { key?: React.Key; [key: string]: unknown }>(props: TableProps<T>) {
  const {
    prefixCls: customPrefixCls,
    className,
    loading,
    skeletonRows = 5,
    bordered,
    size = 'middle',
    striped,
    rowSelection,
    pagination,
    columns = [],
    data = [],
    ...restProps
  } = props;

  const { size: contextSize, locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('table', customPrefixCls) || getDefaultPrefixCls('table');
  const mergedSize = size || contextSize || 'middle';
  const tableLocale = contextLocale?.Table || defaultLocale.Table!;

  // --- Row Selection Logic ---
  const mergedColumns = React.useMemo<ColumnsType<T>>(() => {
    if (!rowSelection) return columns;

    const { selectedRowKeys = [], onChange, type = 'checkbox', getCheckboxProps } = rowSelection;

    const selectionColumn: ColumnType<T> = {
      width: 50,
      key: 'selection-column',
      align: 'center' as const,
      fixed: columns[0]?.fixed,
      title:
        type === 'checkbox' ? (
          <Checkbox
            checked={data.length > 0 && selectedRowKeys.length === data.length}
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
            onChange={(e: CheckboxChangeEvent) => {
              if (onChange) {
                const allKeys = data.reduce<React.Key[]>((keys, item) => {
                  if (item.key !== undefined) keys.push(item.key);
                  return keys;
                }, []);
                const nextKeys = e.target.checked ? allKeys : [];
                const nextRows = e.target.checked ? [...data] : [];
                onChange(nextKeys, nextRows);
              }
            }}
          />
        ) : null,
      render: (_: unknown, record: T) => {
        const checkboxProps = getCheckboxProps ? getCheckboxProps(record) : {};
        const key = record.key;
        return (
          <Checkbox
            {...checkboxProps}
            type={type === 'radio' ? 'radio' : 'checkbox'}
            checked={key !== undefined && selectedRowKeys.includes(key)}
            onChange={(e: CheckboxChangeEvent) => {
              if (onChange && key !== undefined) {
                let nextKeys = [...selectedRowKeys];
                if (type === 'radio') {
                  nextKeys = e.target.checked ? [key] : [];
                } else {
                  if (e.target.checked) {
                    nextKeys.push(key);
                  } else {
                    nextKeys = nextKeys.filter((k) => k !== key);
                  }
                }
                const nextRows = data.filter(
                  (item) => item.key !== undefined && nextKeys.includes(item.key)
                );
                onChange(nextKeys, nextRows);
              }
            }}
          />
        );
      },
    };

    return [selectionColumn, ...columns];
  }, [columns, rowSelection, data]);

  const tableClasses = classNames(
    prefixCls,
    {
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-striped`]: striped,
      [`${prefixCls}-${mergedSize}`]: mergedSize !== 'middle',
      [`${prefixCls}-loading`]: loading,
    },
    className
  );

  // --- Skeleton columns/data when loading ---
  const displayColumns = React.useMemo<ColumnsType<T>>(() => {
    if (!loading) return mergedColumns;
    return mergedColumns.map((col) => ({
      ...col,
      render: () => (
        <Skeleton animation="wave" variant="rounded" height={16} style={{ maxWidth: '80%' }} />
      ),
    }));
  }, [loading, mergedColumns]);

  const skeletonData = React.useMemo(() => {
    if (!loading) return null;
    return Array.from({ length: skeletonRows }, (_, i) => ({ key: `__fi_skeleton_${i}` }) as T);
  }, [loading, skeletonRows]);

  // --- Pagination Logic ---
  const [internalCurrent, setInternalCurrent] = React.useState(1);
  const [internalPageSize, setInternalPageSize] = React.useState(
    pagination && typeof pagination === 'object' ? pagination.pageSize || 10 : 10
  );

  const paginationProps =
    pagination === false
      ? null
      : {
          align: 'end' as const,
          hideOnSinglePage: true,
          current: internalCurrent,
          pageSize: internalPageSize,
          total: data.length,
          onChange: (page: number, size: number) => {
            setInternalCurrent(page);
            setInternalPageSize(size);
            if (pagination && typeof pagination === 'object' && pagination.onChange) {
              pagination.onChange(page, size);
            }
          },
          ...pagination,
        };

  const showPagination =
    paginationProps &&
    ((paginationProps.total && paginationProps.total > (paginationProps.pageSize || 10)) ||
      data.length > (paginationProps.pageSize || 10));

  const slicedData = React.useMemo(() => {
    if (!showPagination || !paginationProps) return data;
    const current = paginationProps.current || 1;
    const pageSize = paginationProps.pageSize || 10;
    return data.slice((current - 1) * pageSize, current * pageSize);
  }, [data, showPagination, paginationProps?.current, paginationProps?.pageSize]);

  // --- Expandable Animation ---
  // rc-table removes expanded rows from the DOM on collapse, preventing CSS exit
  // animations. To fix this we keep ALL rows expanded in rc-table and control the
  // visual open/close state ourselves via a CSS class + transition.
  const mergedExpandable = React.useMemo(() => {
    if (!restProps.expandable) return undefined;

    const {
      expandedRowKeys: userKeys = [],
      expandedRowRender,
      ...expandRest
    } = restProps.expandable;
    const displayData = skeletonData ?? slicedData;
    const allKeys = displayData
      .map((item) => item.key)
      .filter((k): k is React.Key => k !== undefined);

    return {
      ...expandRest,
      expandedRowKeys: allKeys,
      expandedRowRender: expandedRowRender
        ? (record: T, index: number, indent: number, expanded: boolean) => {
            const isOpen =
              record.key !== undefined && (userKeys as readonly React.Key[]).includes(record.key);
            return (
              <ExpandContentWrapper isOpen={isOpen} prefixCls={prefixCls}>
                {expandedRowRender(record, index, indent, expanded)}
              </ExpandContentWrapper>
            );
          }
        : undefined,
    };
  }, [restProps.expandable, skeletonData, slicedData, prefixCls]);

  // Strip expandable from restProps since we pass mergedExpandable separately
  const { expandable: _expandable, ...tableRestProps } = restProps;

  return (
    <div className={`${prefixCls}-wrapper`}>
      <RCTable<T>
        {...tableRestProps}
        expandable={mergedExpandable}
        data={skeletonData ?? slicedData}
        columns={displayColumns}
        prefixCls={prefixCls}
        className={tableClasses}
        emptyText={tableLocale.emptyText}
        tableLayout={tableRestProps.tableLayout || (restProps.expandable ? 'fixed' : undefined)}
      />
      {showPagination && !loading && (
        <div className={`${prefixCls}-pagination-container`}>
          <Pagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}

Table.Summary = RCTable.Summary;
Table.Column = RCTable.Column;
Table.ColumnGroup = RCTable.ColumnGroup;
Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;

export { Table };

Table.displayName = 'Table';
