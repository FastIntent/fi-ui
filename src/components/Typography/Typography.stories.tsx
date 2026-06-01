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
      <Title>h1. fi-ui</Title>
      <Title level={2}>h2. fi-ui</Title>
      <Title level={3}>h3. fi-ui</Title>
      <Title level={4}>h4. fi-ui</Title>
      <Title level={5}>h5. fi-ui</Title>
    </>
  ),
};

export const Texts: StoryObj<typeof Text> = {
  render: () => (
    <>
      <Title level={4}>Text Styles</Title>
      <Text>fi-ui (default)</Text>
      <br />
      <Text color="secondary">fi-ui (secondary)</Text>
      <br />
      <Text color="success">fi-ui (success)</Text>
      <br />
      <Text color="warning">fi-ui (warning)</Text>
      <br />
      <Text color="error">fi-ui (danger)</Text>
      <br />
      <Text disabled>fi-ui (disabled)</Text>
      <br />
      <Text strong>fi-ui (strong)</Text>
      <br />
      <Text italic>fi-ui (italic)</Text>
      <br />
      <Text underline>fi-ui (underline)</Text>
      <br />
      <Text delete>fi-ui (delete)</Text>
    </>
  ),
};

export const Paragraphs: StoryObj<typeof Paragraph> = {
  render: () => (
    <>
      <Paragraph>
        fi-ui provides a set of high-quality components for building modern user interfaces.
      </Paragraph>
      <Paragraph color="secondary">
        fi-ui provides a set of high-quality components for building modern user interfaces.
      </Paragraph>
    </>
  ),
};
