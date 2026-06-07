import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Text, Paragraph } from './Typography';

const meta: Meta<typeof Title> = {
  title: 'Components/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Headers: StoryObj<typeof Title> = {
  render: () => (
    <>
      <Title>h1. Atomize UI</Title>
      <Title level={2}>h2. Atomize UI</Title>
      <Title level={3}>h3. Atomize UI</Title>
      <Title level={4}>h4. Atomize UI</Title>
      <Title level={5}>h5. Atomize UI</Title>
    </>
  ),
};

export const Texts: StoryObj<typeof Text> = {
  render: () => (
    <>
      <Title level={4}>Text Styles</Title>
      <Text>Atomize UI (default)</Text>
      <br />
      <Text color="secondary">Atomize UI (secondary)</Text>
      <br />
      <Text color="success">Atomize UI (success)</Text>
      <br />
      <Text color="warning">Atomize UI (warning)</Text>
      <br />
      <Text color="error">Atomize UI (danger)</Text>
      <br />
      <Text disabled>Atomize UI (disabled)</Text>
      <br />
      <Text strong>Atomize UI (strong)</Text>
      <br />
      <Text italic>Atomize UI (italic)</Text>
      <br />
      <Text underline>Atomize UI (underline)</Text>
      <br />
      <Text delete>Atomize UI (delete)</Text>
    </>
  ),
};

export const Paragraphs: StoryObj<typeof Paragraph> = {
  render: () => (
    <>
      <Paragraph>
        Atomize UI provides a set of high-quality components for building modern user interfaces.
      </Paragraph>
      <Paragraph color="secondary">
        Atomize UI provides a set of high-quality components for building modern user interfaces.
      </Paragraph>
    </>
  ),
};
