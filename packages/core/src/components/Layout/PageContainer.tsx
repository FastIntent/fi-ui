import React from 'react';
import classNames from 'classnames';
import { usePrefixCls } from '../ConfigProvider';

export interface PageContainerProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  description,
  extra,
  className,
}) => {
  const prefixCls = usePrefixCls('page-container');

  return (
    <div className={classNames(prefixCls, className)}>
      {(title || description || extra) && (
        <header className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-header-left`}>
            {title && <h2 className={`${prefixCls}-title`}>{title}</h2>}
            {description && <p className={`${prefixCls}-description`}>{description}</p>}
          </div>
          {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
        </header>
      )}
      <div className={`${prefixCls}-content`}>{children}</div>
    </div>
  );
};

PageContainer.displayName = 'PageContainer';
