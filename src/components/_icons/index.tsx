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

export const SearchOutlined: React.FC = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 714 478.4 714 408c0-167.4-135.6-303-303-303S108 240.6 108 408s135.6 303 303 303c70.4 0 134.7-23.8 186.8-64.1l259.7 259.6a8.2 8.2 0 0011.6 0l40.4-40.4a8.2 8.2 0 000-11.6zM411 700c-161 0-292-130.9-292-292s131-292 292-292 292 130.9 292 292-131 292-292 292z" />
  </svg>
);

export const UserOutlined: React.FC = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C ## 752.7 820.3 781.7 892.6 783.7 969.8c.2 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S## 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
  </svg>
);

export const EyeOutlined: React.FC = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
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

// ── ImageManager / file system icons ───────────────────────────────────────

export const FolderOutlined: React.FC = () => (
  <Icon data-icon="folder">
    <path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z" />
  </Icon>
);

export const FolderAddOutlined: React.FC = () => (
  <Icon data-icon="folder-add">
    <path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768zM416 565h64v90h90v54h-90v90h-64v-90h-90v-54h90v-90z" />
  </Icon>
);

export const DeleteOutlined: React.FC = () => (
  <Icon data-icon="delete">
    <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
  </Icon>
);

export const EditOutlined: React.FC = () => (
  <Icon data-icon="edit">
    <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
  </Icon>
);

export const PlusOutlined: React.FC = () => (
  <Icon data-icon="plus">
    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
  </Icon>
);

export const UploadOutlined: React.FC = () => (
  <Icon data-icon="upload">
    <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" />
  </Icon>
);

export const PictureOutlined: React.FC = () => (
  <Icon data-icon="picture">
    <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792zm0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2zM304 456a88 88 0 100-176 88 88 0 000 176zm0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z" />
  </Icon>
);

export const LeftOutlined: React.FC = () => (
  <Icon data-icon="left">
    <path d="M724 218.3V141.9c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 351.2c5.3 4.1 12.9.4 12.9-6.3v-76.4c0-4.9-2.3-9.6-6.1-12.6l-360-280.2 360-280.5c3.8-3 6.1-7.7 6.1-12.6z" />
  </Icon>
);

export const RightOutlined: React.FC = () => (
  <Icon data-icon="right">
    <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 280.1-360 280.1c-3.9 3-6.1 7.7-6.1 12.6V881c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
  </Icon>
);

export const AppstoreOutlined: React.FC = () => (
  <Icon data-icon="appstore">
    <path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z" />
  </Icon>
);

export const UnorderedListOutlined: React.FC = () => (
  <Icon data-icon="unordered-list">
    <path d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0z" />
  </Icon>
);

export const HomeOutlined: React.FC = () => (
  <Icon data-icon="home">
    <path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h128v224h250c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.2-90.5z" />
  </Icon>
);

export const MoreOutlined: React.FC = () => (
  <Icon data-icon="more">
    <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z" />
  </Icon>
);
