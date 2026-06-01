import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  CollapsePanel,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  InputOTP,
  Menu,
  Modal,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Rate,
  Result,
  Select,
  Option,
  Skeleton,
  Slider,
  Space,
  Steps,
  Step,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  Title,
  Text,
  Paragraph,
  Tooltip,
} from './index';
import { MenuItem } from './components/Menu/Menu';

describe('Accessibility (A11y) Audits', () => {
  // ─── BUTTON ────────────────────────────────────────────────────────────────
  it('Button should have no accessibility violations', async () => {
    const { container } = render(<Button type="primary">Primary Action</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button disabled should have no accessibility violations', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── INPUT ─────────────────────────────────────────────────────────────────
  it('Input should have no accessibility violations when properly labeled', async () => {
    const { container } = render(
      <div>
        <label htmlFor="username">Username</label>
        <Input id="username" placeholder="Enter username" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── INPUT NUMBER ──────────────────────────────────────────────────────────
  it('InputNumber should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="qty">Quantity</label>
        <InputNumber id="qty" min={0} max={100} defaultValue={1} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── INPUT OTP ─────────────────────────────────────────────────────────────
  it('InputOTP should have no accessibility violations', async () => {
    const { container } = render(
      <div role="group" aria-label="One-time password">
        <InputOTP length={4} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── ALERT ─────────────────────────────────────────────────────────────────
  it('Alert info should have no accessibility violations', async () => {
    const { container } = render(<Alert message="Information" type="info" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Closable Alert should have no accessibility violations', async () => {
    const { container } = render(<Alert message="System Error" type="error" closable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── AVATAR ────────────────────────────────────────────────────────────────
  it('Avatar should have no accessibility violations', async () => {
    const { container } = render(<Avatar aria-label="User avatar">JD</Avatar>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── BADGE ─────────────────────────────────────────────────────────────────
  it('Badge should have no accessibility violations', async () => {
    const { container } = render(
      <Badge count={5} aria-label="5 unread notifications">
        <button>Inbox</button>
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── BREADCRUMB ────────────────────────────────────────────────────────────
  it('Breadcrumb should have no accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
      </Breadcrumb>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── CARD ──────────────────────────────────────────────────────────────────
  it('Card should have no accessibility violations', async () => {
    const { container } = render(
      <Card title="Card Title">
        <p>Card content here.</p>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── CHECKBOX ──────────────────────────────────────────────────────────────
  it('Checkbox should have no accessibility violations', async () => {
    // Checkbox renders its own <label> wrapping the input — pass text as children
    const { container } = render(<Checkbox>Accept terms</Checkbox>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── COLLAPSE ──────────────────────────────────────────────────────────────
  it('Collapse should have no accessibility violations', async () => {
    const { container } = render(
      <Collapse>
        <CollapsePanel key="1" header="Section 1">
          <p>Panel content</p>
        </CollapsePanel>
      </Collapse>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── DIVIDER ───────────────────────────────────────────────────────────────
  it('Divider should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <p>Content above</p>
        <Divider />
        <p>Content below</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── DRAWER ────────────────────────────────────────────────────────────────
  it('Drawer should have no accessibility violations when open', async () => {
    const { baseElement } = render(
      <Drawer open={true} title="Navigation Menu" aria-label="Main Navigation">
        <nav>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>
      </Drawer>
    );
    await waitFor(() => expect(screen.queryByText('Navigation Menu')).toBeInTheDocument());
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  // ─── DROPDOWN ──────────────────────────────────────────────────────────────
  it('Dropdown menu should have no accessibility violations when expanded', async () => {
    const menu = (
      <Menu>
        <MenuItem key="1">Option 1</MenuItem>
        <MenuItem key="2">Option 2</MenuItem>
      </Menu>
    );
    const { container } = render(
      <main>
        <Dropdown overlay={menu} visible={true}>
          <Button aria-haspopup="true" aria-expanded="true">
            Actions
          </Button>
        </Dropdown>
      </main>
    );
    await waitFor(() => expect(screen.queryByText('Option 1')).toBeInTheDocument());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── EMPTY ─────────────────────────────────────────────────────────────────
  it('Empty should have no accessibility violations', async () => {
    const { container } = render(<Empty description="No data available" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── FORM ──────────────────────────────────────────────────────────────────
  it('Form should have no accessibility violations', async () => {
    const { container } = render(
      <Form layout="vertical">
        <FormItem label="Email" name="email">
          <Input type="email" placeholder="Enter email" aria-label="Email" />
        </FormItem>
        <FormItem label="Password" name="password">
          <Input type="password" placeholder="Enter password" aria-label="Password" />
        </FormItem>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── MODAL ─────────────────────────────────────────────────────────────────
  it('Modal should have no accessibility violations when open in the portal', async () => {
    const { baseElement } = render(
      <Modal open={true} title="Terms of Service" aria-label="Terms of Service Modal">
        <p>Please read these terms carefully.</p>
      </Modal>
    );
    await waitFor(() => expect(screen.queryByText('Terms of Service')).toBeInTheDocument());
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  // ─── PAGINATION ────────────────────────────────────────────────────────────
  it('Pagination should have no accessibility violations', async () => {
    const { container } = render(
      <nav aria-label="Pagination">
        <Pagination total={50} pageSize={10} defaultCurrent={1} />
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── PROGRESS ──────────────────────────────────────────────────────────────
  it('Progress should have no accessibility violations', async () => {
    const { container } = render(<Progress percent={70} aria-label="Upload progress: 70%" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── RADIO ─────────────────────────────────────────────────────────────────
  it('Radio group should have no accessibility violations', async () => {
    const { container } = render(
      <fieldset>
        <legend>Preferred contact method</legend>
        <RadioGroup>
          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone</Radio>
          <Radio value="sms">SMS</Radio>
        </RadioGroup>
      </fieldset>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── RATE ──────────────────────────────────────────────────────────────────
  it('Rate should have no accessibility violations', async () => {
    // tooltips prop sets the title attribute on each star, providing an accessible name
    const { container } = render(
      <div role="group" aria-label="Product rating">
        <Rate defaultValue={3} tooltips={['1 star', '2 stars', '3 stars', '4 stars', '5 stars']} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── RESULT ────────────────────────────────────────────────────────────────
  it('Result should have no accessibility violations', async () => {
    const { container } = render(
      <Result
        status="success"
        title="Operation Successful"
        subTitle="Your changes have been saved."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── SELECT ────────────────────────────────────────────────────────────────
  it('Select should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="role-select">Role</label>
        <Select id="role-select" defaultValue="admin" aria-label="Select role">
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="viewer">Viewer</Option>
        </Select>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── SKELETON ──────────────────────────────────────────────────────────────
  it('Skeleton should have no accessibility violations', async () => {
    // Skeleton renders role="status" for proper screen reader announcement
    const { container } = render(<Skeleton animation="wave" aria-label="Loading product list" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── SLIDER ────────────────────────────────────────────────────────────────
  it('Slider should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label id="volume-label">Volume</label>
        <Slider defaultValue={50} aria-labelledby="volume-label" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── SPACE ─────────────────────────────────────────────────────────────────
  it('Space should have no accessibility violations', async () => {
    const { container } = render(
      <Space>
        <Button>Cancel</Button>
        <Button type="primary">Confirm</Button>
      </Space>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── STEPS ─────────────────────────────────────────────────────────────────
  it('Steps should have no accessibility violations', async () => {
    const { container } = render(
      <Steps current={1} aria-label="Registration steps">
        <Step title="Account" description="Create your account" />
        <Step title="Profile" description="Fill in your profile" />
        <Step title="Done" description="You are all set" />
      </Steps>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── SWITCH ────────────────────────────────────────────────────────────────
  it('Switch should have no accessibility violations', async () => {
    const { container } = render(
      <label>
        <span>Enable notifications</span>
        <Switch defaultChecked />
      </label>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TABLE ─────────────────────────────────────────────────────────────────
  it('Table should have no accessibility violations', async () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const data = [
      { key: '1', name: 'Alice', age: 30 },
      { key: '2', name: 'Bob', age: 25 },
    ];
    const { container } = render(<Table columns={columns} data={data} aria-label="Users table" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TABS ──────────────────────────────────────────────────────────────────
  it('Tabs should have no accessibility violations', async () => {
    const items = [
      { key: '1', label: 'Overview', children: <p>Overview content</p> },
      { key: '2', label: 'Details', children: <p>Details content</p> },
      { key: '3', label: 'History', children: <p>History content</p> },
    ];
    const { container } = render(<Tabs items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TAG ───────────────────────────────────────────────────────────────────
  it('Tag should have no accessibility violations', async () => {
    const { container } = render(<Tag>Category</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Closable Tag should have no accessibility violations', async () => {
    const { container } = render(
      <Tag closable aria-label="Removable category tag">
        Category
      </Tag>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TIMELINE ──────────────────────────────────────────────────────────────
  it('Timeline should have no accessibility violations', async () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>Created account</TimelineItem>
        <TimelineItem>Uploaded profile photo</TimelineItem>
        <TimelineItem>Subscribed to plan</TimelineItem>
      </Timeline>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TOOLTIP ───────────────────────────────────────────────────────────────
  it('Tooltip trigger should have no accessibility violations', async () => {
    const { container } = render(
      <Tooltip title="This is a helpful tooltip">
        <button type="button" aria-describedby="tooltip-desc">
          Hover me
        </button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── TYPOGRAPHY ────────────────────────────────────────────────────────────
  it('Typography components should have no accessibility violations', async () => {
    const { container } = render(
      <article>
        <Title level={1}>Page Title</Title>
        <Title level={2}>Section Heading</Title>
        <Paragraph>
          This is a <Text strong>bold</Text> and <Text color="secondary">secondary</Text> text
          example.
        </Paragraph>
      </article>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── DATE PICKER ───────────────────────────────────────────────────────────
  it('DatePicker should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <label htmlFor="dob">Date of Birth</label>
        <DatePicker id="dob" placeholder="Select date" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
