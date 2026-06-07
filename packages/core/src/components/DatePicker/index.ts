import { DatePicker as InternalDatePicker } from './DatePicker';
import { RangePicker } from './RangePicker';

export type { DatePickerProps } from './DatePicker';
export type { RangePickerProps } from './RangePicker';

export type DatePickerType = typeof InternalDatePicker & {
  RangePicker: typeof RangePicker;
};

const DatePicker = InternalDatePicker as DatePickerType;
DatePicker.RangePicker = RangePicker;

export { DatePicker, RangePicker };
import './DatePicker.scss';
