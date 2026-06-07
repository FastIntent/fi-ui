import React from 'react';
import classNames from 'classnames';
import type { UploadFile } from './Upload';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

export interface UploadListProps {
  items?: UploadFile[];
  listType?: 'text' | 'picture' | 'picture-card' | 'picture-circle';
  onRemove?: (file: UploadFile) => void;
  prefixCls?: string;
}

const EMPTY_UPLOAD_ITEMS: UploadFile[] = [];

export const UploadList: React.FC<UploadListProps> = ({
  items = EMPTY_UPLOAD_ITEMS,
  listType = 'text',
  onRemove,
  prefixCls: customPrefixCls,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls =
    getPrefixCls?.('upload-list', customPrefixCls) || getDefaultPrefixCls('upload-list');
  const listCls = classNames(prefixCls, `${prefixCls}-${listType}`);

  if (listType === 'picture-card' || listType === 'picture-circle') {
    return (
      <div className={listCls}>
        {items.map((file) => {
          const isImage = file.type?.includes('image') || file.url || file.thumbUrl;
          const originFile = file.originFileObj || (file instanceof File ? file : null);
          const url =
            file.url || file.thumbUrl || (originFile ? URL.createObjectURL(originFile) : '');

          return (
            <div key={file.uid} className={`${prefixCls}-item`}>
              <div className={`${prefixCls}-item-info`}>
                {isImage ? (
                  <img src={url} alt={file.name} className={`${prefixCls}-item-thumbnail`} />
                ) : (
                  <div className={`${prefixCls}-item-file-icon`}>📄</div>
                )}
              </div>
              <div className={`${prefixCls}-item-actions`}>
                <button
                  className={`${prefixCls}-item-remove`}
                  onClick={() => onRemove?.(file)}
                  title="Remove file"
                >
                  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                    <path d="M864 256H728l-32.4-90.8c-1.3-3.5-4-6.2-7.5-7.5L597.3 128H426.7l-90.8 32.4c-3.5 1.3-6.2 4-7.5 7.5L296 256H160c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v512c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64V320h64c17.7 0 32-14.3 32-32s-14.3-32-32-32zM426.7 200.7l13.9-4.9h142.8l13.9 4.9L614.9 256H409.1l17.6-55.3zM704 832H320V320h384v512zM448 448h64v256h-64z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // text / picture list
  return (
    <div className={listCls}>
      {items.map((file) => {
        return (
          <div
            key={file.uid}
            className={classNames(`${prefixCls}-item`, {
              [`${prefixCls}-item-error`]: file.status === 'error',
            })}
          >
            {/* File icon */}
            <span className={`${prefixCls}-item-icon`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
              </svg>
            </span>

            {/* File name */}
            <span className={`${prefixCls}-item-name`} title={file.name}>
              {file.name}
            </span>

            {/* Remove button */}
            <button
              className={`${prefixCls}-item-remove`}
              onClick={() => onRemove?.(file)}
              title="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
