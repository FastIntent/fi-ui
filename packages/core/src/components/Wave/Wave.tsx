import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  cloneElement,
  isValidElement,
} from 'react';

/**
 * Propiedades del componente Wave.
 * Componente utilitario invisible que inyecta un efecto visual de "onda" expansiva
 * a sus componentes hijos cuando son clicados (usado internamente por Button, Switch, Checkbox, etc.).
 */
export interface WaveProps {
  /**
   * El elemento React sobre el cual se aplicará la animación.
   * Debe ser un nodo HTML o componente que pase los atributos `data-wave-active` y `onClick` al DOM.
   */
  children: ReactElement;

  /**
   * Desactiva el efecto de onda, previniendo que se inicie la animación al hacer clic.
   * @default false
   */
  disabled?: boolean;
}

type WaveChildProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  'data-wave-active'?: string;
};

export const Wave: React.FC<WaveProps> = ({ children, disabled }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = () => {
    if (disabled) return;

    // Reset state to trigger animation restart if clicked again fast
    setActive(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Small delay to ensure the DOM state is reset for CSS animation
    requestAnimationFrame(() => {
      setActive(true);
      timeoutRef.current = setTimeout(() => {
        setActive(false);
      }, 2000);
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isValidElement(children)) return children;

  const waveChild = children as ReactElement<WaveChildProps>;
  const { onClick: childOnClick } = waveChild.props;

  return cloneElement(waveChild, {
    'data-wave-active': active ? 'true' : 'false',
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      handleClick();
      childOnClick?.(e);
    },
  });
};

Wave.displayName = 'Wave';
