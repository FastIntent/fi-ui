export const DEFAULT_PREFIX = 'atom';

export const getDefaultPrefixCls = (suffixCls?: string) =>
  suffixCls ? `${DEFAULT_PREFIX}-${suffixCls}` : DEFAULT_PREFIX;

export type CssVarValue = string | number | undefined;

export const getCssVarName = (token: string, prefix = DEFAULT_PREFIX) => `--${prefix}-${token}`;

export const getPrefixedCssVarStyle = (
  vars: Record<string, CssVarValue>,
  prefix = DEFAULT_PREFIX
): Record<string, string | number> => {
  const style: Record<string, string | number> = {};

  Object.entries(vars).forEach(([token, value]) => {
    if (value === undefined) return;

    style[getCssVarName(token, DEFAULT_PREFIX)] = value;
    if (prefix !== DEFAULT_PREFIX) {
      style[getCssVarName(token, prefix)] = value;
    }
  });

  return style;
};
