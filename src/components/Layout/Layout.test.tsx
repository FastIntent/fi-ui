import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './Layout';

describe('Layout Component', () => {
  it('renders children inside the main content area', () => {
    render(
      <Layout>
        <p>Page content</p>
      </Layout>
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the title in the header', () => {
    render(<Layout title="My App" />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('renders notification badge when notificationCount > 0', () => {
    const { container } = render(<Layout showNotifications notificationCount={5} />);
    expect(container.querySelector('.fi-layout-badge')).toBeInTheDocument();
    expect(container.querySelector('.fi-layout-badge')?.textContent).toBe('5');
  });

  it('calls onCollapse when the toggle button is clicked', () => {
    const onCollapse = vi.fn();
    const { container } = render(<Layout onCollapse={onCollapse} />);
    const trigger = container.querySelector('.fi-layout-collapse-trigger') as HTMLElement;
    fireEvent.click(trigger);
    expect(onCollapse).toHaveBeenCalledWith(true);
  });

  it('renders footer when footerRender is provided', () => {
    render(<Layout footerRender={<footer>Footer content</footer>} />);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders user name when userInfo is provided', () => {
    render(<Layout userInfo={{ name: 'John Doe' }} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
