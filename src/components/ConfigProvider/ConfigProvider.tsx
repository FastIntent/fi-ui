import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { GlobalThemeOverrides, ResolvedTheme } from './theme/interface';
import { resolveTheme, flattenThemeToCssVars } from './theme/utils';
import { FastUILocale } from '../locale/interface';
import defaultLocale from '../locale/en_US';
import { DEFAULT_PREFIX, getDefaultPrefixCls } from './prefix';

export type ConfigSize = 'small' | 'middle' | 'large';

export interface ConfigContextValue {
  size?: ConfigSize;
  theme?: ResolvedTheme;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  locale?: FastUILocale;
  prefixCls?: string;
  getPrefixCls?: (suffixCls?: string, customPrefixCls?: string) => string;
  dayjsLocaleId?: string;
}

const ConfigContext = createContext<ConfigContextValue>({
  size: 'middle',
  locale: defaultLocale,
  prefixCls: DEFAULT_PREFIX,
  getPrefixCls: (suffixCls?: string, customPrefixCls?: string) =>
    customPrefixCls || (suffixCls ? `${DEFAULT_PREFIX}-${suffixCls}` : DEFAULT_PREFIX),
});

const PREFIX_ALIAS_ATTR = `data-${DEFAULT_PREFIX}-prefix-alias`;

const getAliasedClassName = (className: string, prefixCls: string) => {
  if (!className.startsWith(`${DEFAULT_PREFIX}-`)) return null;
  return `${prefixCls}${className.slice(DEFAULT_PREFIX.length)}`;
};

const getBaseClassName = (className: string, prefixCls: string) => {
  if (!className.startsWith(`${prefixCls}-`)) return null;
  return `${DEFAULT_PREFIX}${className.slice(prefixCls.length)}`;
};

const syncPrefixAliases = (root: HTMLElement, prefixCls: string) => {
  const elements = [
    root,
    ...Array.from(
      root.querySelectorAll<HTMLElement>(`[class*="${DEFAULT_PREFIX}-"], [class*="${prefixCls}-"]`)
    ),
  ];

  elements.forEach((element) => {
    const previousAliases = element.getAttribute(PREFIX_ALIAS_ATTR);

    if (previousAliases) {
      for (const className of previousAliases.split(' ')) {
        if (className) element.classList.remove(className);
      }
      element.removeAttribute(PREFIX_ALIAS_ATTR);
    }

    if (prefixCls === DEFAULT_PREFIX) return;

    const aliases: string[] = [];
    for (const className of element.classList) {
      const alias = getAliasedClassName(className, prefixCls);
      const baseClassName = getBaseClassName(className, prefixCls);
      if (alias && !element.classList.contains(alias)) aliases.push(alias);
      if (baseClassName && !element.classList.contains(baseClassName)) aliases.push(baseClassName);
    }

    if (aliases.length === 0) return;

    element.classList.add(...aliases);
    element.setAttribute(PREFIX_ALIAS_ATTR, aliases.join(' '));
  });
};

/**
 * Propiedades del componente ConfigProvider.
 * Este componente es un wrapper global que debe envolver toda la aplicación.
 * Proporciona el sistema central de configuración de diseño, permitiendo inyectar un tema
 * personalizado que transformará los colores, radios, bordes y tipografías de todos los componentes.
 */
export interface ConfigProviderProps {
  /**
   * El tamaño base global que heredarán todos los componentes de formulario (Inputs, Botones, Selects, etc.)
   * si no se les asigna un `size` específico localmente.
   * @default 'middle'
   */
  size?: ConfigSize;

  /**
   * Objeto con los tokens de diseño. Al pasarlo, ConfigProvider convertirá este objeto
   * en variables CSS dinámicas que toda la librería escuchará automáticamente.
   * (Ej. colores primarios, redondeo de bordes, etc.)
   */
  theme?: GlobalThemeOverrides;

