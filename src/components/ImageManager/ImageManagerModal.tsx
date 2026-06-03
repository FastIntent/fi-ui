import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { ImageManager } from './ImageManager';
import type { ImageManagerModalProps, ServerImage } from './types';

const EMPTY_PATHS: string[] = [];

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  open,
  onCancel,
  onApply,
  title = 'Select image',
  width = 880,
  okText = 'Apply',
  cancelText = 'Cancel',
  defaultSelected,
  multiple,
  actions,
  rootDir,
  initialPath,
  mode = 'view',
  onImageOpen,
  accept,
  maxFileSize,
  defaultView,
  itemSize,
  itemMinWidth,
  emptyState,
}) => {
  const [paths, setPaths] = useState<string[]>(defaultSelected ?? EMPTY_PATHS);
  const [images, setImages] = useState<ServerImage[]>([]);

  // Reset selection each time the modal opens
  useEffect(() => {
    if (open) {
      setPaths(defaultSelected ?? EMPTY_PATHS);
      setImages([]);
    }
  }, [open, defaultSelected]);

  const handleSelection = useCallback((p: string[], imgs: ServerImage[]) => {
    setPaths(p);
    setImages(imgs);
  }, []);

  const handleApply = useCallback(() => {
    onApply(paths, images);
  }, [onApply, paths, images]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      width={width}
      destroyOnClose
      footer={
        <>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button type="primary" onClick={handleApply} disabled={paths.length === 0}>
            {okText}
          </Button>
        </>
      }
    >
      <ImageManager
        rootDir={rootDir}
        initialPath={initialPath}
        mode={mode}
        multiple={multiple}
        actions={actions}
        selected={paths}
        onSelectionChange={handleSelection}
        onImageOpen={onImageOpen}
        accept={accept}
        maxFileSize={maxFileSize}
        defaultView={defaultView}
        itemSize={itemSize}
        itemMinWidth={itemMinWidth}
        emptyState={emptyState}
      />
    </Modal>
  );
};

ImageManagerModal.displayName = 'ImageManagerModal';
