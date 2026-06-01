import { CommonTheme, GlobalThemeOverrides, ResolvedTheme, SurfaceTheme } from './interface';
import { defaultCommonTheme } from './base';

/**
 * Converts a camelCase string to kebab-case
 */
const toKebabCase = (str: string) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

const createSurfaceTheme = (
  common: CommonTheme,
  overrides?: Partial<SurfaceTheme>
): SurfaceTheme => ({
  colorBg: common.bgColorContainer,
  colorBgElevated: common.bgColorElevated,
  colorText: common.textColor,
  colorTextSecondary: common.textColorSecondary,
  colorTextHeading: common.textColorHeading,
  colorBorder: common.borderColor,
  colorBorderSecondary: common.borderColorSecondary,
  colorFillTertiary: common.fillColorTertiary,
  colorFillQuaternary: common.fillColorQuaternary,
  colorPrimary: common.primaryColor,
  colorPrimaryHover: common.primaryColorHover,
  colorError: common.errorColor,
  borderRadius: common.borderRadius,
  shadow: common.shadowSM,
  padding: common.paddingInlineMD,
  fontSize: common.fontSize,
  ...overrides,
});

/**
 * Merges user overrides with the base theme and resolves aliases
 */
export const resolveTheme = (overrides?: GlobalThemeOverrides): ResolvedTheme => {
  const common = { ...defaultCommonTheme, ...overrides?.common };

  // Auto-derive states if primaryColor is overridden but states are not
  if (overrides?.common?.primaryColor && !overrides?.common?.primaryColorHover) {
    common.primaryColorHover = `color-mix(in srgb, ${common.primaryColor} 85%, white)`;
  }
  if (overrides?.common?.primaryColor && !overrides?.common?.primaryColorActive) {
    common.primaryColorActive = `color-mix(in srgb, ${common.primaryColor} 85%, black)`;
  }
  if (overrides?.common?.primaryColor && !overrides?.common?.primaryColorOutline) {
    common.primaryColorOutline = `color-mix(in srgb, ${common.primaryColor} 15%, transparent)`;
  }
  if (overrides?.common?.primaryColor && !overrides?.common?.primaryColorOpacity10) {
    common.primaryColorOpacity10 = `color-mix(in srgb, ${common.primaryColor} 10%, transparent)`;
  }
  if (overrides?.common?.primaryColor && !overrides?.common?.primaryColorOpacity12) {
    common.primaryColorOpacity12 = `color-mix(in srgb, ${common.primaryColor} 12%, transparent)`;
  }

  // Auto-derive error states
  if (overrides?.common?.errorColor && !overrides?.common?.errorColorHover) {
    common.errorColorHover = `color-mix(in srgb, ${common.errorColor} 85%, white)`;
  }
  if (!overrides?.common?.waveColor) {
    common.waveColor = common.primaryColor;
  }
  if (!overrides?.common?.textColorHeading) {
    common.textColorHeading = common.textColor;
  }

  const Alert = createSurfaceTheme(common, overrides?.Alert);
  const Avatar = createSurfaceTheme(common, overrides?.Avatar);
  const Badge = createSurfaceTheme(common, {
    colorBg: common.primaryColor,
    colorText: '#ffffff',
    ...overrides?.Badge,
  });
  const Breadcrumb = createSurfaceTheme(common, overrides?.Breadcrumb);
  const Card = createSurfaceTheme(common, {
    borderRadius: common.borderRadiusCard,
    shadow: common.shadowSM,
    ...overrides?.Card,
  });
  // For Button
  const Button = {
    colorPrimary: overrides?.Button?.colorPrimary || common.primaryColor,
    colorPrimaryHover: overrides?.Button?.colorPrimaryHover || common.primaryColorHover,
    colorPrimaryActive: overrides?.Button?.colorPrimaryActive || common.primaryColorActive,
    colorText: overrides?.Button?.colorText || common.textColor,
    colorTextLight: overrides?.Button?.colorTextLight || '#ffffff',
    borderRadius: overrides?.Button?.borderRadius || common.borderRadius,
    fontWeight: overrides?.Button?.fontWeight || 500,
    ...overrides?.Button,
  };

  // For Checkbox
  const Checkbox = {
    colorChecked: overrides?.Checkbox?.colorChecked || common.primaryColor,
    borderColor: overrides?.Checkbox?.borderColor || common.borderColor,
    borderRadius: overrides?.Checkbox?.borderRadius || common.borderRadiusSM,
    size: overrides?.Checkbox?.size || '16px',
    checkColor: overrides?.Checkbox?.checkColor || '#ffffff',
    ...overrides?.Checkbox,
  };

  const Radio = {
    ...Checkbox,
    borderRadius: '50%',
    ...overrides?.Radio,
  };

  // For Input
  const Input = {
    colorBg: overrides?.Input?.colorBg || common.bgColorContainer,
    colorBorder: overrides?.Input?.colorBorder || common.borderColor,
    colorText: overrides?.Input?.colorText || common.textColor,
    colorPlaceholder: overrides?.Input?.colorPlaceholder || common.textColorQuaternary,
    borderRadius: overrides?.Input?.borderRadius || common.borderRadius,
    hoverBorderColor: overrides?.Input?.hoverBorderColor || common.primaryColorHover,
    activeBorderColor: overrides?.Input?.activeBorderColor || common.primaryColor,
    activeShadow: overrides?.Input?.activeShadow || `0 0 0 2px ${common.primaryColorOutline}`,
    ...overrides?.Input,
  };

  // For Select
  const Select = {
    colorBg: overrides?.Select?.colorBg || common.bgColorContainer,
    colorBorder: overrides?.Select?.colorBorder || common.borderColor,
    borderRadius: overrides?.Select?.borderRadius || common.borderRadius,
    optionSelectedBg:
      overrides?.Select?.optionSelectedBg ||
      `color-mix(in srgb, ${common.primaryColor} 10%, transparent)`,
    optionHoverBg: overrides?.Select?.optionHoverBg || common.borderColorSecondary,
    ...overrides?.Select,
  };

  // For Switch
  const Switch = {
    colorActive: overrides?.Switch?.colorActive || common.primaryColor,
    colorInactive: overrides?.Switch?.colorInactive || common.textColorQuaternary,
    handleColor: overrides?.Switch?.handleColor || '#ffffff',
    size: overrides?.Switch?.size || '32px',
    ...overrides?.Switch,
  };

  // For Modal
  const Modal = {
    colorBg: overrides?.Modal?.colorBg || common.bgColorElevated,
    headerBg: overrides?.Modal?.headerBg || common.bgColorElevated,
    footerBg: overrides?.Modal?.footerBg || common.bgColorElevated,
    borderRadius: overrides?.Modal?.borderRadius || common.borderRadiusLG,
    shadow: overrides?.Modal?.shadow || common.shadowXL,
    ...overrides?.Modal,
  };

  // For Drawer
  const Drawer = {
    colorBg: overrides?.Drawer?.colorBg || common.bgColorElevated,
    borderRadius: overrides?.Drawer?.borderRadius || '0px',
    ...overrides?.Drawer,
  };

  const Dropdown = createSurfaceTheme(common, {
    colorBgElevated: common.bgColorElevated,
    shadow: common.shadowPopup,
    borderRadius: common.borderRadiusCard,
    ...overrides?.Dropdown,
  });
  const Empty = createSurfaceTheme(common, overrides?.Empty);
  const Form = createSurfaceTheme(common, overrides?.Form);
  const Grid = createSurfaceTheme(common, overrides?.Grid);

  // For Menu
  const Menu = {
    colorItemBg: overrides?.Menu?.colorItemBg || 'transparent',
    colorItemText: overrides?.Menu?.colorItemText || common.textColor,
    colorItemTextSelected: overrides?.Menu?.colorItemTextSelected || common.primaryColor,
    colorItemBgSelected:
      overrides?.Menu?.colorItemBgSelected ||
      `color-mix(in srgb, ${common.primaryColor} 10%, transparent)`,
    colorItemBgHover: overrides?.Menu?.colorItemBgHover || common.borderColorSecondary,
    ...overrides?.Menu,
  };

  // For DatePicker
  const DatePicker = {
    colorBg: overrides?.DatePicker?.colorBg || common.bgColorContainer,
    colorBorder: overrides?.DatePicker?.colorBorder || common.borderColor,
    cellHoverBg: overrides?.DatePicker?.cellHoverBg || common.borderColorSecondary,
    cellSelectedBg: overrides?.DatePicker?.cellSelectedBg || common.primaryColor,
    width: overrides?.DatePicker?.width || '160px',
    rangeWidth: overrides?.DatePicker?.rangeWidth || '320px',
    ...overrides?.DatePicker,
  };

  const Divider = {
    ...createSurfaceTheme(common),
    orientationMargin: '5%',
    textPaddingInline: '1em',
    verticalMarginInline: '8px',
    ...overrides?.Divider,
  };

  const InputNumber = {
    ...Input,
    ...overrides?.InputNumber,
  };

  const InputOTP = {
    ...Input,
    ...overrides?.InputOTP,
  };

  const Layout = {
    ...createSurfaceTheme(common),
    headerBg: common.bgColorContainer,
    headerHeight: '56px',
    siderBg: common.bgColorContainer,
    siderWidth: '260px',
    siderCollapsedWidth: '72px',
    siderActiveBg: `color-mix(in srgb, ${common.primaryColor} 10%, transparent)`,
    siderActiveColor: common.primaryColor,
    ...overrides?.Layout,
  };

  const Notification = createSurfaceTheme(common, {
    colorBgElevated: common.bgColorElevated,
    shadow: common.shadowPopup,
    ...overrides?.Notification,
  });
  const Pagination = createSurfaceTheme(common, overrides?.Pagination);
  const Progress = createSurfaceTheme(common, overrides?.Progress);
  const Rate = createSurfaceTheme(common, {
    colorPrimary: common.warningColor,
    ...overrides?.Rate,
  });
  const Result = createSurfaceTheme(common, overrides?.Result);
  const Skeleton = createSurfaceTheme(common, {
    colorFillTertiary: common.fillColorTertiary,
    colorFillQuaternary: common.fillColorQuaternary,
    ...overrides?.Skeleton,
  });
  const Slider = createSurfaceTheme(common, {
    colorPrimary: common.primaryColor,
    colorPrimaryHover: common.primaryColorHover,
    ...overrides?.Slider,
  });
  const Space = createSurfaceTheme(common, overrides?.Space);
  const Steps = createSurfaceTheme(common, overrides?.Steps);

  // For Table
  const Table = {
    headerBg: overrides?.Table?.headerBg || common.bgColorLayout,
    headerColor: overrides?.Table?.headerColor || common.textColor,
    headerSortHoverBg: overrides?.Table?.headerSortHoverBg || common.borderColorSecondary,
    headerSortActiveBg: overrides?.Table?.headerSortActiveBg || common.borderColor,
    colorBg: overrides?.Table?.colorBg || common.bgColorContainer,
    colorRowHover: overrides?.Table?.colorRowHover || common.bgColorLayout,
    // colorFixedHover: solid opaque hover for sticky columns — must cover content scrolling behind them
    colorFixedHover: overrides?.Table?.colorFixedHover || common.bgColorLayout,
    colorBorder: overrides?.Table?.colorBorder || common.borderColorSecondary,
    padding: overrides?.Table?.padding || '16px 16px',
    fontSize: overrides?.Table?.fontSize || common.fontSize,
    ...overrides?.Table,
  };

  const Tabs = createSurfaceTheme(common, {
    colorPrimary: common.primaryColor,
    colorPrimaryHover: common.primaryColorHover,
    ...overrides?.Tabs,
  });
  const Tag = createSurfaceTheme(common, {
    colorBg: common.bgColorLayout,
    borderRadius: common.borderRadiusSM,
    ...overrides?.Tag,
  });
  const Timeline = createSurfaceTheme(common, overrides?.Timeline);
  const Tooltip = {
    ...createSurfaceTheme(common),
    bg: common.bgColorSpotlight,
    color: '#ffffff',
    borderRadius: common.borderRadius,
    shadow: common.shadowPopup,
    fontSize: common.fontSizeSM,
    arrowWidth: '8px',
    arrowHeight: '8px',
    ...overrides?.Tooltip,
  };
  const Upload = createSurfaceTheme(common, overrides?.Upload);
  const Wave = createSurfaceTheme(common, {
    colorPrimary: common.waveColor,
    ...overrides?.Wave,
  });

  // For Typography
  const Typography = {
    colorText: overrides?.Typography?.colorText || common.textColor,
    colorTextDescription: overrides?.Typography?.colorTextDescription || common.textColorSecondary,
    colorLink: overrides?.Typography?.colorLink || common.primaryColor,
    colorLinkHover: overrides?.Typography?.colorLinkHover || common.primaryColorHover,
    ...overrides?.Typography,
  };

  return {
    common,
    Alert,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Input,
    InputNumber,
    InputOTP,
    Select,
    Switch,
    Modal,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Grid,
    Menu,
    DatePicker,
    Divider,
    Layout,
    Notification,
    Pagination,
    Progress,
    Radio,
    Rate,
    Result,
    Skeleton,
    Slider,
    Space,
    Steps,
    Table,
    Tabs,
    Tag,
    Timeline,
    Tooltip,
    Typography,
    Upload,
    Wave,
  };
};

