import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import {
  CheckCircleFilled as SuccessIcon,
  InfoCircleFilled as InfoIcon,
  ExclamationCircleFilled as WarningIcon,
  CloseCircleFilled as ErrorIcon,
  LoadingOutlined as LoadingIcon,
} from '../_icons';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

/**
 * Configuración de un mensaje global transitorio.
 */
export interface MessageConfig {
  /**
   * Identificador único. Permite actualizar o cerrar un mensaje específico.
   */
  key?: string;

  /**
   * Contenido del mensaje.
   */
  content: React.ReactNode;

  /**
   * Tipo semántico que determina el icono y el color.
   * @default 'info'
   */
  type?: MessageType;

  /**
   * Segundos antes del cierre automático. `null` para no cerrar nunca.
   * @default 3
   */
  duration?: number | null;

  /**
   * Icono personalizado que reemplaza al icono de tipo.
   */
  icon?: React.ReactNode;

  /**
   * Callback ejecutado al cerrarse el mensaje.
   */
  onClose?: () => void;

  /** Clases CSS adicionales sobre el item. */
  className?: string;

  /** Estilos inline sobre el item. */
  style?: React.CSSProperties;
}

// ─── MessageItem (internal) ───────────────────────────────────────────────────

export interface MessageItemProps extends MessageConfig {
  messageKey: string;
  prefixCls: string;
  onRemove: (key: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  messageKey,
  prefixCls,
  content,
  type = 'info',
  duration = 3,
  icon,
  onClose,
  onRemove,
  className,
  style,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);

  const close = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLeaving(true);
  }, []);

  useEffect(() => {
    if (duration !== null && duration !== undefined && duration > 0) {
      timerRef.current = setTimeout(close, duration * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    // Only act on the leaving animation, not the enter one
    if (leaving && e.animationName.includes('message-leave')) {
      onClose?.();
      onRemove(messageKey);
    }
  };

  const resolvedIcon =
    icon ??
    {
      success: <SuccessIcon />,
      info: <InfoIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />,
      loading: (
        <span className={`${prefixCls || getDefaultPrefixCls('message')}-spin`}>
          <LoadingIcon />
        </span>
      ),
    }[type];

  const prefixCls_ = prefixCls || getDefaultPrefixCls('message');

  return (
    <div
      className={classNames(
        `${prefixCls_}-notice`,
        `${prefixCls_}-notice-${type}`,
        { [`${prefixCls_}-notice-leaving`]: leaving },
        className
      )}
      style={style}
      data-message-key={messageKey}
      role="status"
      aria-live="polite"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={`${prefixCls_}-notice-icon`} aria-hidden="true">
        {resolvedIcon}
      </span>
      <span className={`${prefixCls_}-notice-content`}>{content}</span>
    </div>
  );
};

MessageItem.displayName = 'MessageItem';
