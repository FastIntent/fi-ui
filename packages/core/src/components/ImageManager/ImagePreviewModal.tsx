import React, { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { Spin } from '../Spin';
import type { ServerImage } from './types';
import { formatBytes } from './utils';

export interface ImagePreviewModalProps {
  prefixCls: string;
  image: ServerImage | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return '—';
  }
}

/**
 * Built-in preview for the ImageManager. Opens when the user clicks the
 * eye action on an image card. Shows the full asset alongside a metadata
 * panel (dimensions, size, modified date, path).
 *
 * Resolution strategy:
 *  1. If width/height come pre-computed in the ServerImage, use them.
 *  2. Otherwise read naturalWidth/naturalHeight from the <img> once it
 *     has loaded, so even adapters that don't pre-stat images still
 *     report accurate pixel dimensions.
 */
export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  prefixCls,
  image,
  open,
  onClose,
}) => {
  const [naturalDims, setNaturalDims] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Reset measured dims whenever the image being previewed changes.
  useEffect(() => {
    setNaturalDims(null);
    setLoaded(false);
  }, [image?.path]);

  if (!image) return null;

  const width = image.width ?? naturalDims?.w;
  const height = image.height ?? naturalDims?.h;
  const dims = width && height ? `${width} × ${height} px` : '—';

  return (
    <Modal
      open={open}
      title={image.name}
      onCancel={onClose}
      footer={null}
      width={960}
      className={`${prefixCls}-preview-modal`}
    >
      <div className={`${prefixCls}-preview`}>
        <div className={`${prefixCls}-preview-canvas`}>
          {!loaded && (
            <div className={`${prefixCls}-preview-spinner`} aria-hidden="true">
              <Spin />
            </div>
          )}
          <img
            src={image.url}
            alt={image.name}
            onLoad={(e) => {
              const el = e.currentTarget;
              if (!image.width || !image.height) {
                setNaturalDims({ w: el.naturalWidth, h: el.naturalHeight });
              }
              setLoaded(true);
            }}
          />
        </div>

        <dl className={`${prefixCls}-preview-meta`}>
          <div className={`${prefixCls}-preview-meta-row`}>
            <dt>Dimensions</dt>
            <dd>{dims}</dd>
          </div>
          <div className={`${prefixCls}-preview-meta-row`}>
            <dt>Size</dt>
            <dd>{formatBytes(image.size)}</dd>
          </div>
          <div className={`${prefixCls}-preview-meta-row`}>
            <dt>Modified</dt>
            <dd>{formatDate(image.mtime)}</dd>
          </div>
          <div className={`${prefixCls}-preview-meta-row`}>
            <dt>Path</dt>
            <dd title={image.path} className={`${prefixCls}-preview-meta-path`}>
              {image.path}
            </dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
};

ImagePreviewModal.displayName = 'ImagePreviewModal';
