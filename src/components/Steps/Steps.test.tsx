import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Steps } from './index';

describe('Steps Component', () => {
  it('renders all step titles', () => {
    render(
      <Steps current={1}>
        <Steps.Step title="Account" description="Create account" />
        <Steps.Step title="Profile" description="Set up profile" />
        <Steps.Step title="Done" description="All done" />
      </Steps>
    );
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(
      <Steps current={0}>
        <Steps.Step title="Step 1" description="First step description" />
      </Steps>
    );
    expect(screen.getByText('First step description')).toBeInTheDocument();
  });

  it('applies correct status classes based on current', () => {
    const { container } = render(
      <Steps current={1}>
        <Steps.Step title="Finish" />
        <Steps.Step title="Process" />
        <Steps.Step title="Wait" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-item-status-finish')).toBeInTheDocument();
    expect(container.querySelector('.atom-steps-item-status-process')).toBeInTheDocument();
    expect(container.querySelector('.atom-steps-item-status-wait')).toBeInTheDocument();
  });

  it('applies vertical direction class', () => {
    const { container } = render(
      <Steps direction="vertical" current={0}>
        <Steps.Step title="Step 1" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-vertical')).toBeInTheDocument();
  });

  it('applies error status class when a step has status="error"', () => {
    const { container } = render(
      <Steps current={1}>
        <Steps.Step title="Done" />
        <Steps.Step title="Failed" status="error" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-item-status-error')).toBeInTheDocument();
  });
});

describe('Steps — variant="detailed"', () => {
  it('renders the detailed container class', () => {
    const { container } = render(
      <Steps current={0} variant="detailed">
        <Steps.Step title="Paso 1" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-detailed')).toBeInTheDocument();
  });

  it('renders detailed item class for each step', () => {
    const { container } = render(
      <Steps current={1} variant="detailed">
        <Steps.Step title="Paso 1" />
        <Steps.Step title="Paso 2" />
        <Steps.Step title="Paso 3" />
      </Steps>
    );
    expect(container.querySelectorAll('.atom-steps-item-detailed')).toHaveLength(3);
  });

  it('applies correct status modifier classes', () => {
    const { container } = render(
      <Steps current={1} variant="detailed">
        <Steps.Step title="Listo" />
        <Steps.Step title="En curso" />
        <Steps.Step title="Pendiente" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-item-detailed-finish')).toBeInTheDocument();
    expect(container.querySelector('.atom-steps-item-detailed-process')).toBeInTheDocument();
    expect(container.querySelector('.atom-steps-item-detailed-wait')).toBeInTheDocument();
  });

  it('renders children inside the aside section', () => {
    render(
      <Steps current={0} variant="detailed">
        <Steps.Step title="Paso">
          <span>archivo.json</span>
          <span>✓ Completado</span>
          <span>512ms</span>
        </Steps.Step>
      </Steps>
    );
    expect(screen.getByText('archivo.json')).toBeInTheDocument();
    expect(screen.getByText('✓ Completado')).toBeInTheDocument();
    expect(screen.getByText('512ms')).toBeInTheDocument();
  });

  it('renders checkmark inside icon for finish steps and number for others', () => {
    const { container } = render(
      <Steps current={2} variant="detailed">
        <Steps.Step title="Hecho" />
        <Steps.Step title="Hecho también" />
        <Steps.Step title="En curso" />
        <Steps.Step title="Pendiente" />
      </Steps>
    );
    const icons = container.querySelectorAll('.atom-steps-item-detailed-icon');
    expect(icons[0].textContent).toBe('✓'); // finish
    expect(icons[1].textContent).toBe('✓'); // finish
    expect(icons[2].textContent).toBe('3'); // process
    expect(icons[3].textContent).toBe('4'); // wait
  });

  it('does not show step numbers in body by default', () => {
    const { container } = render(
      <Steps current={2} variant="detailed">
        <Steps.Step title="Hecho" />
        <Steps.Step title="En curso" />
      </Steps>
    );
    expect(container.querySelectorAll('.atom-steps-item-detailed-step-number')).toHaveLength(0);
  });

  it('shows step numbers in body when showStepNumber=true on Steps', () => {
    const { container } = render(
      <Steps current={2} variant="detailed" showStepNumber>
        <Steps.Step title="Hecho" />
        <Steps.Step title="Hecho también" />
        <Steps.Step title="En curso" />
      </Steps>
    );
    const numbers = container.querySelectorAll('.atom-steps-item-detailed-step-number');
    expect(numbers).toHaveLength(3);
    expect(numbers[0].textContent).toBe('1');
    expect(numbers[1].textContent).toBe('2');
    expect(numbers[2].textContent).toBe('3');
  });

  it('allows per-step override of showStepNumber', () => {
    const { container } = render(
      <Steps current={1} variant="detailed" showStepNumber={false}>
        <Steps.Step title="Hecho" showStepNumber />
        <Steps.Step title="En curso" />
      </Steps>
    );
    const numbers = container.querySelectorAll('.atom-steps-item-detailed-step-number');
    expect(numbers).toHaveLength(1);
    expect(numbers[0].textContent).toBe('1');
  });

  it('allows overriding stepNumber via prop', () => {
    const { container } = render(
      <Steps current={0} variant="detailed">
        <Steps.Step title="Custom" stepNumber={42} />
      </Steps>
    );
    const icon = container.querySelector('.atom-steps-item-detailed-icon');
    expect(icon?.textContent).toBe('42');
  });

  it('does not render aside section when no children are provided', () => {
    const { container } = render(
      <Steps current={0} variant="detailed">
        <Steps.Step title="Solo título" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-item-detailed-aside')).not.toBeInTheDocument();
  });

  it('does not break default variant when detailed is not set', () => {
    const { container } = render(
      <Steps current={1}>
        <Steps.Step title="A" />
        <Steps.Step title="B" />
      </Steps>
    );
    expect(container.querySelector('.atom-steps-horizontal')).toBeInTheDocument();
    expect(container.querySelector('.atom-steps-detailed')).not.toBeInTheDocument();
  });
});
