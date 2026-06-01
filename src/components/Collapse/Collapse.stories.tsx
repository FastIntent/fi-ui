import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Collapse } from './Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Components/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof Collapse>;

const items = [
  {
    key: '1',
    header: 'This is panel header 1',
    content:
      'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.',
  },
  {
    key: '2',
    header: 'This is panel header 2',
    content:
      'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.',
  },
  {
    key: '3',
    header: 'This is panel header 3',
    content:
      'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.',
  },
];

export const Default: Story = {
  render: () => (
    <Collapse defaultActiveKey={['1']}>
      {items.map((item) => (
        <Collapse.Panel header={item.header} key={item.key}>
          <p>{item.content}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  ),
};

export const Accordion: Story = {
  render: () => (
    <Collapse accordion defaultActiveKey={['1']}>
      {items.map((item) => (
        <Collapse.Panel header={item.header} key={item.key}>
          <p>{item.content}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  ),
};

export const Ghost: Story = {
  render: () => (
    <Collapse ghost defaultActiveKey={['1']}>
      {items.map((item) => (
        <Collapse.Panel header={item.header} key={item.key}>
          <p>{item.content}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  ),
};

export const IconPositionEnd: Story = {
  render: () => (
    <Collapse defaultActiveKey={['1']} expandIconPosition="end">
      {items.map((item) => (
        <Collapse.Panel header={item.header} key={item.key}>
          <p>{item.content}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  ),
};

export const Borderless: Story = {
  render: () => (
    <Collapse bordered={false} defaultActiveKey={['1']}>
      {items.map((item) => (
        <Collapse.Panel header={item.header} key={item.key}>
          <p>{item.content}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h4 style={{ marginBottom: 8, color: '#000000d9' }}>Small Size</h4>
        <Collapse size="small" defaultActiveKey={['1']}>
          <Collapse.Panel header="This is small size panel header" key="1">
            <p>
              A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can
              be found as a welcome guest in many households across the world.
            </p>
          </Collapse.Panel>
        </Collapse>
      </div>

      <div>
        <h4 style={{ marginBottom: 8, color: '#000000d9' }}>Medium Size (Default)</h4>
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel header="This is medium size panel header" key="1">
            <p>
              A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can
              be found as a welcome guest in many households across the world.
            </p>
          </Collapse.Panel>
        </Collapse>
      </div>

      <div>
        <h4 style={{ marginBottom: 8, color: '#000000d9' }}>Large Size</h4>
        <Collapse size="large" defaultActiveKey={['1']}>
          <Collapse.Panel header="This is large size panel header" key="1">
            <p>
              A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can
              be found as a welcome guest in many households across the world.
            </p>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  ),
};
