import React from 'react';
import RCPagination from '@rc-component/pagination';
import type { PaginationProps as RCPaginationProps } from '@rc-component/pagination';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';

/**
 * Propiedades del componente Pagination.
 * Extiende todas las propiedades nativas de `rc-pagination`, como `current`, `total`, `pageSize`, `onChange`, etc.
 * Utilizado para dividir listas largas de datos en múltiples páginas legibles.
 */
export interface PaginationProps extends RCPaginationProps {
  /**
   * Determina el tamaño de los controles de la paginación.
   * `small` es útil para tablas compactas o tarjetas pequeñas.
   *
   * @default 'default'
   */
  size?: 'small' | 'default';

  /**
   * Alineación horizontal del bloque de paginación completo dentro de su contenedor padre.
   * - `start`: Alineado a la izquierda.
   * - `center`: Centrado en la pantalla (común en galerías).
   * - `end`: Alineado a la derecha (común al pie de tablas).
   */
  align?: 'start' | 'center' | 'end';
}

const PrevIcon = () => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 9L4.5 6L7.5 3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.5 9L7.5 6L4.5 3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pagination: React.FC<PaginationProps> = (props) => {
  const { prefixCls: customPrefixCls, className, size, align = 'start', ...restProps } = props;

  const { size: contextSize, locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls =
    getPrefixCls?.('pagination', customPrefixCls) || getDefaultPrefixCls('pagination');
  const mergedSize = size || (contextSize === 'small' ? 'small' : 'default');
  const paginationLocale = contextLocale?.Pagination || defaultLocale.Pagination!;

  const paginationCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-small`]: mergedSize === 'small',
      [`${prefixCls}-${align}`]: align,
    },
    className
  );

  return (
    <RCPagination
      {...restProps}
      locale={paginationLocale}
      showTitle={false}
      prefixCls={prefixCls}
      className={paginationCls}
      prevIcon={
        <span className={`${prefixCls}-item-link-icon`}>
          <PrevIcon />
        </span>
      }
      nextIcon={
        <span className={`${prefixCls}-item-link-icon`}>
          <NextIcon />
        </span>
      }
      jumpPrevIcon={
        <span className={`${prefixCls}-item-container`}>
          <span className={`${prefixCls}-item-link-icon`}>•••</span>
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </span>
      }
      jumpNextIcon={
        <span className={`${prefixCls}-item-container`}>
          <span className={`${prefixCls}-item-link-icon`}>•••</span>
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </span>
      }
    />
  );
};

export { Pagination };

Pagination.displayName = 'Pagination';
