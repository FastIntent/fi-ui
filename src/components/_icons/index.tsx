import React from 'react';

// Shared SVG icon wrapper — keeps props consistent across all icons.
const Icon: React.FC<React.SVGProps<SVGSVGElement> & { children: React.ReactNode }> = ({
  children,
  ...props
}) => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

// ── Status icons (Alert, Message, Notification) ─────────────────────────────

export const CheckCircleFilled: React.FC = () => (
  <Icon>
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
  </Icon>
);

export const InfoCircleFilled: React.FC = () => (
  <Icon>
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 170c27.6 0 50 22.4 50 50s-22.4 50-50 50-50-22.4-50-50 22.4-50 50-50zm80 478c0 4.4-3.6 8-8 8h-144c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h28V464h-28c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h104c4.4 0 8 3.6 8 8v312h28c4.4 0 8 3.6 8 8v48z" />
  </Icon>
);

export const ExclamationCircleFilled: React.FC = () => (
  <Icon>
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
  </Icon>
);

export const CloseCircleFilled: React.FC = () => (
  <Icon>
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
  </Icon>
);

// ── Input icons ─────────────────────────────────────────────────────────────

export const CalendarOutlined: React.FC = () => (
  <Icon data-icon="calendar">
    <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" />
  </Icon>
);

export const CloseCircleOutlined: React.FC = () => (
  <Icon data-icon="close-circle">
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
  </Icon>
);

// ── Select / Dropdown icons ─────────────────────────────────────────────────

export const DownOutlined: React.FC = () => (
  <Icon>
    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
  </Icon>
);

export const UpOutlined: React.FC = () => (
  <Icon>
    <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" />
  </Icon>
);

export const CheckOutlined: React.FC = () => (
  <Icon>
    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
  </Icon>
);

// ── Result status icons (large, filled circle + white symbol) ──────────────

export const ResultCheckIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="currentColor" />
    <path
      d="M22 36l10 10 18-20"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ResultCloseIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="currentColor" />
    <path d="M25 25l22 22M47 25L25 47" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const ResultInfoIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="currentColor" />
    <rect x="33" y="30" width="6" height="20" rx="3" fill="#fff" />
    <circle cx="36" cy="23" r="4" fill="#fff" />
  </svg>
);

export const ResultWarningIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="currentColor" />
    <rect x="33" y="20" width="6" height="22" rx="3" fill="#fff" />
    <circle cx="36" cy="50" r="4" fill="#fff" />
  </svg>
);

// ── Empty illustrations ───────────────────────────────────────────────────

export const EmptyDefaultImage: React.FC = () => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 184 152"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="92" cy="140" rx="68" ry="8" fill="#f5f5f7" />
    <path d="M42 68h100v60a4 4 0 0 1-4 4H46a4 4 0 0 1-4-4V68Z" fill="#fafafa" stroke="#d9d9d9" />
    <path d="M42 68l16-40h68l16 40" fill="#fafafa" stroke="#d9d9d9" />
    <path d="M42 68h32a8 8 0 0 0 8 8h20a8 8 0 0 0 8-8h32" fill="#fff" stroke="#d9d9d9" />
    <g stroke="#d9d9d9" strokeWidth="1" strokeLinecap="round">
      <line x1="72" y1="40" x2="112" y2="40" />
      <line x1="68" y1="48" x2="116" y2="48" />
      <line x1="76" y1="56" x2="108" y2="56" />
    </g>
  </svg>
);

export const EmptySimpleImage: React.FC = () => (
  <svg width="64" height="41" viewBox="0 0 64 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="37" rx="22" ry="4" fill="#f5f5f7" />
    <path d="M8 16h48v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V16Z" fill="#fafafa" stroke="#d9d9d9" />
    <path d="M8 16l10-12h28l10 12" fill="#fafafa" stroke="#d9d9d9" />
    <path d="M8 16h14a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4h14" fill="#fff" stroke="#d9d9d9" />
  </svg>
);

// ── Misc ────────────────────────────────────────────────────────────────────

export const LoadingOutlined: React.FC = () => (
  <svg
    viewBox="0 0 1024 1024"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
  </svg>
);
