import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConfigProvider, useConfig } from './ConfigProvider';
import { Button } from '../Button';
import { Avatar } from '../Avatar';

const PrefixProbe = () => {
  const { getPrefixCls, prefixCls } = useConfig();

  return (
    <div
      data-testid="prefix-probe"
      data-prefix={prefixCls}
      data-button-prefix={getPrefixCls?.('btn')}
    />
  );
};

describe('ConfigProvider prefixCls', () => {
  it('provides a default prefix', () => {
    render(
      <ConfigProvider>
        <PrefixProbe />
      </ConfigProvider>
    );

    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-prefix', 'atom');
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-button-prefix', 'atom-btn');
  });

  it('provides a custom prefix while keeping atom theme variables for bundled styles', () => {
    const { container } = render(
      <ConfigProvider prefixCls="acme">
        <PrefixProbe />
      </ConfigProvider>
    );

    const provider = container.querySelector('.atom-config-provider.acme-config-provider');

    expect(provider).toBeInTheDocument();
    expect(provider).toHaveStyle({ '--atom-prefix': 'acme' });
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-prefix', 'acme');
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-button-prefix', 'acme-btn');
  });

  it('adds custom-prefixed class aliases while preserving bundled atom styles', () => {
    render(
      <ConfigProvider prefixCls="acme">
        <Button type="primary" loading>
          Save
        </Button>
        <Avatar>FD</Avatar>
      </ConfigProvider>
    );

    const button = screen.getByRole('button');
    const spinner = button.querySelector('.atom-btn-loading-icon');
    const avatar = screen.getByText('FD').closest('span')?.parentElement;

    expect(button).toHaveClass('atom-btn');
    expect(button).toHaveClass('atom-btn-primary');
    expect(button).toHaveClass('acme-btn');
    expect(button).toHaveClass('acme-btn-primary');
    expect(spinner).toHaveClass('atom-btn-loading-icon');
    expect(spinner).toHaveClass('acme-btn-loading-icon');
    expect(avatar).toHaveClass('atom-avatar');
    expect(avatar).toHaveClass('acme-avatar');
  });
});
