import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Card.
 * Un contenedor estándar para presentar información agrupada como texto, imágenes y acciones.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  size?: 'default' | 'small';
  bodyStyle?: React.CSSProperties;
  headStyle?: React.CSSProperties;
  prefixCls?: string;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  /** Muestra un skeleton de carga en lugar del contenido. */
  loading?: boolean;
}

export interface CardMetaProps {
  /** Avatar a la izquierda del meta. */
  avatar?: React.ReactNode;
  /** Título en negrita. */
  title?: React.ReactNode;
  /** Descripción secundaria. */
  description?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardMeta: React.FC<CardMetaProps> = ({ avatar, title, description, className, style }) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('card') || getDefaultPrefixCls('card');
  return (
    <div className={classNames(`${prefixCls}-meta`, className)} style={style}>
      {avatar && <div className={`${prefixCls}-meta-avatar`}>{avatar}</div>}
      <div className={`${prefixCls}-meta-detail`}>
        {title && <div className={`${prefixCls}-meta-title`}>{title}</div>}
        {description && <div className={`${prefixCls}-meta-description`}>{description}</div>}
      </div>
    </div>
  );
};

CardMeta.displayName = 'CardMeta';

const CardBase = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    prefixCls: customPrefixCls,
    className,
    title,
    extra,
    bordered = true,
    hoverable = false,
    size = 'default',
    bodyStyle,
    headStyle,
    cover,
    actions,
    loading = false,
    children,
    ...restProps
  } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('card', customPrefixCls) || getDefaultPrefixCls('card');

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-hoverable`]: hoverable,
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-loading`]: loading,
    },
    className
  );

  let head;
  if (title || extra) {
    head = (
      <div className={`${prefixCls}-head`} style={headStyle}>
        <div className={`${prefixCls}-head-wrapper`}>
          {title && <div className={`${prefixCls}-head-title`}>{title}</div>}
          {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
        </div>
      </div>
    );
  }

  const coverDom = cover ? <div className={`${prefixCls}-cover`}>{cover}</div> : null;

  const loadingBlock = (
    <div className={`${prefixCls}-loading-content`}>
      {[['94%'], ['28%', '48%'], ['62%', '32%'], ['48%']].map((row, i) => (
        <p key={i}>
          {row.map((w, j) => (
            <span key={j} className={`${prefixCls}-loading-block`} style={{ width: w }} />
          ))}
        </p>
      ))}
    </div>
  );

  const body = (
    <div className={`${prefixCls}-body`} style={bodyStyle}>
      {loading ? loadingBlock : children}
    </div>
  );

  const actionDom =
    actions && actions.length ? (
      <ul className={`${prefixCls}-actions`}>
        {actions.map((action, index) => (
          <li
            key={
              React.isValidElement(action) && action.key !== null ? action.key : `action-${index}`
            }
            style={{ width: `${100 / actions.length}%` }}
          >
            <span>{action}</span>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div {...restProps} className={classes} ref={ref}>
      {head}
      {coverDom}
      {body}
      {actionDom}
    </div>
  );
});

CardBase.displayName = 'Card';

const Card = CardBase as typeof CardBase & { Meta: typeof CardMeta };
Card.Meta = CardMeta;

export { Card };
