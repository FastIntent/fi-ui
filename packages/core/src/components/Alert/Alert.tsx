import React, { useState } from 'react';
import classNames from 'classnames';
import { useConfig, usePrefixCls } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import {
  CheckCircleFilled as SuccessIcon,
  InfoCircleFilled as InfoIcon,
  ExclamationCircleFilled as WarningIcon,
  CloseCircleFilled as ErrorIcon,
} from '../_icons';

/**
 * Propiedades del componente Alert.
 * Muestra mensajes de advertencia o informativos que no interrumpen el flujo del usuario.
 */
export interface AlertProps {
  /**
   * El mensaje principal de la alerta.
   */
  message: React.ReactNode;

  /**
   * Información detallada de la alerta.
   */
  description?: React.ReactNode;

  /**
   * El tipo de alerta. Determina el color y el icono por defecto.
   * @default 'info'
   */
  type?: 'success' | 'info' | 'warning' | 'error';

  /**
   * Si es `true`, muestra el icono correspondiente al tipo de alerta.
   * @default false
   */
  showIcon?: boolean;

  /**
   * Icono personalizado.
   */
  icon?: React.ReactNode;

  /**
   * Si es `true`, permite al usuario cerrar la alerta.
   */
  closable?: boolean;

  /**
   * Texto personalizado para el botón de cierre.
   */
  closeText?: React.ReactNode;

  /**
   * Callback ejecutado al cerrar la alerta.
   */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Clases CSS adicionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

const Alert: React.FC<AlertProps> = (props) => {
  const {
    message,
    description,
    type = 'info',
    showIcon = false,
    icon,
    closable,
    closeText,
    onClose,
    className,
    style,
  } = props;

  const { locale: contextLocale } = useConfig();
  const prefixCls = usePrefixCls('alert');
  const alertLocale = contextLocale?.Alert || defaultLocale.Alert!;
  const [closed, setClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  if (closed) return null;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClosing(true);
    onClose?.(e);
  };

  const handleAnimationEnd = () => {
    if (closing) setClosed(true);
  };

  const renderIcon = () => {
    if (!showIcon && !icon) return null;
    if (icon) return <span className={`${prefixCls}-icon`}>{icon}</span>;

    let iconNode: React.ReactNode;
    switch (type) {
      case 'success':
        iconNode = <SuccessIcon />;
        break;
      case 'warning':
        iconNode = <WarningIcon />;
        break;
      case 'error':
        iconNode = <ErrorIcon />;
        break;
      default:
        iconNode = <InfoIcon />;
    }

    return <span className={`${prefixCls}-icon`}>{iconNode}</span>;
  };

  const classes = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-with-description`]: !!description,
      [`${prefixCls}-closing`]: closing,
    },
    className
  );

  return (
    <div className={classes} style={style} role="alert" onAnimationEnd={handleAnimationEnd}>
      {renderIcon()}
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-message`}>{message}</div>
        {description && <div className={`${prefixCls}-description`}>{description}</div>}
      </div>
      {closable && (
        <button type="button" onClick={handleClose} className={`${prefixCls}-close-icon`}>
          {closeText || <span aria-label={alertLocale.closeAriaLabel}>×</span>}
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

export { Alert };
