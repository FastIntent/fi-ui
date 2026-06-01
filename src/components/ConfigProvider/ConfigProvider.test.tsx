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

    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-prefix', 'fi');
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-button-prefix', 'fi-btn');
  });

  it('provides a custom prefix while keeping fi theme variables for bundled styles', () => {
    const { container } = render(
      <ConfigProvider prefixCls="acme">
        <PrefixProbe />
      </ConfigProvider>
    );

    const provider = container.querySelector('.fi-config-provider.acme-config-provider');

    expect(provider).toBeInTheDocument();
    expect(provider).toHaveStyle({ '--fi-prefix': 'acme' });
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-prefix', 'acme');
    expect(screen.getByTestId('prefix-probe')).toHaveAttribute('data-button-prefix', 'acme-btn');
  });

  it('adds custom-prefixed class aliases while preserving bundled fi styles', () => {
    render(
      <ConfigProvider prefixCls="acme">
        <Button type="primary" loading>
          Save
        </Button>
        <Avatar>FD</Avatar>
      </ConfigProvider>
    );

    const button = screen.getByRole('button');
    const spinner = button.querySelector('.fi-btn-loading-icon');
    const avatar = screen.getByText('FD').closest('span')?.parentElement;

    expect(button).toHaveClass('fi-btn');
    expect(button).toHaveClass('fi-btn-primary');
    expect(button).toHaveClass('acme-btn');
    expect(button).toHaveClass('acme-btn-primary');
    expect(spinner).toHaveClass('fi-btn-loading-icon');
    expect(spinner).toHaveClass('acme-btn-loading-icon');
    expect(avatar).toHaveClass('fi-avatar');
    expect(avatar).toHaveClass('acme-avatar');
  });
});
