import React from 'react';
import Dialog from '@rc-component/dialog';
import classNames from 'classnames';
import { Button } from '../Button/Button';
import { useConfig } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Modal.
 * Un cuadro de diálogo emergente que se superpone al resto de la aplicación, requiriendo la atención del usuario.
 */
export interface ModalProps {
  /**
   * Controla si el Modal está visible (`true`) u oculto (`false`).
   * @default false
   */
  open?: boolean;

  /**
   * Título principal renderizado en la cabecera del Modal.
   */
  title?: React.ReactNode;

  /**
   * Contenido o cuerpo principal del Modal.
   */
  children?: React.ReactNode;

  /**
   * Callback que se ejecuta cuando el usuario intenta cerrar el Modal
   * (haciendo clic en la "X", pulsando la tecla Esc, o clicando el botón "Cancelar").
   */
  onCancel?: () => void;

  /**
   * Callback que se ejecuta cuando el usuario hace clic en el botón de confirmación ("Aceptar").
   */
  onOk?: () => void;

  /**
   * Sobrescribe completamente el pie del Modal (los botones de "Aceptar" y "Cancelar").
   * Pasar `null` ocultará el pie de página por completo.
   */
  footer?: React.ReactNode;

  /**
   * Ancho fijo del Modal. Puede ser un número (en píxeles) o un porcentaje/medida en CSS (ej. `'50vw'`).
   * @default 520
   */
  width?: number | string;

  /**
   * Si es `true`, el Modal aparecerá centrado verticalmente en la pantalla.
   * Si es `false`, aparecerá ligeramente más arriba (estilo tradicional).
   * @default false
   */
  centered?: boolean;

  /**
   * Determina si al hacer clic fuera del Modal (en la máscara de fondo) este se debe cerrar.
   * @default true
   */
  maskClosable?: boolean;

  /**
   * Si es `true`, destruye completamente los componentes hijos (`children`) cuando el Modal se cierra.
   * Útil para limpiar el estado interno de formularios dentro del Modal.
   * @default false
   */
  destroyOnClose?: boolean;

  /**
   * Clases CSS opcionales para personalizar el contenedor principal del Modal.
   */
  className?: string;

  /**
   * Texto personalizado para el botón de cancelación.
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * Texto personalizado para el botón de confirmación.
   * @default "OK"
   */
  okText?: string;

  /**
   * La profundidad z-index del Modal. Útil si tienes otros elementos flotantes o modales anidados.
   * @default 1000
   */
  zIndex?: number;

  /**
   * Posición en la pantalla desde donde se originó la acción (ej. el ratón al hacer clic),
   * utilizado para animar la aparición del Modal desde ese punto exacto.
   */
  mousePosition?: { x: number; y: number } | null;
}

let mousePosition: { x: number; y: number } | null = null;

// Track last click position globally
if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  document.documentElement.addEventListener(
    'click',
    (e: MouseEvent) => {
      mousePosition = { x: e.pageX, y: e.pageY };
      setTimeout(() => {
        mousePosition = null;
      }, 100);
    },
    true
  );
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onCancel,
  onOk,
  footer,
  width = 520,
  centered = false,
  maskClosable = true,
  destroyOnClose = true,
  className,
  cancelText: propsCancelText,
  okText: propsOkText,
  zIndex = 1000,
}) => {
  const { locale: contextLocale, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('modal') || getDefaultPrefixCls('modal');
  const rootPrefixCls = getPrefixCls?.('') || 'fi';

  const modalLocale = contextLocale?.Modal || defaultLocale.Modal!;
  const cancelText = propsCancelText ?? modalLocale.cancelText;
  const okText = propsOkText ?? modalLocale.okText;

  const footerNode =
    footer !== undefined ? (
      footer
    ) : (
      <>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button type="primary" onClick={onOk}>
          {okText}
        </Button>
      </>
    );

  return (
    <Dialog
      visible={open}
      title={title}
      footer={footerNode}
      onClose={onCancel}
      width={width}
      zIndex={zIndex}
      maskClosable={maskClosable}
      destroyOnHidden={destroyOnClose}
      prefixCls={prefixCls}
      classNames={{ wrapper: classNames({ [`${prefixCls}-centered`]: centered }) }}
      className={className}
      closeIcon={
        <span aria-label={modalLocale.closeAriaLabel} className={`${prefixCls}-close-x`}>
          ×
        </span>
      }
      transitionName={`${rootPrefixCls}-zoom`}
      maskTransitionName={`${rootPrefixCls}-fade`}
      mousePosition={mousePosition}
      getContainer={typeof document !== 'undefined' ? document.body : false}
    >
      {children}
    </Dialog>
  );
};

Modal.displayName = 'Modal';
