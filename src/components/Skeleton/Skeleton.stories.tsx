import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: { variant: 'text', width: 300 },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 56, height: 56 },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular', width: 400, height: 120 },
};

export const Rounded: Story = {
  args: { variant: 'rounded', width: 400, height: 80 },
};

export const WaveAnimation: Story = {
  args: { variant: 'rectangular', width: 400, height: 80, animation: 'wave' },
};

export const NoAnimation: Story = {
  args: { variant: 'text', width: 300, animation: false },
};

/**
 * Complex skeleton simulating a full dashboard page:
 * - Top stats row (4 metric cards)
 * - Chart area
 * - Data table with header + rows
 * - Sidebar with user profile and nav items
 */
export const ComplexDashboard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, maxWidth: 960 }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Logo */}
        <Skeleton variant="rounded" width={140} height={32} />

        {/* User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Skeleton variant="rounded" width={20} height={20} />
              <Skeleton variant="text" width={`${60 + Math.random() * 30}%`} />
            </div>
          ))}
        </div>

        {/* Bottom card */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton variant="rounded" width="100%" height={80} />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={200} height={24} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton variant="rounded" width={120} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={140} height={20} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Skeleton variant="rounded" width={60} height={28} />
              <Skeleton variant="rounded" width={60} height={28} />
              <Skeleton variant="rounded" width={60} height={28} />
            </div>
          </div>
          <Skeleton variant="rounded" width="100%" height={200} />
        </div>

        {/* Table */}
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px',
              gap: 12,
              padding: '12px 16px',
              background: '#fafafa',
            }}
          >
            <Skeleton variant="rounded" width={16} height={16} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="80%" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px',
                gap: 12,
                padding: '12px 16px',
                borderTop: '1px solid #f0f0f0',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="rounded" width={16} height={16} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="45%" />
                </div>
              </div>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rounded" width={64} height={22} />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="rounded" width={28} height={28} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
