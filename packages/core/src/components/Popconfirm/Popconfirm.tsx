import React, { useState, useCallback, useEffect } from 'react';
import { Popover, PopoverProps } from '../Popover';
import { Button, ButtonProps } from '../Button';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import defaultLocale from '../locale/en_US';

export interface PopconfirmProps extends Omit<PopoverProps, 'title' | 'content'> {
  /**
   * Título principal de la confirmación.
   */
  title: React.ReactNode;

  /**
   * Descripción secundaria (opcional).
   */
  description?: React.ReactNode;

  /**
   * Callback que se ejecuta al presionar Confirmar.
   */
  onConfirm?: (e?: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback que se ejecuta al presionar Cancelar.
   */
  onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Texto del botón de confirmación.
   * @default 'OK'
   */
  okText?: React.ReactNode;

  /**
   * Texto del botón de cancelación.
   * @default 'Cancel'
   */
  cancelText?: React.ReactNode;

  /**
   * Propiedades pasadas directamente al botón de confirmación.
   */
  okButtonProps?: ButtonProps;

  /**
   * Propiedades pasadas directamente al botón de cancelación.
   */
  cancelButtonProps?: ButtonProps;

  /**
   * Icono decorativo.
   */
  icon?: React.ReactNode;

  /**
   * Si debe mostrarse el botón de cancelación.
   * @default true
   */
  showCancel?: boolean;
}

import { ExclamationCircleFilled } from '../_icons';

const defaultIcon = <ExclamationCircleFilled />;

export const Popconfirm: React.FC<PopconfirmProps> = (props) => {
  const {
    prefixCls: customPrefixCls,
    title,
    description,
    onConfirm,
    onCancel,
    okText: propsOkText,
    cancelText: propsCancelText,
    okButtonProps,
    cancelButtonProps,
    icon = defaultIcon,
    showCancel = true,
    children,
    open: customOpen,
    onOpenChange,
    trigger = ['click'],
    ...restProps
  } = props;

  const { locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls =
    getPrefixCls?.('popconfirm', customPrefixCls) || getDefaultPrefixCls('popconfirm');
  const [open, setOpen] = useState<boolean>(customOpen ?? false);

  const popconfirmLocale = contextLocale?.Popconfirm || defaultLocale.Popconfirm!;
  const okText = propsOkText ?? popconfirmLocale.okText;
  const cancelText = propsCancelText ?? popconfirmLocale.cancelText;

  useEffect(() => {
    if (customOpen !== undefined) {
      setOpen(customOpen);
    }
  }, [customOpen]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (customOpen === undefined) {
        setOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [customOpen, onOpenChange]
  );

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm?.(e);
    handleOpenChange(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCancel?.(e);
    handleOpenChange(false);
  };

  const renderContent = () => (
    <div className={`${prefixCls}-inner-content`}>
      <div className={`${prefixCls}-message`}>
        <div className={`${prefixCls}-message-icon`}>{icon}</div>
        <div className={`${prefixCls}-message-text`}>
          <div className={`${prefixCls}-title`}>{title}</div>
          {description && <div className={`${prefixCls}-description`}>{description}</div>}
        </div>
      </div>
      <div className={`${prefixCls}-buttons`}>
        {showCancel && (
          <Button size="small" onClick={handleCancel} {...cancelButtonProps}>
            {cancelText}
          </Button>
        )}
        <Button size="small" type="primary" onClick={handleConfirm} {...okButtonProps}>
          {okText}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      {...restProps}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      content={renderContent()}
      overlayClassName={prefixCls}
    >
      {children}
    </Popover>
  );
};

Popconfirm.displayName = 'Popconfirm';
