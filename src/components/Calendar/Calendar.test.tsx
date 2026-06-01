import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { Calendar } from './index';

const fixedDate = dayjs('2026-05-13');

describe('Calendar Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar defaultValue={fixedDate} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies base calendar class', () => {
    const { container } = render(<Calendar defaultValue={fixedDate} />);
    expect(container.firstChild).toHaveClass('fi-calendar');
  });

  it('applies full class by default', () => {
    const { container } = render(<Calendar defaultValue={fixedDate} />);
    expect(container.firstChild).toHaveClass('fi-calendar-full');
  });

  it('applies mini class when fullscreen is false', () => {
    const { container } = render(<Calendar defaultValue={fixedDate} fullscreen={false} />);
    expect(container.firstChild).toHaveClass('fi-calendar-mini');
  });

  it('applies custom className', () => {
    const { container } = render(<Calendar defaultValue={fixedDate} className="my-calendar" />);
    expect(container.firstChild).toHaveClass('fi-calendar', 'my-calendar');
  });

  it('renders weekday headers', () => {
    render(<Calendar defaultValue={fixedDate} />);
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Fr')).toBeInTheDocument();
  });

  it('renders day numbers', () => {
    render(<Calendar defaultValue={fixedDate} />);
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });

  it('renders mode switch buttons', () => {
    render(<Calendar defaultValue={fixedDate} />);
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('calls onChange when a date is clicked', () => {
    const onChange = vi.fn();
    render(<Calendar defaultValue={fixedDate} onChange={onChange} />);
    fireEvent.click(screen.getByText('15'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('switches to year mode when Year button is clicked', () => {
    render(<Calendar defaultValue={fixedDate} />);
    fireEvent.click(screen.getByText('Year'));
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });

  it('renders cellRender content', () => {
    render(
      <Calendar
        defaultValue={fixedDate}
        cellRender={(date) => {
          if (date.date() === 10) return <span data-testid="event">Event</span>;
          return null;
        }}
      />
    );
    expect(screen.getByTestId('event')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Calendar ref={ref} defaultValue={fixedDate} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
