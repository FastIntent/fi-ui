// Unified barrel — named exports for tree-shake-friendly imports.
//
// Each component's CSS rides along automatically thanks to two
// mechanisms working together:
//
//   1. `dist/components/X/index.js` registers `import './index.css'`
//      (injected by scripts/generate-barrel.mjs post-build).
//   2. `dist/chunk-X.js` — the actual implementation chunk the bundler
//      inlines into — ALSO registers `import './components/X/index.css'`
//      (also injected by the same script).
//
// Why both? Turbopack inlines named re-exports straight to the chunk
// and skips the barrel. Older webpack and esbuild respect the barrel
// but ignore the chunk. We inject in both places so styles never go
// missing regardless of bundler.

// ── Components ─────────────────────────────────────────────────────
export { Button } from './components/Button';
export type { ButtonProps, ButtonType, ButtonSize } from './components/Button';

export { Form, FormItem, useForm } from './components/Form';
export type { FormProps, FormItemProps } from './components/Form';

export { Input, TextArea } from './components/Input';
export type { InputProps, InputSize, InputRef, TextAreaProps } from './components/Input';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Title, Text, Paragraph } from './components/Typography';
export type { TypographyProps, TitleProps } from './components/Typography';

export { Wave } from './components/Wave';
export type { WaveProps } from './components/Wave';

export { Dropdown } from './components/Dropdown';
export type { DropdownProps } from './components/Dropdown';

export { Menu, SubMenu, MenuItem, ItemGroup } from './components/Menu';
export type { MenuProps } from './components/Menu';

export { Select, Option, OptGroup } from './components/Select';
export type { SelectProps } from './components/Select';

export { Avatar, AvatarGroup } from './components/Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarGroupMaxConfig } from './components/Avatar';

export { Card } from './components/Card';
export type { CardProps, CardMetaProps } from './components/Card';

export { Drawer } from './components/Drawer';
export type { DrawerProps } from './components/Drawer';

export { Layout, PageContainer } from './components/Layout';
export type {
  LayoutProps,
  MenuDataItem,
  LayoutUserInfo,
  PageContainerProps,
} from './components/Layout';

export { Checkbox, CheckboxGroup } from './components/Checkbox';
export type {
  CheckboxProps,
  CheckboxChangeEvent,
  CheckboxGroupProps,
  CheckboxOptionType,
} from './components/Checkbox';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

// ConfigProvider exports the provider, hooks and theme types. The type
// surface is large and not interactive at the barrel level, so we keep
// `export *` here — no runtime side-effects to drag in.
export * from './components/ConfigProvider';

export { DatePicker, RangePicker } from './components/DatePicker';
export type { DatePickerProps, RangePickerProps } from './components/DatePicker';

export { InputOTP } from './components/InputOTP';
export type { InputOTPProps } from './components/InputOTP';

export { InputNumber } from './components/InputNumber';
export type { InputNumberProps } from './components/InputNumber';

export { Radio, RadioGroup, RadioButton } from './components/Radio';
export type {
  RadioProps,
  RadioChangeEvent,
  RadioGroupProps,
  RadioButtonProps,
} from './components/Radio';

export { Row, Col } from './components/Grid';
export type { RowProps, ColProps } from './components/Grid';

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { Rate } from './components/Rate';
export type { RateProps } from './components/Rate';

export { Upload, UploadList, ImgCrop } from './components/Upload';
export type { UploadProps, UploadFile, UploadChangeParam, ImgCropProps } from './components/Upload';

export { Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Table } from './components/Table';
export type { TableProps } from './components/Table';

export { Space, SpaceCompact, SpaceWithCompact } from './components/Space';
export type { SpaceProps, SpaceCompactProps } from './components/Space';

export { notification, NotificationNode } from './components/Notification';
export type {
  NotificationItem,
  NotificationType,
  NotificationPlacement,
  NotificationNodeProps,
  NotificationConfig,
} from './components/Notification';

export { message, MessageItem } from './components/Message';
export type { MessageConfig, MessageType, MessageItemProps } from './components/Message';

export { Tabs } from './components/Tabs';
export type { TabsProps, TabItemType, TabsType, TabsPosition } from './components/Tabs';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Popover } from './components/Popover';
export type { PopoverProps, PopoverPlacement, PopoverTrigger } from './components/Popover';

export { Popconfirm } from './components/Popconfirm';
export type { PopconfirmProps } from './components/Popconfirm';

export { Collapse, CollapsePanel } from './components/Collapse';
export type { CollapseProps, CollapsePanelProps } from './components/Collapse';

export { ColorPicker } from './components/ColorPicker';
export type {
  ColorPickerProps,
  ColorPickerSize,
  ColorPickerPreset,
} from './components/ColorPicker';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant, SkeletonAnimation } from './components/Skeleton';

export { Empty } from './components/Empty';
export type { EmptyProps } from './components/Empty';

export { Result } from './components/Result';
export type { ResultProps, ResultStatus } from './components/Result';

export { Breadcrumb, BreadcrumbItem } from './components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItemProps } from './components/Breadcrumb';

export { Steps, Step } from './components/Steps';
export type { StepsProps, StepProps, StepStatus } from './components/Steps';

export { Timeline, TimelineItem } from './components/Timeline';
export type { TimelineProps, TimelineItemProps } from './components/Timeline';

export { Tag } from './components/Tag';
export type { TagProps } from './components/Tag';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { Spin } from './components/Spin';
export type { SpinProps, SpinSize, SpinType } from './components/Spin';

export { Flex } from './components/Flex';
export type { FlexProps } from './components/Flex';

export { Calendar } from './components/Calendar';
export type { CalendarProps, CalendarMode } from './components/Calendar';

export { ImageManager, ImageManagerModal, ImagePreviewModal } from './components/ImageManager';
export type {
  ImageManagerProps,
  ImageManagerModalProps,
  ImageManagerActions,
  ImageManagerMode,
  ImageManagerView,
  ImagePreviewModalProps,
  ServerImage,
  ServerFolder,
  ListResult,
} from './components/ImageManager';

export { ImagePickerInput } from './components/ImagePickerInput';
export type { ImagePickerInputProps } from './components/ImagePickerInput';

// ── Locales ────────────────────────────────────────────────────────
export { enUS, esES, ptBR, frFR, deDE } from './components/locale';
export type { AtomizeUILocale } from './components/locale';

// ── Design tokens (always loaded — they're the foundation) ─────────
import './styles/tokens.scss';
import './styles/base.scss';
import './styles/theme-amber.scss';
