import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Collapse } from './Collapse';
import { axe } from 'jest-axe';

describe('Collapse', () => {
  it('renders correctly with default active panel', () => {
    render(
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="Panel 1" key="1">
          <p>Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel header="Panel 2" key="2">
          <p>Content 2</p>
        </Collapse.Panel>
      </Collapse>
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('triggers onChange when a panel header is clicked', () => {
    const onChange = vi.fn();
    render(
      <Collapse onChange={onChange}>
        <Collapse.Panel header="Panel 1" key="1">
          <p>Content 1</p>
        </Collapse.Panel>
      </Collapse>
    );
    fireEvent.click(screen.getByText('Panel 1'));
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('supports accordion mode (single open panel)', () => {
    const onChange = vi.fn();
    render(
      <Collapse accordion onChange={onChange}>
        <Collapse.Panel header="Panel 1" key="1">
          <p>Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel header="Panel 2" key="2">
          <p>Content 2</p>
        </Collapse.Panel>
      </Collapse>
    );
    fireEvent.click(screen.getByText('Panel 1'));
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('renders in ghost mode properly', () => {
    const { container } = render(
      <Collapse ghost>
        <Collapse.Panel header="Panel 1" key="1">
          <p>Content</p>
        </Collapse.Panel>
      </Collapse>
    );
    expect(container.querySelector('.atom-collapse-ghost')).toBeInTheDocument();
  });

  it('passes accessibility tests', async () => {
    const { container } = render(
      <main>
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel header="Panel 1" key="1">
            <p>Content 1</p>
          </Collapse.Panel>
        </Collapse>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
