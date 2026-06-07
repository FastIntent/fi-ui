/**
 * Common theme tokens shared across multiple components
 */
export interface CommonTheme {
  primaryColor: string;
  primaryColorHover: string;
  primaryColorActive: string;
  primaryColorOutline: string;

  successColor: string;
  warningColor: string;
  warningColorOutline: string;
  errorColor: string;
  errorColorHover: string;
  errorColorActive: string;
  errorColorOutline: string;
  infoColor: string;
  primaryColorOpacity10: string;
  primaryColorOpacity12: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  fontSizeSM: string;
  fontSizeMD: string;
  fontSizeLG: string;
  lineHeight: string;

  // Borders
  borderRadius: string;
  borderRadiusSM: string;
  borderRadiusLG: string;
  borderRadiusCard: string;

  // Colors
  textColor: string;
  textColorSecondary: string;
  textColorTertiary: string;
  textColorQuaternary: string;
  textColorHeading: string;

  borderColor: string;
  borderColorSecondary: string;

  // Backgrounds
  bgColorLayout: string;
  bgColorContainer: string;
  bgColorElevated: string;
  bgColorSpotlight: string;
  bgColorMask: string;
  fillColorTertiary: string;
  fillColorQuaternary: string;

  // Shadows
  shadowSM: string;
  shadowMD: string;
  shadowLG: string;
  shadowXL: string;
  shadowPopup: string;

  // Transitions
  transitionFast: string;
  transitionBase: string;
  transitionSlow: string;
  transitionBounce: string;

  // Motion and density
  motionDurationFast: string;
  motionDurationBase: string;
  motionDurationSlow: string;
  motionEaseInOut: string;
  motionEaseOut: string;
  density: 'compact' | 'comfortable' | 'spacious';
  controlHeightSM: string;
  controlHeightMD: string;
  controlHeightLG: string;
  paddingInlineSM: string;
  paddingInlineMD: string;
  paddingInlineLG: string;
  zIndexBase: string | number;
  zIndexDropdown: string | number;
  zIndexModal: string | number;
  zIndexDrawer: string | number;
  zIndexHeader: string | number;
  zIndexSider: string | number;
  waveColor: string;
  waveOpacity: string | number;
  waveSpread: string;
  waveDuration: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Component-specific tokens
 */
export interface SurfaceTheme {
  colorBg?: string;
  colorBgElevated?: string;
  colorText?: string;
  colorTextSecondary?: string;
  colorTextHeading?: string;
  colorBorder?: string;
  colorBorderSecondary?: string;
  colorFillTertiary?: string;
  colorFillQuaternary?: string;
  colorPrimary?: string;
  colorPrimaryHover?: string;
  colorError?: string;
  borderRadius?: string;
  shadow?: string;
  padding?: string | number;
  margin?: string | number;
  fontSize?: string | number;
}

export interface CheckboxTheme {
  colorChecked?: string;
  borderColor?: string;
  borderRadius?: string;
  size?: string;
  checkColor?: string;
}

export interface ButtonTheme {
  colorPrimary?: string;
  colorPrimaryHover?: string;
  colorPrimaryActive?: string;
  colorText?: string;
  colorTextLight?: string;
  borderRadius?: string;
  fontWeight?: string | number;
}

export interface InputTheme {
  colorBg?: string;
  colorBorder?: string;
  colorText?: string;
  colorPlaceholder?: string;
  borderRadius?: string;
  hoverBorderColor?: string;
  activeBorderColor?: string;
  activeShadow?: string;
}

export interface SelectTheme {
  colorBg?: string;
  colorBorder?: string;
  borderRadius?: string;
  optionSelectedBg?: string;
  optionHoverBg?: string;
}

export interface SwitchTheme {
  colorActive?: string;
  colorInactive?: string;
  handleColor?: string;
  size?: string;
}

export interface ModalTheme {
  colorBg?: string;
  headerBg?: string;
  footerBg?: string;
  borderRadius?: string;
  shadow?: string;
}

export interface DrawerTheme {
  colorBg?: string;
  borderRadius?: string;
}

export interface MenuTheme {
  colorItemBg?: string;
  colorItemText?: string;
  colorItemTextSelected?: string;
  colorItemBgSelected?: string;
  colorItemBgHover?: string;
}

export interface DatePickerTheme {
  colorBg?: string;
  colorBorder?: string;
  cellHoverBg?: string;
  cellSelectedBg?: string;
  width?: string | number;
  rangeWidth?: string | number;
}

export interface TableTheme {
  headerBg?: string;
  headerColor?: string;
  headerSortHoverBg?: string;
  headerSortActiveBg?: string;
  colorBg?: string;
  colorRowHover?: string;
  /** Opaque hover background for sticky/fixed columns — must cover scrolling content behind them. */
  colorFixedHover?: string;
  colorBorder?: string;
  padding?: string | number;
  fontSize?: string | number;
}

export interface TypographyTheme {
  colorText?: string;
  colorTextDescription?: string;
  colorLink?: string;
  colorLinkHover?: string;
}

export interface DividerTheme extends SurfaceTheme {
  orientationMargin?: string | number;
  textPaddingInline?: string | number;
  verticalMarginInline?: string | number;
}

export interface LayoutTheme extends SurfaceTheme {
  headerBg?: string;
  headerHeight?: string | number;
  siderBg?: string;
  siderWidth?: string | number;
  siderCollapsedWidth?: string | number;
  siderActiveBg?: string;
  siderActiveColor?: string;
}

export interface TooltipTheme extends SurfaceTheme {
  bg?: string;
  color?: string;
  arrowWidth?: string | number;
  arrowHeight?: string | number;
}

export interface ComponentThemeMap {
  Alert: SurfaceTheme;
  Avatar: SurfaceTheme;
  Badge: SurfaceTheme;
  Breadcrumb: SurfaceTheme;
  Button: ButtonTheme;
  Card: SurfaceTheme;
  Checkbox: CheckboxTheme;
  DatePicker: DatePickerTheme;
  Divider: DividerTheme;
  Drawer: DrawerTheme;
  Dropdown: SurfaceTheme;
  Empty: SurfaceTheme;
  Form: SurfaceTheme;
  Grid: SurfaceTheme;
  Input: InputTheme;
  InputNumber: InputTheme;
  InputOTP: InputTheme;
  Layout: LayoutTheme;
  Menu: MenuTheme;
  Modal: ModalTheme;
  Notification: SurfaceTheme;
  Pagination: SurfaceTheme;
  Progress: SurfaceTheme;
  Radio: CheckboxTheme;
  Rate: SurfaceTheme;
  Result: SurfaceTheme;
  Select: SelectTheme;
  Skeleton: SurfaceTheme;
  Slider: SurfaceTheme;
  Space: SurfaceTheme;
  Steps: SurfaceTheme;
  Switch: SwitchTheme;
  Table: TableTheme;
  Tabs: SurfaceTheme;
  Tag: SurfaceTheme;
  Timeline: SurfaceTheme;
  Tooltip: TooltipTheme;
  Typography: TypographyTheme;
  Upload: SurfaceTheme;
  Wave: SurfaceTheme;
}

/**
 * Global Theme Overrides structure (Naive UI inspired)
 */
export interface GlobalThemeOverrides extends Partial<{
  [K in keyof ComponentThemeMap]: Partial<ComponentThemeMap[K]>;
}> {
  common?: Partial<CommonTheme>;
}

/**
 * The full resolved theme
 */
export interface ResolvedTheme extends ComponentThemeMap {
  common: CommonTheme;
}
