import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';
import { Button } from '../Button';

const meta: Meta<typeof Flex> = {
  title: 'Components/Flex',
  component: Flex,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Basic: Story = {
  args: { gap: 'middle' },
  render: (args) => (
    <Flex {...args}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
    </Flex>
  ),
};

export const Vertical: Story = {
  args: { vertical: true, gap: 'middle' },
  render: (args) => (
    <Flex {...args}>
      <Button type="primary" block>
        Primary
      </Button>
      <Button block>Default</Button>
      <Button type="dashed" block>
        Dashed
      </Button>
    </Flex>
  ),
};

export const JustifyAndAlign: Story = {
  render: () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <Flex justify="center" gap="middle">
        <Button>Center 1</Button>
        <Button>Center 2</Button>
        <Button>Center 3</Button>
      </Flex>
      <Flex justify="space-between" gap="middle">
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </Flex>
      <Flex justify="end" gap="middle">
        <Button>End 1</Button>
        <Button>End 2</Button>
      </Flex>
    </Flex>
  ),
};

export const WrapAndGap: Story = {
  render: () => (
    <Flex wrap gap="small" style={{ width: 300 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <Button key={i}>Button {i + 1}</Button>
      ))}
    </Flex>
  ),
};
