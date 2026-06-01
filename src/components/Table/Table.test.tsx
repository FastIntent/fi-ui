import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './index';

describe('Table Component', () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];

  const mockData = [
    { key: '1', name: 'John Doe', age: 32 },
    { key: '2', name: 'Jane Smith', age: 28 },
  ];

  it('renders headers and data rows correctly', () => {
    render(<Table columns={columns} data={mockData} />);

    // Verify Column Headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // Verify Row Data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('gracefully renders an empty state when no data is provided', () => {
    render(<Table columns={columns} data={[]} />);

    // rc-table internally renders a placeholder for empty states with our custom prefix
    const emptyWrapper = document.querySelector('.fi-table-placeholder');
    expect(emptyWrapper).toBeInTheDocument();
  });

  it('applies loading class when loading state is true', () => {
    const { container } = render(<Table columns={columns} data={mockData} loading={true} />);
    expect(container.querySelector('.fi-table-loading')).toBeInTheDocument();
  });

  it('renders skeleton cells instead of data when loading', () => {
    const { container } = render(<Table columns={columns} data={mockData} loading={true} />);
    expect(container.querySelector('.fi-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders correct number of skeleton rows', () => {
    const { container } = render(
      <Table columns={columns} data={mockData} loading={true} skeletonRows={3} />
    );
    const rows = container.querySelectorAll('.fi-table-tbody tr');
    expect(rows).toHaveLength(3);
  });
});
