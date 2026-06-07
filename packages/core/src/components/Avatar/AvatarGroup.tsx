import React from 'react';
import classNames from 'classnames';
import { usePrefixCls } from '../ConfigProvider';
import { Avatar, AvatarProps } from './Avatar';
import { Tooltip } from '../Tooltip';

export interface AvatarGroupMaxConfig {
  /** Maximum number of avatars to display before showing overflow counter. */
  count: number;
  /** Custom style for the overflow counter avatar. */
  style?: React.CSSProperties;
  /** Popover/tooltip trigger for the overflow counter. */
  popover?: { trigger?: 'click' | 'hover' };
}

export interface AvatarGroupProps {
  children?: React.ReactNode;
  /** Override size for all avatars in the group. */
  size?: AvatarProps['size'];
  /** Override shape for all avatars in the group. */
  shape?: AvatarProps['shape'];
  /** Max visible avatars before showing overflow counter. */
  max?: AvatarGroupMaxConfig;
  className?: string;
  style?: React.CSSProperties;
}

const OVERLAP = -8;
const OVERLAP_LG = -10;

function getOverlap(size?: AvatarProps['size']): number {
  if (size === 'large') return OVERLAP_LG;
  return OVERLAP;
}

/**
 * Extracts the innermost Avatar element from any wrapper (e.g. Tooltip).
 * Used when building tooltip content so size/shape reach the actual Avatar.
 */
function extractAvatar(
  child: React.ReactNode,
  size?: AvatarProps['size'],
  shape?: AvatarProps['shape']
): React.ReactNode {
  if (!React.isValidElement(child)) return child;

  const isAvatar = (child.type as { displayName?: string })?.displayName === 'Avatar';
  if (isAvatar) {
    return React.cloneElement(child as React.ReactElement<AvatarProps>, {
      ...(size !== undefined ? { size } : {}),
      ...(shape !== undefined ? { shape } : {}),
    });
  }

  // Tooltip or other wrapper — dig into its children
  const inner = (child.props as { children?: React.ReactNode }).children;
  if (inner) return extractAvatar(inner, size, shape);

  return child;
}

// Clone an avatar-like element injecting size, shape and overlap margin
function cloneItem(
  child: React.ReactNode,
  index: number,
  size?: AvatarProps['size'],
  shape?: AvatarProps['shape']
): React.ReactNode {
  if (!React.isValidElement(child)) return child;

  const overlapStyle: React.CSSProperties =
    index > 0 ? { marginInlineStart: getOverlap(size) } : {};

  const extraProps: Record<string, unknown> = { key: index };
  if (size !== undefined) extraProps.size = size;
  if (shape !== undefined) extraProps.shape = shape;

  // If this child is a Tooltip wrapper, we need to pass overlap to it via style on a wrapper
  // Detect Tooltip by checking displayName (rc-tooltip wraps without adding DOM nodes)
  // The safest approach: wrap in a span only for overlap when the child is not a plain Avatar
  const isAvatar = (child.type as { displayName?: string })?.displayName === 'Avatar';

  if (isAvatar) {
    const currentStyle = (child.props as AvatarProps).style || {};
    return React.cloneElement(child as React.ReactElement<AvatarProps>, {
      ...extraProps,
      style: { ...currentStyle, ...overlapStyle },
    });
  }

  // For Tooltip-wrapped avatars: inject overlap + size/shape into the inner Avatar
  const innerChild = (child.props as { children?: React.ReactNode }).children;
  if (React.isValidElement(innerChild)) {
    const innerStyle = (innerChild.props as AvatarProps).style || {};
    const clonedInner = React.cloneElement(innerChild as React.ReactElement<AvatarProps>, {
      ...(size !== undefined ? { size } : {}),
      ...(shape !== undefined ? { shape } : {}),
      style: { ...innerStyle, ...overlapStyle },
    });
    return React.cloneElement(child as React.ReactElement<{ children?: React.ReactNode }>, {
      key: index,
      children: clonedInner,
    });
  }

  // Fallback: wrap in a span to apply overlap margin
  return (
    <span key={index} style={{ display: 'inline-flex', ...overlapStyle }}>
      {React.cloneElement(child as React.ReactElement, extraProps)}
    </span>
  );
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  size,
  shape,
  max,
  className,
  style,
}) => {
  const prefixCls = usePrefixCls('avatar');
  const groupCls = classNames(`${prefixCls}-group`, className);
  const childrenArray = React.Children.toArray(children);

  let visibleChildren: React.ReactNode[];
  let overflowNode: React.ReactNode = null;

  if (max && childrenArray.length > max.count) {
    const visible = childrenArray.slice(0, max.count);
    const hidden = childrenArray.slice(max.count);

    visibleChildren = visible.map((child, i) => cloneItem(child, i, size, shape));

    const counterAvatar = (
      <Avatar
        size={size}
        shape={shape}
        style={{
          backgroundColor: '#ccc',
          color: '#555',
          cursor: max.popover ? 'pointer' : 'default',
          marginInlineStart: getOverlap(size),
          ...max.style,
        }}
      >
        +{hidden.length}
      </Avatar>
    );

    const trigger = max.popover?.trigger ?? 'hover';
    // Use extractAvatar so size reaches the actual <Avatar> even when
    // wrapped in <Tooltip> or other elements
    const tooltipSize: AvatarProps['size'] = size === 'large' ? 'default' : 'small';
    const overflowContent = (
      <div style={{ display: 'flex', gap: 6, padding: '2px 0' }}>
        {hidden.map((child, i) => (
          <React.Fragment key={i}>{extractAvatar(child, tooltipSize, shape)}</React.Fragment>
        ))}
      </div>
    );

    overflowNode = (
      <Tooltip title={overflowContent} trigger={[trigger]} placement="top">
        {counterAvatar}
      </Tooltip>
    );
  } else {
    visibleChildren = childrenArray.map((child, i) => cloneItem(child, i, size, shape));
  }

  return (
    <div className={groupCls} style={style}>
      {visibleChildren}
      {overflowNode}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
