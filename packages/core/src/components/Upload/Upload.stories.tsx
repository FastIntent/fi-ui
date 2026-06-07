import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Upload, UploadFile, UploadProps } from './Upload';
import { Button } from '../Button/Button';

const UploadIcon = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="upload"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M400 317.7h73.3V656c0 4.4 3.6 8 8 8h62.7c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
  </svg>
);

// Helper Components for Stories
const LoadingIcon = () => (
  <svg
    className="atom-anim-spin"
    viewBox="0 0 1024 1024"
    width="24"
    height="24"
    fill="currentColor"
  >
    <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 957.7 195.9 921 149 874s-83.7-102.7-110.4-163.7C11.5 648.2 0 581.1 0 512c0-13.8 11.2-25 25-25s25 11.2 25 25c0 62.4 12.2 122.9 36.2 179.8C110.2 746.2 143.2 796.5 185.3 838.7c42.2 42.2 92.5 75.1 146.9 99.1 56.9 24 117.4 36.2 179.8 36.2s122.9-12.2 179.8-36.2c54.4-24 104.7-56.9 146.9-99.1 42.2-42.2 75.1-92.5 99.1-146.9 24-56.9 36.2-117.4 36.2-179.8s-12.2-122.9-36.2-179.8c-24-54.4-56.9-104.7-99.1-146.9S746.2 110.2 691.8 86.2C634.9 62.2 574.4 50 512 50c-13.8 0-25-11.2-25-25s11.2-25 25-25c69.1 0 136.2 13.5 199.3 40.2 61 25.8 116.8 62.5 163.7 109.5s83.7 102.7 110.4 163.7c26.7 61 40.2 128.1 40.2 199.3s-13.5 136.2-40.2 199.3c-26.7 61-63.5 116.8-110.4 163.7s-102.7 83.7-163.7 110.4C648.2 1010.5 581.1 1024 512 1024z" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="64 64 896 896" width="24" height="24" fill="currentColor">
    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
  </svg>
);

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  render: () => (
    <Upload>
      <Button icon={<UploadIcon />}>Click to Upload</Button>
    </Upload>
  ),
};

export const Multiple: Story = {
  args: {
    multiple: true,
    children: <Button icon={<UploadIcon />}>Upload Multiple</Button>,
  },
};

export const Dragger: Story = {
  args: {
    type: 'drag',
  },
};

export const AvatarUpload = () => {
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setLoading(false);
        setImageUrl(reader.result as string);
      });
      if (info.file.originFileObj) {
        reader.readAsDataURL(info.file.originFileObj);
      }
    }
  };

  const uploadButton = (
    <div className="atom-upload-btn">
      {loading ? <LoadingIcon /> : <PlusIcon />}
      <div className="atom-upload-text" style={{ marginTop: 8 }}>
        Upload
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 16, padding: 24 }}>
      <Upload name="avatar" listType="picture-card" showUploadList={false} onChange={handleChange}>
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
      <Upload
        name="avatar"
        listType="picture-circle"
        showUploadList={false}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    </div>
  );
};

export const WithImageCrop: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <h4 style={{ marginBottom: '16px' }}>Native Crop – Avatar (1:1 → ~400×400 px)</h4>
        <Upload
          listType="picture-card"
          cropProps={{
            aspect: 1,
            rotationSlider: true,
            zoomSlider: true,
            showReset: true,
            modalTitle: 'Recortar Foto de Perfil',
            showGrid: true,
          }}
        >
          <div className="atom-upload-btn">
            <PlusIcon />
            <div style={{ marginTop: 8 }}>Avatar</div>
          </div>
        </Upload>
      </section>

      <section>
        <h4 style={{ marginBottom: '16px' }}>Native Crop – Banner (3:1 → ~1200×400 px)</h4>
        <Upload
          cropProps={{
            aspect: 3 / 1,
            zoomSlider: true,
            rotationSlider: true,
            modalTitle: 'Recortar Banner Corporativo',
            modalOk: 'Confirmar',
            modalCancel: 'Cancelar',
            showGrid: true,
          }}
        >
          <Button icon={<UploadIcon />}>Upload Banner Image</Button>
        </Upload>
      </section>

      <section>
        {/* aspect 16:9 → salida widescreen, p.ej. 1280×720 px para portada */}
        <h4 style={{ marginBottom: '16px' }}>Native Crop – Dragger (16:9 → ~1280×720 px)</h4>
        <Upload.Dragger
          cropProps={{
            aspect: 16 / 9,
            zoomSlider: true,
            rotationSlider: true,
            modalTitle: 'Recortar Imagen de Portada',
            showGrid: true,
          }}
        />
      </section>
    </div>
  ),
};
