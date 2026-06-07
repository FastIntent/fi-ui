import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPlacement =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'top'
  | 'bottom';

/**
 * Configuración de una notificación emergente.
 */
export interface NotificationItem {
  /**
   * Identificador único de la notificación.
   * Si no se provee, la librería generará uno aleatorio.
   */
  key?: string;

  /**
   * Determina el icono semántico y color de la notificación.
   * - `success`: Marca de verificación verde.
   * - `error`: Cruz roja.
   * - `warning`: Triángulo de advertencia amarillo.
   * - `info`: Signo de información azul.
   */
  type?: NotificationType;

  /**
   * El título o texto principal de la notificación. Requerido.
   */
  message: React.ReactNode;

  /**
   * Texto secundario con detalles adicionales sobre la notificación.
   */
  description?: React.ReactNode;

  /**
   * Icono personalizado que sobrescribe al icono predeterminado del `type`.
   */
  icon?: React.ReactNode;

  /**
   * Tiempo en segundos antes de que la notificación se cierre automáticamente.
   * Usa `null` para que no se cierre nunca automáticamente.
   *
   * @default 4.5
   */
  duration?: number | null;

  /**
   * Posición en la pantalla donde aparecerá la notificación.
   * @default 'topRight'
   */
  placement?: NotificationPlacement;

  /**
   * Muestra un botón de cierre (✕) en la esquina superior derecha.
   * @default true
   */
  closable?: boolean;

  /**
   * Callback ejecutado cuando el usuario cierra la notificación (manualmente o por expiración de tiempo).
   */
  onClose?: () => void;

  /**
   * Callback ejecutado al hacer clic en el contenedor de la notificación.
   */
  onClick?: () => void;
}

export interface NotificationNodeProps extends NotificationItem {
  notificationKey: string;
  onRemove: (key: string) => void;
  prefixCls?: string;
}

import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '../_icons';

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  info: <InfoCircleFilled />,
};

export const NotificationNode: React.FC<NotificationNodeProps> = (props) => {
  const {
    notificationKey,
    type,
    message,
    description,
    icon,
    closable = true,
    duration = 4.5,
    onClose,
    onClick,
    onRemove,
    prefixCls = getDefaultPrefixCls('notification'),
  } = props;

  const { locale: contextLocale } = useConfig();
  const notificationLocale = contextLocale?.Notification || defaultLocale.Notification!;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    onClose?.();
    onRemove(notificationKey);
  };

  const handleNoticeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return;

    event.preventDefault();
    onClick();
  };

  const noticeInteractionProps = onClick
    ? {
        onClick,
        onKeyDown: handleNoticeKeyDown,
        role: 'button',
        tabIndex: 0,
      }
    : {};

  useEffect(() => {
    if (duration !== null && duration !== undefined && duration > 0) {
      timerRef.current = setTimeout(close, duration * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Removed obsolete exhaustive-deps comment
  }, []);

  const iconNode =
    icon ??
    (type ? (
      <span className={`${prefixCls}-icon ${prefixCls}-icon-${type}`}>{icons[type]}</span>
    ) : null);

  return (
    <div
      className={classNames(`${prefixCls}-notice`, {
        [`${prefixCls}-notice-${type}`]: !!type,
      })}
      data-notification-key={notificationKey}
      {...noticeInteractionProps}
    >
      <div className={`${prefixCls}-notice-content`}>
        {iconNode && <div className={`${prefixCls}-notice-icon`}>{iconNode}</div>}
        <div className={`${prefixCls}-notice-message-wrapper`}>
          <div className={`${prefixCls}-notice-message`}>{message}</div>
          {description && <div className={`${prefixCls}-notice-description`}>{description}</div>}
        </div>
      </div>
      {closable && (
        <button
          className={`${prefixCls}-notice-close`}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          aria-label={notificationLocale.closeAriaLabel}
        >
          ✕
        </button>
      )}
    </div>
  );
};

NotificationNode.displayName = 'NotificationNode';
