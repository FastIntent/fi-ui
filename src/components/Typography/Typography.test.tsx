import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Title, Text, Paragraph } from './index';

describe('Typography Components', () => {
  describe('Title', () => {
    it('renders with default h1 tag', () => {
      render(<Title>Page Title</Title>);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders correct heading level', () => {
      render(<Title level={3}>Section Title</Title>);
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('applies strong class', () => {
      const { container } = render(<Title strong>Bold</Title>);
      expect(container.firstChild).toHaveClass('fi-typography-strong');
    });
  });

  describe('Text', () => {
    it('renders text content', () => {
      render(<Text>Inline text</Text>);
      expect(screen.getByText('Inline text')).toBeInTheDocument();
    });

    it('renders as <span> by default', () => {
      const { container } = render(<Text>Text</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('applies secondary color class', () => {
      const { container } = render(<Text color="secondary">Muted</Text>);
      expect(container.firstChild).toHaveClass('fi-typography-secondary');
    });

    it('applies italic class', () => {
      const { container } = render(<Text italic>Italic</Text>);
      expect(container.firstChild).toHaveClass('fi-typography-italic');
    });

    it('applies underline class', () => {
      const { container } = render(<Text underline>Underline</Text>);
      expect(container.firstChild).toHaveClass('fi-typography-underline');
    });

    it('applies delete class', () => {
      const { container } = render(<Text delete>Deleted</Text>);
      expect(container.firstChild).toHaveClass('fi-typography-delete');
    });
  });

  describe('Paragraph', () => {
    it('renders paragraph content', () => {
      render(<Paragraph>A full paragraph of text.</Paragraph>);
      expect(screen.getByText('A full paragraph of text.')).toBeInTheDocument();
    });

    it('renders as <p> tag', () => {
      const { container } = render(<Paragraph>Content</Paragraph>);
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('applies success color class', () => {
      const { container } = render(<Paragraph color="success">Success</Paragraph>);
      expect(container.firstChild).toHaveClass('fi-typography-success');
    });
  });
});
