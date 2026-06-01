import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'jest-axe';
import { Popover } from './Popover';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SimplePopover = (props: Partial<React.ComponentProps<typeof Popover>> = {}) => (
  <Popover title="Card Title" content="Card content" trigger={['click']} {...props}>
    <button type="button">Open</button>
  </Popover>
);

// ---------------------------------------------------------------------------
// Render & Content
// ---------------------------------------------------------------------------
describe('Popover — rendering', () => {
  it('renders the trigger child without opening the popover', () => {
    render(<SimplePopover />);
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('renders title and content after clicking the trigger', async () => {
    render(<SimplePopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => {
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });
  });

  it('renders ReactNode title and content', async () => {
    render(
      <Popover
        title={<strong data-testid="rich-title">Rich Title</strong>}
        content={<em data-testid="rich-body">Rich body</em>}
        trigger={['click']}
      >
        <button type="button">Open Rich</button>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open Rich' }));
    await waitFor(() => {
      expect(screen.getByTestId('rich-title')).toBeInTheDocument();
      expect(screen.getByTestId('rich-body')).toBeInTheDocument();
    });
  });

  it('does not render title section when title prop is absent', async () => {
    render(
      <Popover content="Body only" trigger={['click']}>
        <button type="button">Open</button>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => {
      expect(screen.queryByText('Card Title')).not.toBeInTheDocument();
      expect(screen.getByText('Body only')).toBeInTheDocument();
    });
  });

  it('does not render content section when content prop is absent', async () => {
    render(
      <Popover title="Title only" trigger={['click']}>
        <button type="button">Open</button>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => {
      expect(screen.getByText('Title only')).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Controlled mode
// ---------------------------------------------------------------------------
describe('Popover — controlled', () => {
  it('respects the open prop to show/hide', async () => {
    const { rerender } = render(<SimplePopover open={false} />);
    expect(screen.queryByText('Card Title')).not.toBeInTheDocument();

    rerender(<SimplePopover open={true} />);
    await waitFor(() => {
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange when visibility changes', async () => {
    const onOpenChange = vi.fn();
    render(<SimplePopover trigger={['click']} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------
describe('Popover — placement', () => {
  it.each([
    'top',
    'bottom',
    'left',
    'right',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ] as const)('renders with placement="%s" without throwing', (placement) => {
    expect(() =>
      render(
        <Popover title="T" content="C" placement={placement} trigger={['click']}>
          <button type="button">Trigger</button>
        </Popover>
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Custom color
// ---------------------------------------------------------------------------
describe('Popover — custom color', () => {
  it('applies custom bg color as CSS custom property', () => {
    const { container } = render(
      <Popover title="T" content="C" color="#ff0000" open={true} trigger={['click']}>
        <button type="button">Trigger</button>
      </Popover>
    );
    // The wrapper style should contain the CSS variable
    const wrapper = container.querySelector('.fi-popover-wrapper') as HTMLElement | null;
    if (wrapper) {
      expect(wrapper.style.getPropertyValue('--fi-popover-bg')).toBe('#ff0000');
    }
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe('Popover — accessibility', () => {
  it('trigger button has no violations in closed state', async () => {
    const { container } = render(
      <main>
        <SimplePopover />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('popover content has no violations when open', async () => {
    const { container } = render(
      <main>
        <SimplePopover open={true} />
      </main>
    );
    await waitFor(() => screen.getByText('Card Title'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
