import React, { forwardRef } from 'react';
import { RangePicker as RCRangePicker } from '@rc-component/picker';
import type { RangePickerProps as RcRangePickerProps } from '@rc-component/picker';
import type { Locale, RangePickerRef } from '@rc-component/picker/lib/interface';
import dayjsGenerateConfig from '@rc-component/picker/lib/generate/dayjs';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { CalendarOutlined, CloseCircleOutlined } from '../_icons';

import defaultLocale from '../locale/en_US';

export type RangePickerSize = 'large' | 'middle' | 'small';

export interface RangePickerProps extends Omit<
  RcRangePickerProps<Dayjs>,
  'generateConfig' | 'locale' | 'size'
> {
  size?: RangePickerSize;
  status?: 'error' | 'warning' | '';
  dropdownClassName?: string;
  popupClassName?: string;
}

export const RangePicker = forwardRef<RangePickerRef, RangePickerProps>((props, ref) => {
  const { prefixCls: customPrefixCls, className, size, status, disabled, ...restProps } = props;

  const {
    size: contextSize,
    getPopupContainer,
    locale: contextLocale,
    getPrefixCls,
    dayjsLocaleId,
  } = useConfig();
  const prefixCls = getPrefixCls?.('picker', customPrefixCls) || getDefaultPrefixCls('picker');
  const rootPrefixCls = getPrefixCls?.('') || 'fi';
  const mergedSize = size || contextSize || 'middle';
  const datePickerLocale = contextLocale?.DatePicker || defaultLocale.DatePicker!;
  const pickerLocale = { ...datePickerLocale, locale: dayjsLocaleId || 'en' };

  const pickerClasses = classNames(
    prefixCls,
    `${prefixCls}-range`,
    {
      [`${prefixCls}-${mergedSize}`]: mergedSize !== 'middle',
      [`${prefixCls}-status-${status}`]: status,
      [`${prefixCls}-disabled`]: disabled, // Might be an array in range picker, but doing boolean here
    },
    className
  );

  const dropdownClassName = classNames(
    `${prefixCls}-dropdown`,
    `${prefixCls}-dropdown-range`,
    props.dropdownClassName || props.popupClassName
  );

  return (
    <RCRangePicker<Dayjs>
      {...restProps}
      getPopupContainer={restProps.getPopupContainer || getPopupContainer}
      ref={ref}
      prefixCls={prefixCls}
      generateConfig={dayjsGenerateConfig}
      locale={pickerLocale as Locale}
      className={pickerClasses}
      classNames={{
        popup: {
          root: dropdownClassName,
        },
      }}
      transitionName={`${rootPrefixCls}-slide-up`}
      placeholder={restProps.placeholder || pickerLocale.rangePlaceholder}
      disabled={disabled}
      suffixIcon={<CalendarOutlined />}
      allowClear={{ clearIcon: <CloseCircleOutlined /> }}
      separator={
        <span
          aria-label={datePickerLocale.rangeSeparatorAriaLabel || 'to'}
          className={`${prefixCls}-separator`}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="swap-right"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path>
          </svg>
        </span>
      }
      placement="bottomLeft"
    />
  );
});

RangePicker.displayName = 'RangePicker';
