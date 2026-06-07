import React from 'react';
import RcDropdown, { DropdownProps as RcDropdownProps } from '@rc-component/dropdown';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

/**
 * Propiedades del componente Dropdown.
 * Muestra una lista flotante de opciones cuando el usuario interactúa (hover o clic) con el elemento hijo.
 *
 * Este componente es una envoltura de `@rc-component/dropdown` y acepta todas sus propiedades,
 * como `trigger` (`['click']`, `['hover']`), `placement` (`bottomLeft`, `topRight`, etc.),
 * y `overlay` (que usualmente será un componente `<Menu>`).
 */
export interface DropdownProps extends RcDropdownProps {
  /** Controls the visible state of the dropdown. */
  open?: boolean;
  /** Disables the dropdown — trigger events are ignored and the popup never opens. */
  disabled?: boolean;
}

/**
 * Dropdown component providing a floating list of options.
 * It's autonomous and uses design tokens for consistent elevation and styling.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  children,
  overlay,
  prefixCls: customPrefixCls,
  transitionName,
  disabled,
  ...props
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('dropdown', customPrefixCls) || getDefaultPrefixCls('dropdown');
  const mergedTransitionName = transitionName || `${prefixCls}-slide-up`;
  // Standard rc-dropdown behavior handles auto-close on Menu items.
  // We keep it simple to ensure full compatibility with rc-menu's internal logic.
  return (
    <RcDropdown
      prefixCls={prefixCls}
      overlay={overlay}
      transitionName={mergedTransitionName}
      // When disabled, force the popup to never open by making trigger an empty array
      trigger={disabled ? [] : props.trigger}
      {...props}
    >
      {children}
    </RcDropdown>
  );
};

Dropdown.displayName = 'Dropdown';
