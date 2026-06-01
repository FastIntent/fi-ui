import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './index';

describe('Pagination Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Pagination total={100} />);
    expect(container.querySelector('.fi-pagination')).toBeInTheDocument();
  });

  it('renders the correct number of page items for total=50 pageSize=10', () => {
    const { container } = render(<Pagination total={50} defaultPageSize={10} />);
    // 5 page items
    expect(container.querySelectorAll('.fi-pagination-item')).toHaveLength(5);
  });

  it('calls onChange when a page item is clicked', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Pagination total={50} defaultPageSize={10} onChange={onChange} />
    );
    const page2 = container.querySelector('.fi-pagination-item-2') as HTMLElement;
    fireEvent.click(page2);
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });

  it('applies small size class', () => {
    const { container } = render(<Pagination total={100} size="small" />);
    expect(container.querySelector('.fi-pagination-small')).toBeInTheDocument();
  });

  it('applies start alignment class by default', () => {
    const { container } = render(<Pagination total={50} />);
    expect(container.querySelector('.fi-pagination-start')).toBeInTheDocument();
  });

  it('applies center alignment class', () => {
    const { container } = render(<Pagination total={50} align="center" />);
    expect(container.querySelector('.fi-pagination-center')).toBeInTheDocument();
  });
});
