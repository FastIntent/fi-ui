import React, { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { Popover, type PopoverPlacement } from '../Popover';
import { CloseCircleOutlined } from '../_icons';
import { Wave } from '../Wave/Wave';
import { ColorPanel } from './ColorPanel';
import { HSV, hexToHsv, hsvToHex } from './color-utils';

export type ColorPickerSize = 'large' | 'middle' | 'small';

export interface ColorPickerPreset {
  label: string;
  colors: string[];
}

export interface ColorPickerProps {
  /** Hex color value ("#rrggbb" or "#rrggbbaa"). */
  value?: string;
  /** Default color when uncontrolled. */
  defaultValue?: string;
  /** Fires on every color interaction. */
  onChange?: (hex: string) => void;
  /** Fires when interaction ends (mouseup / blur). */
  onChangeComplete?: (hex: string) => void;
  /** Disable the picker. */
  disabled?: boolean;
  /** Show a clear button. */
  allowClear?: boolean;
  /** Hide the alpha slider. */
  disabledAlpha?: boolean;
  /** Preset color groups. */
  presets?: ColorPickerPreset[];
  /** Trigger size. */
  size?: ColorPickerSize;
  /** Controlled popup visibility. */
  open?: boolean;
  /** Callback when popup visibility changes. */
  onOpenChange?: (open: boolean) => void;
  /** Popup placement. */
  placement?: PopoverPlacement;
  /** Show hex text next to the swatch. */
  showText?: boolean | ((hex: string) => React.ReactNode);
  /** Custom trigger element. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_COLOR = '#25ac01';

const sizeMap: Record<ColorPickerSize, string> = {
  small: 'sm',
  middle: 'middle',
  large: 'lg',
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  defaultValue = DEFAULT_COLOR,
  onChange,
  onChangeComplete,
  disabled = false,
  allowClear = false,
  disabledAlpha = false,
  presets,
  size = 'middle',
  open,
  onOpenChange,
  placement = 'bottomLeft',
  showText,
  children,
  className,
  style,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('color-picker') || getDefaultPrefixCls('color-picker');

  const [innerHsv, setInnerHsv] = useState<HSV>(
    () => hexToHsv(value ?? defaultValue) ?? { h: 120, s: 1, v: 0.67, a: 1 }
  );

  // Sync from controlled value
  const hsv = useMemo(() => {
    if (value !== undefined) {
      return hexToHsv(value) ?? innerHsv;
    }
    return innerHsv;
  }, [value, innerHsv]);

  const hex = useMemo(() => hsvToHex(hsv, !disabledAlpha && hsv.a < 1), [hsv, disabledAlpha]);

  const handleChange = useCallback(
    (newHsv: HSV) => {
      setInnerHsv(newHsv);
      const newHex = hsvToHex(newHsv, !disabledAlpha && newHsv.a < 1);
      onChange?.(newHex);
    },
    [onChange, disabledAlpha]
  );

  const handleChangeComplete = useCallback(() => {
    onChangeComplete?.(hex);
  }, [onChangeComplete, hex]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleared = hexToHsv('#00000000') ?? { h: 0, s: 0, v: 0, a: 0 };
    setInnerHsv(cleared);
    onChange?.('#00000000');
    onChangeComplete?.('#00000000');
  };

  const panel = (
    <ColorPanel
      hsv={hsv}
      onChange={handleChange}
      onChangeComplete={handleChangeComplete}
      disabledAlpha={disabledAlpha}
      presets={presets}
      prefixCls={prefixCls}
    />
  );

  const triggerCls = classNames(
    `${prefixCls}-trigger`,
    `${prefixCls}-trigger-${sizeMap[size]}`,
    { [`${prefixCls}-trigger-disabled`]: disabled },
    className
  );

  const renderText = () => {
    if (!showText) return null;
    const content = typeof showText === 'function' ? showText(hex) : hex.toUpperCase();
    return <span className={`${prefixCls}-trigger-text`}>{content}</span>;
  };

  const defaultTrigger = (
    <button type="button" className={triggerCls} style={style} disabled={disabled}>
      <span className={`${prefixCls}-trigger-color`}>
        <span className={`${prefixCls}-trigger-color-inner`} style={{ backgroundColor: hex }} />
      </span>
      {renderText()}
      {allowClear && (
        <span
          className={`${prefixCls}-trigger-clear`}
          onClick={handleClear}
          role="button"
          tabIndex={-1}
        >
          <CloseCircleOutlined />
        </span>
      )}
    </button>
  );

  return (
    <Popover
      content={panel}
      trigger={disabled ? [] : ['click']}
      placement={placement}
      open={disabled ? false : open}
      onOpenChange={disabled ? undefined : onOpenChange}
      overlayClassName={`${prefixCls}-popover`}
    >
      {children ? (
        <span>{children}</span>
      ) : (
        <span>
          <Wave disabled={disabled}>{defaultTrigger}</Wave>
        </span>
      )}
    </Popover>
  );
};

ColorPicker.displayName = 'ColorPicker';
