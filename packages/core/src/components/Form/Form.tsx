import React from 'react';
import RcForm, { FormProps as RcFormProps } from '@rc-component/form';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import defaultLocale from '../locale/en_US';
import { FormItem } from './FormItem';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { FormContext } from './context';

/**
 * Propiedades del componente Form.
 * Sirve como contenedor principal para recolectar, validar y enviar datos del usuario.
 * Hereda el sistema de estado y validación potente de `@rc-component/form`.
 */
export interface FormProps extends RcFormProps {
  /**
   * Disposición de los campos del formulario.
   * - `vertical`: La etiqueta de cada campo se coloca arriba del input (por defecto, mejor para pantallas pequeñas).
   * - `horizontal`: La etiqueta se coloca a la izquierda del input.
   * - `inline`: Todos los campos se intentan acomodar en una sola línea (ideal para barras de búsqueda/filtros).
   *
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /**
   * Configura la visualización de la marca de obligatorio (asterisco rojo).
   * - `true`: Muestra el asterisco en campos requeridos.
   * - `false`: Oculta el asterisco en campos requeridos.
   * - `'optional'`: Muestra la marca en campos opcionales (opcional).
   */
  requiredMark?: boolean | 'optional';
}

export const Form: React.FC<FormProps> & { Item: typeof FormItem } = ({
  layout = 'vertical',
  className,
  children,
  requiredMark,
  ...restProps
}) => {
  const { locale: contextLocale } = useConfig();
  const formLocale = contextLocale?.Form || defaultLocale.Form!;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('form') || getDefaultPrefixCls('form');

  return (
    <FormContext.Provider value={{ requiredMark }}>
      <RcForm
        className={classNames(prefixCls, `${prefixCls}-${layout}`, className)}
        validateMessages={formLocale.defaultValidateMessages}
        {...restProps}
      >
        {children}
      </RcForm>
    </FormContext.Provider>
  );
};

Form.Item = FormItem;

Form.displayName = 'Form';
