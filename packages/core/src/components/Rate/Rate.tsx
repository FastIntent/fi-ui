import React, { forwardRef } from 'react';
import RcRate from '@rc-component/rate';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

const StarIcon = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="star"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
  </svg>
);

/**
 * Propiedades del componente Rate.
 * Componente de calificación por estrellas interactivo.
 * Basado en `@rc-component/rate`.
 */
export interface RateProps {
  /**
   * Valor actual de la calificación (número de estrellas).
   */
  value?: number;

  /**
   * Valor inicial por defecto.
   */
  defaultValue?: number;

  /**
   * Número total de estrellas a mostrar.
   * @default 5
   */
  count?: number;

  /**
   * Permite seleccionar medias estrellas.
   * @default false
   */
  allowHalf?: boolean;

  /**
   * Permite deseleccionar la calificación si se hace clic de nuevo en el mismo valor.
   * @default false
   */
  allowClear?: boolean;

  /**
   * Si es `true`, el componente será solo de lectura.
   * @default false
   */
  disabled?: boolean;

  /**
   * Texto informativo que aparece al pasar el mouse por cada estrella (Tooltip nativo).
   */
  tooltips?: string[];

  /**
   * Callback ejecutado cuando el valor cambia.
   */
  onChange?: (value: number) => void;

  /**
   * Callback ejecutado cuando el usuario pasa el mouse por una estrella.
   */
  onHoverChange?: (value: number) => void;

  /**
   * Clases CSS adicionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;

  /**
   * Icono personalizado para las estrellas.
   */
  character?: React.ReactNode;
}

const Rate = forwardRef<HTMLUListElement, RateProps>((props, ref) => {
  const { className, disabled, character = <StarIcon />, tooltips, ...rest } = props;
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('rate') || getDefaultPrefixCls('rate');

  const rateCls = classNames(prefixCls, className);

  // characterRender adds aria-label to each star's role="radio" div for WCAG compliance.
  // rc-rate renders <div role="radio"> without an accessible name, violating aria-toggle-field-name.
  // origin = <li ...><div role="radio" ...>...</div></li>
  const characterRender = (
    origin: React.ReactElement,
    starProps: { index?: number; count?: number }
  ) => {
    const index = starProps.index ?? 0;
    const count = starProps.count ?? 5;
    const label = tooltips?.[index] ?? `${index + 1} of ${count}`;
    const liProps = origin.props as {
      children: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>;
    };
    const radioDiv = liProps.children;
    return React.cloneElement(
      origin,
      {},
      React.cloneElement(radioDiv, { 'aria-label': label, title: label })
    );
  };

  return (
    <RcRate
      {...rest}
      ref={ref}
      prefixCls={prefixCls}
      className={rateCls}
      disabled={disabled}
      character={character}
      characterRender={characterRender}
    />
  );
});

Rate.displayName = 'Rate';

export { Rate };