  /**
   * Los componentes hijos o la jerarquía completa de la App (ej. `<App />`).
   */
  children?: ReactNode;

  /**
   * Prefijo CSS global (Variable `--{prefix}-*` y clases HTML).
   * No modificar a menos que exista un conflicto estricto con el CSS de otra librería.
   * @default 'fi'
   */
  prefixCls?: string;

  /**
   * Diccionario de idiomas para internacionalizar los componentes (i18n).
   * @default en_US
   */
  locale?: FastUILocale;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  size,
  theme: themeOverrides,
  prefixCls = DEFAULT_PREFIX,
  locale,
}) => {
  const parentConfig = useContext(ConfigContext);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Map locale identifier (e.g. 'es_ES' → 'es') for dayjs
  const dayjsLocaleId = useMemo(() => {
    const lang = locale?.locale || parentConfig.locale?.locale || 'en';
    return lang.split(/[-_]/)[0].toLowerCase();
  }, [locale, parentConfig.locale]);

  // Resolve theme combining parent theme if needed (simplified for now)
  const resolvedTheme = useMemo(() => resolveTheme(themeOverrides), [themeOverrides]);
  const getPrefixCls = useMemo(
    () => (suffixCls?: string, customPrefixCls?: string) =>
      customPrefixCls || (suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls),
    [prefixCls]
  );

  const mergedConfig = useMemo(
    () => ({
      ...parentConfig,
      size: size || parentConfig.size,
      theme: resolvedTheme,
      getPopupContainer:
        parentConfig.getPopupContainer || (() => containerRef.current || document.body),
      locale: locale || parentConfig.locale || defaultLocale,
      prefixCls,
      getPrefixCls,
      dayjsLocaleId,
    }),
    [parentConfig, size, resolvedTheme, locale, prefixCls, getPrefixCls, dayjsLocaleId]
  );

  const cssVars = useMemo(
    () => ({
      ...flattenThemeToCssVars(resolvedTheme, DEFAULT_PREFIX),
      ...(prefixCls === DEFAULT_PREFIX ? {} : flattenThemeToCssVars(resolvedTheme, prefixCls)),
      [`--${DEFAULT_PREFIX}-prefix`]: prefixCls,
    }),
    [resolvedTheme, prefixCls]
  );

  const baseProviderCls = getDefaultPrefixCls('config-provider');
  const providerCls =
    prefixCls === DEFAULT_PREFIX
      ? baseProviderCls
      : `${baseProviderCls} ${prefixCls}-config-provider`;

  // Apply theme CSS vars to document.documentElement so portalled popups
  // (Select dropdown, Dropdown, DatePicker, etc.) inherit the active theme.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const el = document.documentElement;
    const entries = Object.entries(cssVars) as [string, string][];
    entries.forEach(([key, value]) => el.style.setProperty(key, value));
    return () => {
      entries.forEach(([key]) => el.style.removeProperty(key));
    };
  }, [cssVars]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    syncPrefixAliases(root, prefixCls);

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.every(
          (mutation) =>
            mutation.type === 'attributes' && mutation.attributeName === PREFIX_ALIAS_ATTR
        )
      ) {
        return;
      }

      syncPrefixAliases(root, prefixCls);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', PREFIX_ALIAS_ATTR],
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [prefixCls]);

  return (
    <ConfigContext.Provider value={mergedConfig}>
      <div
        ref={containerRef}
        className={providerCls}
        dir={resolvedTheme.common.direction}
        data-density={resolvedTheme.common.density}
        style={cssVars as React.CSSProperties}
      >
        {children}
      </div>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

export const usePrefixCls = (suffixCls?: string, customPrefixCls?: string) => {
  const { getPrefixCls } = useConfig();
  return getPrefixCls?.(suffixCls, customPrefixCls) || getDefaultPrefixCls(suffixCls);
};

// Removed redundant export default

ConfigProvider.displayName = 'ConfigProvider';
