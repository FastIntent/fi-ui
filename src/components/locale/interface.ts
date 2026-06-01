import type { Locale as RcPickerLocale } from '@rc-component/picker/lib/interface';

export interface ModalLocale {
  okText: string;
  cancelText: string;
  closeAriaLabel: string;
}

export interface DrawerLocale {
  closeAriaLabel: string;
}

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

export interface UploadLocale {
  dragText: string;
  dragHint: string;
  uploadButtonText: string;
  uploading?: string;
  removeFile?: string;
  uploadError?: string;
  previewFile?: string;
  downloadFile?: string;
}

export interface TableLocale {
  emptyText: React.ReactNode | string;
  filterTitle?: string;
  filterConfirm?: string;
  filterReset?: string;
  filterEmptyText?: string;
  selectAll?: string;
  selectInvert?: string;
  selectNone?: string;
  selectionAll?: string;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export interface EmptyLocale {
  description: string;
}

export interface SelectLocale {
  notFoundContent: string;
}

export interface TransferLocale {
  titles?: React.ReactNode[];
  notFoundContent?: React.ReactNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
  remove?: string;
  selectCurrent?: string;
  removeCurrent?: string;
  selectAll?: string;
  removeAll?: string;
  selectInvert?: string;
}

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

export interface ImageLocale {
  preview: string;
}

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}

export interface FormLocale {
  defaultValidateMessages: {
    default?: string | (() => string);
    required?: string | (() => string);
    // Add more as needed
  };
}

export interface AlertLocale {
  closeAriaLabel: string;
}

export interface TagLocale {
  closeAriaLabel: string;
}

export interface NotificationLocale {
  closeAriaLabel: string;
}

export interface ResultLocale {
  title403: string;
  title404: string;
  title500: string;
  subtitle403: string;
  subtitle404: string;
  subtitle500: string;
}

export interface LayoutLocale {
  searchPlaceholder: string;
  notifications: string;
  help: string;
  expandSidebar: string;
  collapseSidebar: string;
}

export interface PaginationLocale {
  items_per_page: string;
  jump_to: string;
  jump_to_confirm: string;
  page: string;
  prev_page: string;
  next_page: string;
  prev_5: string;
  next_5: string;
  prev_3: string;
  next_3: string;
  page_size: string;
}

export interface FastUILocale {
  locale: string;
  DatePicker?: RcPickerLocale & {
    rangeSeparatorAriaLabel?: string;
    placeholder?: string;
    rangePlaceholder?: [string, string];
  };
  TimePicker?: TimePickerLocale;
  Modal?: ModalLocale;
  Popconfirm?: PopconfirmLocale;
  Upload?: UploadLocale;
  Table?: TableLocale;
  Pagination?: PaginationLocale;
  Empty?: EmptyLocale;
  Select?: SelectLocale;
  Transfer?: TransferLocale;
  Image?: ImageLocale;
  Tour?: TourLocale;
  Form?: FormLocale;
  Alert?: AlertLocale;
  Tag?: TagLocale;
  Notification?: NotificationLocale;
  Result?: ResultLocale;
  Layout?: LayoutLocale;
  Drawer?: DrawerLocale;
  global?: {
    placeholder: string;
  };
}
