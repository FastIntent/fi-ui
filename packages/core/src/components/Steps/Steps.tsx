import React from 'react';
import classNames from 'classnames';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { useConfig } from '../ConfigProvider';

/**
 * Estado posible para cada paso individual.
 */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/**
 * Variante de presentación del componente Steps.
 */
export type StepsVariant = 'default' | 'detailed';

/**
 * Tamaño del componente Steps.
 */
export type StepsSize = 'small' | 'middle';

/**
 * Propiedades de un paso individual.
 */
export interface StepProps {
  /**
   * Título del paso.
   */
  title?: React.ReactNode;

  /**
   * Descripción detallada del paso.
   */
  description?: React.ReactNode;

  /**
   * Icono personalizado para el paso. Si no se provee, se muestra el número.
   */
  icon?: React.ReactNode;

  /**
   * Estado del paso. Si no se provee, Steps lo calcula automáticamente basado en `current`.
   */
  status?: StepStatus;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Número del paso. Se inyecta automáticamente desde `Steps` pero puede
   * sobreescribirse para casos donde los pasos no siguen la secuencia natural.
   */
  stepNumber?: number;

  /**
   * Muestra el número del paso como texto en el body de la fila detailed.
   * Útil cuando el ícono muestra ✓ y aún se quiere ver el índice.
   * Se hereda desde `Steps.showStepNumber` pero puede sobreescribirse por paso.
   * @default false
   */
  showStepNumber?: boolean;

  /**
   * Variante interna inyectada por Steps. No pasar manualmente.
   */
  variant?: StepsVariant;

  /**
   * Contenido del panel lateral derecho en variant="detailed".
   * Se renderiza tal cual dentro del aside — puede ser cualquier combinación
   * de nodos: texto, Tag, Badge, spans, iconos, etc.
   * Si no se provee, el aside no se renderiza.
   *
   * @example
   * ```tsx
   * <Step title="Generar AppGraph" description="...">
   *   <span>appgraph.json</span>
   *   <Tag color="success">✓ Completado</Tag>
   *   <span>512ms</span>
   * </Step>
   * ```
   */
  children?: React.ReactNode;
}

/**
 * Step - Subcomponente para cada paso.
 */
export const Step: React.FC<StepProps> = ({
  title,
  description,
  icon,
  status,
  className,
  stepNumber,
  showStepNumber = false,
  variant = 'default',
  children,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('steps-item') || getDefaultPrefixCls('steps-item');

  if (variant === 'detailed') {
    const detailedCls = classNames(
      `${prefixCls}-detailed`,
      `${prefixCls}-detailed-${status}`,
      className
    );

    const renderDetailedIcon = () => {
      if (icon) return <span className={`${prefixCls}-detailed-icon`}>{icon}</span>;
      if (status === 'finish') return <span className={`${prefixCls}-detailed-icon`}>✓</span>;
      return <span className={`${prefixCls}-detailed-icon`}>{stepNumber}</span>;
    };

    return (
      <div className={detailedCls}>
        <div className={`${prefixCls}-detailed-rail`}>
          <div className={`${prefixCls}-detailed-icon-wrapper`}>{renderDetailedIcon()}</div>
        </div>
        <div className={`${prefixCls}-detailed-body`}>
          {showStepNumber && (
            <span className={`${prefixCls}-detailed-step-number`}>{stepNumber}</span>
          )}
          <div className={`${prefixCls}-detailed-content`}>
            <span className={`${prefixCls}-detailed-title`}>{title}</span>
            {description && (
              <span className={`${prefixCls}-detailed-description`}>{description}</span>
            )}
          </div>
          {children && <div className={`${prefixCls}-detailed-aside`}>{children}</div>}
        </div>
      </div>
    );
  }

  const classes = classNames(prefixCls, `${prefixCls}-status-${status}`, className);

  const renderIcon = () => {
    if (icon) return <span className={`${prefixCls}-icon`}>{icon}</span>;
    if (status === 'finish') return <span className={`${prefixCls}-icon`}>✓</span>;
    return <span className={`${prefixCls}-icon`}>{stepNumber}</span>;
  };

  return (
    <div className={classes}>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-tail`} />
        <div className={`${prefixCls}-icon-wrapper`}>{renderIcon()}</div>
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-title`}>{title}</div>
          {description && <div className={`${prefixCls}-description`}>{description}</div>}
        </div>
      </div>
    </div>
  );
};

/**
 * Propiedades del componente Steps.
 */
export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Índice del paso actual (empezando desde 0).
   * @default 0
   */
  current?: number;

  /**
   * Dirección del componente.
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Estado del paso actual.
   * @default 'process'
   */
  status?: StepStatus;

  /**
   * Variante de presentación.
   * - `'default'`: layout estándar horizontal/vertical.
   * - `'detailed'`: filas ricas con meta, badge de estado y extra (siempre vertical).
   * @default 'default'
   */
  variant?: StepsVariant;

  /**
   * Tamaño del componente.
   * @default 'middle'
   */
  size?: StepsSize;

  /**
   * Muestra el número del paso como texto en el body de cada fila detailed.
   * Puede sobreescribirse individualmente en cada `Step`.
   * @default false
   */
  showStepNumber?: boolean;

  /**
   * Nodos hijos (componentes `Steps.Step`).
   */
  children?: React.ReactNode;

  /**
   * Clases CSS opcionales.
   */
  className?: string;

  /**
   * Estilos CSS en línea.
   */
  style?: React.CSSProperties;
}

interface StepsInterface extends React.FC<StepsProps> {
  Step: typeof Step;
}

/**
 * Steps - Componente para procesos guiados.
 */
export const Steps: StepsInterface = ({
  current = 0,
  direction = 'horizontal',
  status = 'process',
  variant = 'default',
  size = 'middle',
  showStepNumber = false,
  children,
  className,
  style,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('steps') || getDefaultPrefixCls('steps');
  const classes = classNames(
    prefixCls,
    variant === 'detailed' ? `${prefixCls}-detailed` : `${prefixCls}-${direction}`,
    `${prefixCls}-${size}`,
    className
  );

  const renderedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    // Calcular estado automático basado en 'current'
    let childStatus: StepStatus = 'wait';
    if (index < current) {
      childStatus = 'finish';
    } else if (index === current) {
      childStatus = status;
    }

    const element = child as React.ReactElement<StepProps>;

    return React.cloneElement(element, {
      stepNumber: element.props.stepNumber ?? index + 1,
      status: element.props.status || childStatus,
      variant,
      showStepNumber: element.props.showStepNumber ?? showStepNumber,
    });
  });

  return (
    <div className={classes} style={style} {...props}>
      {renderedChildren}
    </div>
  );
};

Steps.Step = Step;
Steps.displayName = 'Steps';
