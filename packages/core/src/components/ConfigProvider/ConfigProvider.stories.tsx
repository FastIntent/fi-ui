import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfigProvider } from './ConfigProvider';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import { DatePicker } from '../DatePicker/DatePicker';
import { Popconfirm } from '../Popconfirm/Popconfirm';
import { Upload } from '../Upload/Upload';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { enUS, esES } from '../locale';

const meta = {
  title: 'System/ConfigProvider',
  component: ConfigProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfigProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeOverride: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '400px' }}>
      <section>
        <h4 style={{ marginBottom: '12px', color: '#888' }}>Default Theme</h4>
        <ConfigProvider>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button type="primary">Primary Button</Button>
            <Checkbox defaultChecked>Blue (Default)</Checkbox>
          </div>
        </ConfigProvider>
      </section>

      <section>
        <h4 style={{ marginBottom: '12px', color: '#888' }}>Green Theme (Common Override)</h4>
        <ConfigProvider
          theme={{ common: { primaryColor: '#00d084', primaryColorHover: '#00e691' } }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button type="primary">Success Button</Button>
            <Checkbox defaultChecked>Green (via Common)</Checkbox>
          </div>
        </ConfigProvider>
      </section>

      <section>
        <h4 style={{ marginBottom: '12px', color: '#888' }}>
          Deep Customization (Component Tokens)
        </h4>
        <ConfigProvider
          theme={{
            common: { borderRadius: '12px' },
            Checkbox: { colorChecked: '#ff4d4f', size: '20px' },
            Button: { colorPrimary: '#722ed1', fontWeight: 700 },
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button type="primary">Purple Bold Button</Button>
            <Checkbox defaultChecked>Red & Large Checkbox</Checkbox>
          </div>
        </ConfigProvider>
      </section>
    </div>
  ),
};

export const LocaleOverride: Story = {
  render: () => {
    const [locale, setLocale] = useState(enUS);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <strong>Switch Language:</strong>
          <Button type={locale === enUS ? 'primary' : 'default'} onClick={() => setLocale(enUS)}>
            English
          </Button>
          <Button type={locale === esES ? 'primary' : 'default'} onClick={() => setLocale(esES)}>
            Español
          </Button>
        </div>

        <ConfigProvider locale={locale}>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexDirection: 'column',
              padding: '24px',
              border: '1px dashed #ccc',
              borderRadius: '8px',
            }}
          >
            <div>
              <h4 style={{ marginBottom: '8px' }}>DatePicker Component</h4>
              <DatePicker />
            </div>

            <div>
              <h4 style={{ marginBottom: '8px' }}>Popconfirm Component</h4>
              <Popconfirm title="Are you sure you want to delete this task?">
                <Button>Delete Task</Button>
              </Popconfirm>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px' }}>Upload Component (Dragger)</h4>
              <Upload.Dragger />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '8px' }}>Input (Default Placeholder)</h4>
                <Input />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '8px' }}>Select (Default Placeholder)</h4>
                <Select style={{ width: '100%' }} options={[{ label: 'Option 1', value: 1 }]} />
              </div>
            </div>
          </div>
        </ConfigProvider>
      </div>
    );
  },
};
