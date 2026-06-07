/**
 * SSR / Next.js App Router Compatibility Suite
 *
 * Validates that Atomize UI components are safe for server-side rendering.
 * Strategy mirrors what Next.js does internally:
 *   1. renderToString()  — simulates the Server Component / SSR pass.
 *   2. hydrateRoot()     — simulates the Client Component hydration pass.
 *   3. Ensures no browser-only APIs (window, document, navigator) are
 *      called at module-level or during the synchronous render phase.
 *
 * These tests run in happy-dom (configured in vitest.config.ts), which
 * provides a DOM environment but deliberately lacks many browser-only
 * globals so SSR violations are caught early.
 */

import React from 'react';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  // Primitives
  Button,
  Input,
  TextArea,
  Alert,
  Badge,
  Tag,
  Avatar,
  Spin,
  Skeleton,
  Empty,
  Result,
  Divider,
  // Layout
  Card,
  Space,
  Row,
  Col,
  // Navigation
  Breadcrumb,
  Pagination,
  Steps,
  Tabs,
  // Overlay
  Modal,
  Drawer,
  Tooltip,
  Popover,
  // Form
  Checkbox,
  Radio,
  Switch,
  Slider,
  Rate,
  Select,
  Option,
  InputNumber,
  // Feedback
  Progress,
  Timeline,
  // Typography
  Title as TypographyTitle,
  Text as TypographyText,
  Paragraph as TypographyParagraph,
  // Compound
  Collapse,
  Table,
  // notification (imperative API)
  notification,
} from './index';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ssrHydrate(ui: React.ReactElement): Promise<{
  html: string;
  warnings: string[];
}> {
  const warnings: string[] = [];
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.join(' ');
    if (message.includes('Hydration') || message.includes('did not match')) {
      warnings.push(message);
      return;
    }
    originalConsoleError(...args);
  };

  const html = renderToString(ui);
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  await act(async () => {
    hydrateRoot(container, ui);
  });

  console.error = originalConsoleError;
  document.body.removeChild(container);
  return { html, warnings };
}

// ---------------------------------------------------------------------------
// Suite 1 — renderToString (Server Pass)
// ---------------------------------------------------------------------------

