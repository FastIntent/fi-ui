import React from 'react';

type MotionRender = (
  props: Record<string, unknown>,
  ref: React.Ref<HTMLElement>
) => React.ReactNode;

interface CSSMotionProps {
  children?: React.ReactNode | MotionRender;
  visible?: boolean;
  removeOnLeave?: boolean;
  className?: string;
  style?: React.CSSProperties;
  motionName?: string;
}

const CSSMotion = React.forwardRef<HTMLElement, CSSMotionProps>((props, ref) => {
  const { children, visible = true, removeOnLeave, className, style, motionName } = props;

  if (!visible && removeOnLeave) {
    return null;
  }

  if (typeof children === 'function') {
    return (
      <>
        {children(
          {
            visible,
            className,
            style,
            motionName,
          },
          ref
        )}
      </>
    );
  }

  return <>{children}</>;
});

CSSMotion.displayName = 'CSSMotionMock';

interface CSSMotionListProps extends Omit<CSSMotionProps, 'children'> {
  keys?: Array<React.Key | { key: React.Key }>;
  children?: React.ReactNode | MotionRender;
}

export const CSSMotionList: React.FC<CSSMotionListProps> = ({
  keys = [],
  children,
  ...motionProps
}) => {
  if (typeof children === 'function') {
    return (
      <>
        {keys.map((item) => {
          const key = typeof item === 'object' && item !== null ? item.key : item;
          return (
            <React.Fragment key={key}>
              {children({ ...motionProps, key, visible: true }, null)}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return <>{children}</>;
};

export const Provider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

export const isRefNotConsumed = () => false;
export const genCSSMotion = () => CSSMotion;
export const genCSSMotionList = () => CSSMotionList;

export default CSSMotion;
