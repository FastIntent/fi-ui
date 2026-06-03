import { ImageManager as ImageManagerComponent } from './ImageManager';
import { ImageManagerModal } from './ImageManagerModal';

type ImageManagerType = typeof ImageManagerComponent & {
  Modal: typeof ImageManagerModal;
};

const ImageManager = ImageManagerComponent as ImageManagerType;
ImageManager.Modal = ImageManagerModal;

export { ImageManager, ImageManagerModal };
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
