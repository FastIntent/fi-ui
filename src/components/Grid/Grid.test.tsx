import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row, Col } from './index';

describe('Grid Component', () => {
  it('renders Row with children', () => {
    render(
      <Row>
        <Col span={12}>Left</Col>
        <Col span={12}>Right</Col>
      </Row>
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('applies fi-row class to Row', () => {
    const { container } = render(
      <Row>
        <Col span={24}>Content</Col>
      </Row>
    );
    expect(container.firstChild).toHaveClass('fi-row');
  });

  it('applies fi-col class to Col', () => {
    const { container } = render(
      <Row>
        <Col span={12}>Col</Col>
      </Row>
    );
    expect(container.querySelector('.fi-col')).toBeInTheDocument();
  });

  it('applies span class to Col', () => {
    const { container } = render(
      <Row>
        <Col span={8}>Col 8</Col>
      </Row>
    );
    expect(container.querySelector('.fi-col-8')).toBeInTheDocument();
  });

  it('applies gutter spacing to Row', () => {
    const { container } = render(
      <Row gutter={16}>
        <Col span={12}>A</Col>
        <Col span={12}>B</Col>
      </Row>
    );
    const row = container.firstChild as HTMLElement;
    expect(row.style.marginLeft).toBeTruthy();
  });

  it('applies justify class to Row', () => {
    const { container } = render(
      <Row justify="center">
        <Col span={12}>Centered</Col>
      </Row>
    );
    expect(container.firstChild).toHaveClass('fi-row-justify-center');
  });
});
