import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Application</BreadcrumbItem>
      <BreadcrumbItem>Detail</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Users</BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator=">">
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Settings</BreadcrumbItem>
      <BreadcrumbItem>Security</BreadcrumbItem>
    </Breadcrumb>
  ),
};
