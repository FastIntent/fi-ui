import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex } from './index';

describe('Flex Component', () => {
  it('renders children correctly', () => {
    render(
      <Flex>
        <span>Child</span>
      </Flex>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies base prefix class', () => {
    const { container } = render(
      <Flex>
        <span>A</span>
      </Flex>
    );
    expect(container.firstChild).toHaveClass('atom-flex');
  });

  it('applies block class when block is true', () => {
    const { container } = render(
      <Flex block>
        <span>A</span>
      </Flex>
    );
    expect(container.firstChild).toHaveClass('atom-flex-block');
  });

  it('sets flexDirection column when vertical is true', () => {
    const { container } = render(
      <Flex vertical>
        <span>A</span>
      </Flex>
    );
    expect((container.firstChild as HTMLElement).style.flexDirection).toBe('column');
  });

  it('sets gap from size token', () => {
    const { container } = render(
      <Flex gap="large">
        <span>A</span>
      </Flex>
    );
    expect((container.firstChild as HTMLElement).style.gap).toBe('24px');
  });

  it('sets gap from numeric value', () => {
    const { container } = render(
      <Flex gap={12}>
        <span>A</span>
      </Flex>
    );
    expect((container.firstChild as HTMLElement).style.gap).toBe('12px');
  });

  it('sets justify and align styles', () => {
    const { container } = render(
      <Flex justify="center" align="center">
        <span>A</span>
      </Flex>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.justifyContent).toBe('center');
    expect(el.style.alignItems).toBe('center');
  });

  it('sets wrap style', () => {
    const { container } = render(
      <Flex wrap>
        <span>A</span>
      </Flex>
    );
    expect((container.firstChild as HTMLElement).style.flexWrap).toBe('wrap');
  });

  it('forwards ref to the div element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Flex ref={ref}>
        <span>A</span>
      </Flex>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