describe('SSR — renderToString (server pass)', () => {
  // ── Primitives ──────────────────────────────────────────────────────────

  it('Button', () => {
    const html = renderToString(<Button type="primary">Book</Button>);
    expect(html).toContain('Book');
    expect(html).toContain('atom-btn');
  });

  it('Input', () => {
    const html = renderToString(<Input placeholder="Search" aria-label="Search" />);
    expect(html).toContain('atom-input');
  });

  it('TextArea', () => {
    const html = renderToString(<TextArea rows={3} placeholder="Describe your idea" />);
    expect(html).toContain('atom-input-textarea');
  });

  it('Alert', () => {
    const html = renderToString(<Alert type="warning" message="Session expiring" />);
    expect(html).toContain('Session expiring');
  });

  it('Badge', () => {
    const html = renderToString(
      <Badge count={9}>
        <span>Inbox</span>
      </Badge>
    );
    expect(html).toContain('Inbox');
  });

  it('Tag', () => {
    const html = renderToString(<Tag color="processing">In progress</Tag>);
    expect(html).toContain('In progress');
  });

  it('Avatar', () => {
    const html = renderToString(<Avatar size={40}>AG</Avatar>);
    expect(html).toContain('AG');
  });

  it('Spin (spinning)', () => {
    const html = renderToString(<Spin spinning />);
    expect(html).toContain('atom-spin');
  });

  it('Spin (not spinning)', () => {
    const html = renderToString(<Spin spinning={false} />);
    expect(html).not.toContain('atom-spin-spinning');
  });

  it('Skeleton', () => {
    const html = renderToString(<Skeleton />);
    expect(html).toContain('atom-skeleton');
  });

  it('Empty', () => {
    const html = renderToString(<Empty description="No data found" />);
    expect(html).toContain('No data found');
  });

  it('Result', () => {
    const html = renderToString(<Result status="success" title="Done" />);
    expect(html).toContain('Done');
  });

  it('Divider', () => {
    const html = renderToString(<Divider>Section</Divider>);
    expect(html).toContain('Section');
  });

  // ── Layout ───────────────────────────────────────────────────────────────

  it('Card', () => {
    const html = renderToString(<Card title="Server Card">Content</Card>);
    expect(html).toContain('Server Card');
    expect(html).toContain('Content');
  });

  it('Space', () => {
    const html = renderToString(
      <Space>
        <Button>A</Button>
        <Button>B</Button>
      </Space>
    );
    expect(html).toContain('atom-space');
  });

  it('Row + Col', () => {
    const html = renderToString(
      <Row gutter={16}>
        <Col span={12}>Left</Col>
        <Col span={12}>Right</Col>
      </Row>
    );
    expect(html).toContain('Left');
    expect(html).toContain('Right');
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  it('Breadcrumb', () => {
    const html = renderToString(
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Docs</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(html).toContain('Home');
    expect(html).toContain('Docs');
  });

  it('Pagination', () => {
    const html = renderToString(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(html).toContain('atom-pagination');
  });

  it('Steps', () => {
    const html = renderToString(
      <Steps current={1}>
        <Steps.Step title="Done" />
        <Steps.Step title="Active" />
        <Steps.Step title="Pending" />
      </Steps>
    );
    expect(html).toContain('Done');
    expect(html).toContain('Active');
  });

  it('Steps detailed variant', () => {
    const html = renderToString(
      <Steps current={0} variant="detailed">
        <Steps.Step title="Generate" description="Building schema" />
        <Steps.Step title="Deploy" description="Pushing artifacts" />
      </Steps>
    );
    expect(html).toContain('Generate');
    expect(html).toContain('Building schema');
  });

  it('Tabs', () => {
    const html = renderToString(
      <Tabs
        defaultActiveKey="1"
        items={[
          { key: '1', label: 'Overview', children: 'Overview content' },
          { key: '2', label: 'Details', children: 'Details content' },
        ]}
      />
    );
    expect(html).toContain('Overview');
  });

  // ── Overlay ──────────────────────────────────────────────────────────────

  it('Modal (closed) renders no dialog content', () => {
    const html = renderToString(
      <Modal open={false} title="Confirm">
        <p>Are you sure?</p>
      </Modal>
    );
    expect(html).not.toContain('Are you sure?');
  });

  it('Drawer (closed) renders no panel content', () => {
    const html = renderToString(
      <Drawer open={false} title="Settings">
        <p>Panel</p>
      </Drawer>
    );
    expect(html).not.toContain('Panel');
  });

  it('Tooltip', () => {
    const html = renderToString(
      <Tooltip title="Copy to clipboard">
        <Button>Copy</Button>
      </Tooltip>
    );
    expect(html).toContain('Copy');
  });

  it('Popover', () => {
    const html = renderToString(
      <Popover content={<span>Popover body</span>} title="Info">
        <Button>Hover me</Button>
      </Popover>
    );
    expect(html).toContain('Hover me');
  });

  // ── Form controls ────────────────────────────────────────────────────────

  it('Checkbox', () => {
    const html = renderToString(<Checkbox>Accept terms</Checkbox>);
    expect(html).toContain('Accept terms');
  });

  it('Radio', () => {
    const html = renderToString(<Radio value="a">Option A</Radio>);
    expect(html).toContain('Option A');
  });

  it('Switch', () => {
    const html = renderToString(<Switch aria-label="Toggle feature" />);
    expect(html).toContain('atom-switch');
  });

  it('Slider', () => {
    const html = renderToString(<Slider defaultValue={50} aria-label="Volume" />);
    expect(html).toContain('atom-slider');
  });

  it('Rate', () => {
    const html = renderToString(<Rate defaultValue={3} aria-label="Rating" />);
    expect(html).toContain('atom-rate');
  });

  it('Select', () => {
    const html = renderToString(
      <Select defaultValue="react" aria-label="Framework">
        <Option value="react">React</Option>
        <Option value="vue">Vue</Option>
      </Select>
    );
    expect(html).toBeTruthy();
  });

  it('InputNumber', () => {
    const html = renderToString(<InputNumber defaultValue={42} aria-label="Quantity" />);
    expect(html).toContain('atom-input-number');
  });

  // ── Feedback ─────────────────────────────────────────────────────────────

  it('Progress', () => {
    const html = renderToString(<Progress percent={65} />);
    expect(html).toContain('atom-progress');
  });

  it('Timeline', () => {
    const html = renderToString(
      <Timeline>
        <Timeline.Item>Step one</Timeline.Item>
        <Timeline.Item>Step two</Timeline.Item>
      </Timeline>
    );
    expect(html).toContain('Step one');
    expect(html).toContain('Step two');
  });

  // ── Typography ───────────────────────────────────────────────────────────

  it('Typography.Title', () => {
    const html = renderToString(<TypographyTitle level={2}>Hello SSR</TypographyTitle>);
    expect(html).toContain('Hello SSR');
    expect(html).toContain('h2');
  });

  it('Typography.Paragraph', () => {
    const html = renderToString(<TypographyParagraph>Body text</TypographyParagraph>);
    expect(html).toContain('Body text');
  });

  // ── Compound ─────────────────────────────────────────────────────────────

  it('Collapse', () => {
    const html = renderToString(
      <Collapse items={[{ key: '1', header: 'FAQ', children: 'Answer here' }]} />
    );
    expect(html).toContain('FAQ');
  });

  it('Table', () => {
    const html = renderToString(
      <Table
        columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }]}
        data={[{ key: '1', name: 'Alice' }]}
      />
    );
    expect(html).toContain('Name');
    expect(html).toContain('Alice');
  });
});

// ---------------------------------------------------------------------------
// Suite 2 — Hydration (no mismatches)
// ---------------------------------------------------------------------------

describe('SSR — hydrateRoot (no hydration mismatches)', () => {
  it('Button', async () => {
    const { warnings } = await ssrHydrate(<Button type="primary">Confirm</Button>);
    expect(warnings).toHaveLength(0);
  });

  it('Alert', async () => {
    const { warnings } = await ssrHydrate(<Alert type="success" message="Confirmed." />);
    expect(warnings).toHaveLength(0);
  });

  it('Card', async () => {
    const { warnings } = await ssrHydrate(<Card title="Hydration Card">Content</Card>);
    expect(warnings).toHaveLength(0);
  });

  it('Tag', async () => {
    const { warnings } = await ssrHydrate(<Tag color="success">Approved</Tag>);
    expect(warnings).toHaveLength(0);
  });

  it('Badge', async () => {
    const { warnings } = await ssrHydrate(
      <Badge count={5}>
        <span>Msgs</span>
      </Badge>
    );
    expect(warnings).toHaveLength(0);
  });

  it('Steps', async () => {
    const { warnings } = await ssrHydrate(
      <Steps current={1}>
        <Steps.Step title="Done" />
        <Steps.Step title="Active" />
      </Steps>
    );
    expect(warnings).toHaveLength(0);
  });

  it('Progress', async () => {
    const { warnings } = await ssrHydrate(<Progress percent={40} />);
    expect(warnings).toHaveLength(0);
  });

  it('Checkbox', async () => {
    const { warnings } = await ssrHydrate(<Checkbox>Accept</Checkbox>);
    expect(warnings).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Suite 3 — Browser-global guard audit (window = undefined)
// ---------------------------------------------------------------------------

describe('SSR — browser-global guard audit', () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    originalWindow = globalThis.window;
    // @ts-expect-error intentionally simulating SSR
    delete globalThis.window;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  const cases: Array<[string, React.ReactElement]> = [
    ['Button', <Button>Safe</Button>],
    ['Input', <Input placeholder="Safe" />],
    ['TextArea', <TextArea rows={2} />],
    ['Alert', <Alert message="Safe" type="info" />],
    ['Tag', <Tag>Safe</Tag>],
    [
      'Badge',
      <Badge count={1}>
        <span>X</span>
      </Badge>,
    ],
    ['Card', <Card title="Safe">Body</Card>],
    ['Checkbox', <Checkbox>Safe</Checkbox>],
    ['Switch', <Switch aria-label="safe" />],
    ['Progress', <Progress percent={50} />],
    ['Skeleton', <Skeleton />],
    ['Empty', <Empty />],
    [
      'Steps',
      <Steps current={0}>
        <Steps.Step title="S" />
      </Steps>,
    ],
    ['Spin', <Spin spinning />],
    ['Divider', <Divider />],
    ['Typography', <TypographyTitle level={3}>Safe</TypographyTitle>],
    ['notification.open (SSR no-op)', null as unknown as React.ReactElement],
  ];

  for (const [name, element] of cases) {
    if (name === 'notification.open (SSR no-op)') {
      it(name, () => {
        // Must not throw — notification is imperative and needs DOM,
        // but the SSR guard makes it a silent no-op
        const savedDoc = globalThis.document;
        // @ts-expect-error intentionally simulating SSR
        delete globalThis.document;
        expect(() => notification.open({ message: 'Test', type: 'info' })).not.toThrow();
        globalThis.document = savedDoc;
      });
    } else {
      it(`${name} does not access window during render`, () => {
        expect(() => renderToString(element)).not.toThrow();
      });
    }
  }
});