/**
 * Flattens the theme object into a record of CSS variables
 * Example: common.primaryColor -> --{prefix}-primary-color
 * Example: Checkbox.colorChecked -> --{prefix}-checkbox-color-checked
 */
export const flattenThemeToCssVars = (
  theme: ResolvedTheme,
  prefix = 'fi'
): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Flatten common
  Object.entries(theme.common).forEach(([key, value]) => {
    cssVars[`--${prefix}-${toKebabCase(key)}`] = value;
  });

  // Flatten components
  Object.entries(theme).forEach(([compName, compTokens]) => {
    if (compName === 'common') return;

    Object.entries(compTokens).forEach(([key, value]) => {
      if (value !== undefined) {
        cssVars[`--${prefix}-${toKebabCase(compName)}-${toKebabCase(key)}`] = String(value);
      }
    });
  });

  cssVars[`--${prefix}-color-text-heading`] = String(theme.common.textColorHeading);
  cssVars[`--${prefix}-color-fill-tertiary`] = String(theme.common.fillColorTertiary);
  cssVars[`--${prefix}-color-fill-quaternary`] = String(theme.common.fillColorQuaternary);
  cssVars[`--${prefix}-color-error`] = String(theme.common.errorColor);
  cssVars[`--${prefix}-primary-color-opacity-10`] = String(theme.common.primaryColorOpacity10);
  cssVars[`--${prefix}-primary-color-opacity-12`] = String(theme.common.primaryColorOpacity12);
  cssVars[`--${prefix}-control-height-sm`] = String(theme.common.controlHeightSM);
  cssVars[`--${prefix}-control-height-md`] = String(theme.common.controlHeightMD);
  cssVars[`--${prefix}-control-height-lg`] = String(theme.common.controlHeightLG);
  cssVars[`--${prefix}-padding-inline-sm`] = String(theme.common.paddingInlineSM);
  cssVars[`--${prefix}-padding-inline-md`] = String(theme.common.paddingInlineMD);
  cssVars[`--${prefix}-padding-inline-lg`] = String(theme.common.paddingInlineLG);
  cssVars[`--${prefix}-wave-color`] = String(theme.common.waveColor);
  cssVars[`--${prefix}-wave-opacity`] = String(theme.common.waveOpacity);
  cssVars[`--${prefix}-wave-spread`] = String(theme.common.waveSpread);
  cssVars[`--${prefix}-wave-duration`] = String(theme.common.waveDuration);
  cssVars[`--${prefix}-z-index-header`] = String(theme.common.zIndexHeader);
  cssVars[`--${prefix}-z-index-sider`] = String(theme.common.zIndexSider);

  return cssVars;
};
