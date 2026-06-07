import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { InputNumber } from '../InputNumber/InputNumber';
import { DatePicker } from '../DatePicker/DatePicker';

const meta: Meta = {
  title: 'Components/Floating Label',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Todos los componentes de formulario soportan la prop `floating` para activar el modo de label flotante. ' +
          'El label se muestra dentro del input y flota hacia arriba cuando el campo tiene foco o valor.',
      },
    },
  },
};

export default meta;

export const InputFloating: StoryObj = {
  name: 'Input',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <Input floating label="Username" />
      <Input floating label="Email" type="email" />
      <Input floating label="Password" type="password" />
      <Input floating label="With error" status="error" />
    </div>
  ),
};

export const SelectFloating: StoryObj = {
  name: 'Select',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <Select
        floating
        label="Country"
        options={[
          { value: 'mx', label: 'Mexico' },
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'br', label: 'Brazil' },
        ]}
      />
      <Select
        floating
        label="Language"
        options={[
          { value: 'es', label: 'Español' },
          { value: 'en', label: 'English' },
          { value: 'pt', label: 'Português' },
        ]}
      />
    </div>
  ),
};

export const InputNumberFloating: StoryObj = {
  name: 'InputNumber',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <InputNumber floating label="Quantity" style={{ width: '100%' }} />
      <InputNumber floating label="Price" min={0} step={0.01} style={{ width: '100%' }} />
    </div>
  ),
};

export const DatePickerFloating: StoryObj = {
  name: 'DatePicker',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <DatePicker floating label="Start Date" style={{ width: '100%' }} />
      <DatePicker floating label="End Date" style={{ width: '100%' }} />
    </div>
  ),
};

export const Sizes: StoryObj = {
  name: 'Sizes',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <Input floating label="Small Input" size="small" />
      <Input floating label="Middle Input (default)" />
      <Input floating label="Large Input" size="large" />
    </div>
  ),
};

export const CustomLabelColor: StoryObj = {
  name: 'Custom Label Color',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, width: '100%' }}
    >
      <Input floating label="Nombre del evento" labelColor="#e65100" />
      <Input floating label="Email corporativo" labelColor="#1565c0" />
      <Select
        floating
        label="Categoría"
        labelColor="#2e7d32"
        options={[
          { value: 'tech', label: 'Tecnología' },
          { value: 'design', label: 'Diseño' },
          { value: 'marketing', label: 'Marketing' },
        ]}
      />
      <InputNumber floating label="Presupuesto" labelColor="#6a1b9a" style={{ width: '100%' }} />
      <DatePicker floating label="Fecha límite" labelColor="#c62828" style={{ width: '100%' }} />
    </div>
  ),
};

export const FormExample: StoryObj = {
  name: 'Form Example',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        maxWidth: 400,
        width: '100%',
        padding: 24,
        border: '1px solid #e8e8e8',
        borderRadius: 8,
      }}
    >
      <h3 style={{ margin: 0 }}>Registration</h3>
      <Input floating label="Full Name" />
      <Input floating label="Email Address" type="email" />
      <Input floating label="Password" type="password" />
      <Select
        floating
        label="Role"
        options={[
          { value: 'dev', label: 'Developer' },
          { value: 'design', label: 'Designer' },
          { value: 'pm', label: 'Project Manager' },
        ]}
      />
      <InputNumber
        floating
        label="Years of Experience"
        min={0}
        max={50}
        style={{ width: '100%' }}
      />
      <DatePicker floating label="Date of Birth" style={{ width: '100%' }} />
    </div>
  ),
};
