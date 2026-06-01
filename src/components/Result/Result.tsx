import React from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { ResultCheckIcon, ResultCloseIcon, ResultInfoIcon, ResultWarningIcon } from '../_icons';

/**
 * Define los estados semánticos que puede representar el componente Result.
 */
export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '500' | '403';

/**
 * Propiedades del componente Result.
 * Se utiliza para retroalimentar al usuario sobre el resultado de una tarea importante o el estado de una página completa.
 */
export interface ResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * El estado del resultado. Determina el icono y el color principal.
   * @default 'info'
   */
  status?: ResultStatus;

  /**
   * El título principal del resultado.
   */
  title?: React.ReactNode;

  /**
   * Una descripción detallada u opcional que acompaña al título.
   */
  subTitle?: React.ReactNode;

  /**
   * Icono personalizado. Si se provee, sobrescribe el icono basado en el `status`.
   */
  icon?: React.ReactNode;

  /**
   * Área de acciones, usualmente botones (ej. "Volver al inicio", "Reintentar").
   */
  extra?: React.ReactNode;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

const statusIconMap: Record<string, React.ReactNode> = {
  success: <ResultCheckIcon />,
  error: <ResultCloseIcon />,
  info: <ResultInfoIcon />,
  warning: <ResultWarningIcon />,
  '403': <ResultWarningIcon />,
  '404': <ResultInfoIcon />,
  '500': <ResultCloseIcon />,
};

/**
 * Result - Componente de retroalimentación de alto nivel.
 */
export const Result: React.FC<ResultProps> = ({
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className,
  style,
  ...props
}) => {
  const { locale: contextLocale, getPrefixCls } = useConfig();
  const resultLocale = contextLocale?.Result || defaultLocale.Result!;
  const prefixCls = getPrefixCls?.('result') || getDefaultPrefixCls('result');

  const classes = classNames(prefixCls, `${prefixCls}-status-${status}`, className);

  const renderIcon = () => {
    if (icon) return icon;
    return statusIconMap[status] || statusIconMap.info;
  };

  const mergedTitle =
    title ||
    (status === '403'
      ? resultLocale.title403
      : status === '404'
        ? resultLocale.title404
        : status === '500'
          ? resultLocale.title500
          : undefined);

  const mergedSubTitle =
    subTitle ||
    (status === '403'
      ? resultLocale.subtitle403
      : status === '404'
        ? resultLocale.subtitle404
        : status === '500'
          ? resultLocale.subtitle500
          : undefined);

  return (
    <div className={classes} style={style} {...props}>
      <div className={`${prefixCls}-icon`}>{renderIcon()}</div>
      {mergedTitle && <div className={`${prefixCls}-title`}>{mergedTitle}</div>}
      {mergedSubTitle && <div className={`${prefixCls}-subtitle`}>{mergedSubTitle}</div>}
      {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
      {props.children && <div className={`${prefixCls}-content`}>{props.children}</div>}
    </div>
  );
};

Result.displayName = 'Result';
