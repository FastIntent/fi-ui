export { Menu, SubMenu, MenuItem } from './Menu';
// Pure pass-throughs live here (not in Menu.tsx) so internal consumers of the
// Menu implementation don't carry unused rc-component bindings in the CJS build.
export { MenuItemGroup as ItemGroup, Divider } from '@rc-component/menu';
export type { MenuProps, MenuItemProps, SubMenuProps } from './Menu';
import './Menu.scss';
