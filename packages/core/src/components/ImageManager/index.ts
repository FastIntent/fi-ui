import { ImageManager as ImageManagerComponent } from './ImageManager';
import { ImageManagerModal } from './ImageManagerModal';
import { ImagePreviewModal } from './ImagePreviewModal';

type ImageManagerType = typeof ImageManagerComponent & {
  Modal: typeof ImageManagerModal;
  Preview: typeof ImagePreviewModal;
};

const ImageManager = ImageManagerComponent as ImageManagerType;
ImageManager.Modal = ImageManagerModal;
ImageManager.Preview = ImagePreviewModal;

export { ImageManager, ImageManagerModal, ImagePreviewModal };
export type { ImagePreviewModalProps } from './ImagePreviewModal';
export type {
  ImageManagerProps,
  ImageManagerModalProps,
  ImageManagerActions,
  ImageManagerMode,
  ImageManagerView,
  ServerImage,
  ServerFolder,
  ListResult,
} from './types';

import './ImageManager.scss';
