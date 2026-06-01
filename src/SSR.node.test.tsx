// @vitest-environment node
import { renderToString } from 'react-dom/server';
import React from 'react';

import {
  Button,
  Input,
  Alert,
  Badge,
  Tag,
  Card,
  Avatar,
  Select,
  Option,
  Tabs,
  Tooltip,
  Modal,
  Drawer,
  Checkbox,
  Switch,
  Radio,
  Pagination,
  Breadcrumb,
  Progress,
  Steps,
  Step,
  Timeline,
  TimelineItem,
  Divider,
  Space,
  Title,
  Text,
  Paragraph,
  Empty,
  Result,
  Skeleton,
  Rate,
  Slider,
  DatePicker,
  Form,
  FormItem,
  InputNumber,
  InputOTP,
} from './index';

describe('SSR entorno Node.js puro (sin DOM)', () => {
  test('Button renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Button, { type: 'primary' }, 'Click me'));
    expect(html).toBeTruthy();
    expect(html).toContain('Click me');
  });

  test('Input renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Input, { placeholder: 'Enter text' }));
    expect(html).toBeTruthy();
  });

  test('Alert renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(Alert, { type: 'info', message: 'Hello World' })
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Hello World');
  });

  test('Badge renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Badge, { count: 5 }, 'Item'));
    expect(html).toBeTruthy();
  });

  test('Tag renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Tag, { color: 'blue' }, 'Tag Text'));
    expect(html).toBeTruthy();
    expect(html).toContain('Tag Text');
  });

  test('Card renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Card, { title: 'Card Title' }, 'Card Content'));
    expect(html).toBeTruthy();
    expect(html).toContain('Card Title');
    expect(html).toContain('Card Content');
  });

  test('Avatar renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Avatar, { size: 'default' }, 'A'));
    expect(html).toBeTruthy();
  });

  test('Select con Option renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(
        Select,
        { defaultValue: 'opt1' },
        React.createElement(Option, { value: 'opt1', children: 'Option 1' }),
        React.createElement(Option, { value: 'opt2', children: 'Option 2' })
      )
    );
    expect(html).toBeTruthy();
  });

  test('Tabs renderiza sin excepción', () => {
    const items = [{ key: '1', label: 'Tab', children: 'Content' }];
    const html = renderToString(React.createElement(Tabs, { items }));
    expect(html).toBeTruthy();
    expect(html).toContain('Tab');
  });

  test('Tooltip renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(Tooltip, {
        title: 'Tooltip text',
        children: React.createElement('span', null, 'Hover me'),
      })
    );
    expect(html).toBeTruthy();
  });

  test('Modal con open=false renderiza sin excepción', () => {
    // When closed, a portal component renders an empty string — that is correct SSR behavior
    expect(() =>
      renderToString(React.createElement(Modal, { open: false, title: 'Test Modal' }))
    ).not.toThrow();
  });

  test('Drawer con open=false renderiza sin excepción', () => {
    // When closed, a portal component renders an empty string — that is correct SSR behavior
    expect(() =>
      renderToString(React.createElement(Drawer, { open: false, title: 'Test Drawer' }))
    ).not.toThrow();
  });

  test('Checkbox renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Checkbox, null, 'Check me'));
    expect(html).toBeTruthy();
  });

  test('Switch renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Switch, { defaultChecked: false }));
    expect(html).toBeTruthy();
  });

  test('Radio renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Radio, { value: 'option1' }, 'Option 1'));
    expect(html).toBeTruthy();
  });

  test('Pagination renderiza sin excepción', () => {
    // Use defaultCurrent (uncontrolled) to avoid the read-only warning
    const html = renderToString(
      React.createElement(Pagination, { total: 100, pageSize: 10, defaultCurrent: 1 })
    );
    expect(html).toBeTruthy();
  });

  test('Breadcrumb renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(
        Breadcrumb,
        null,
        React.createElement(Breadcrumb.Item, null, 'Home'),
        React.createElement(Breadcrumb.Item, null, 'Page')
      )
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Home');
  });

  test('Progress renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Progress, { percent: 50 }));
    expect(html).toBeTruthy();
  });

  test('Steps con Step renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(
        Steps,
        { current: 0 },
        React.createElement(Step, { title: 'Step 1', description: 'Do step 1' }),
        React.createElement(Step, { title: 'Step 2', description: 'Do step 2' })
      )
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Step 1');
  });

  test('Timeline con TimelineItem renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(
        Timeline,
        null,
        React.createElement(TimelineItem, null, 'Event 1'),
        React.createElement(TimelineItem, null, 'Event 2')
      )
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Event 1');
  });

  test('Divider renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Divider, null));
    expect(html).toBeTruthy();
  });

  test('Space renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(Space, null, React.createElement('span', null, 'Item 1'))
    );
    expect(html).toBeTruthy();
  });

  test('Typography Title renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Title, { level: 1 }, 'Heading'));
    expect(html).toBeTruthy();
    expect(html).toContain('Heading');
  });

  test('Typography Text renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Text, null, 'Some text'));
    expect(html).toBeTruthy();
    expect(html).toContain('Some text');
  });

  test('Typography Paragraph renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Paragraph, null, 'A paragraph'));
    expect(html).toBeTruthy();
    expect(html).toContain('A paragraph');
  });

  test('Empty renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Empty, { description: 'No Data' }));
    expect(html).toBeTruthy();
    expect(html).toContain('No Data');
  });

  test('Result renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(Result, { status: 'success', title: 'Success!' })
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Success!');
  });

  test('Skeleton renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Skeleton, { animation: 'wave' }));
    expect(html).toBeTruthy();
  });

  test('Rate renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Rate, { defaultValue: 3 }));
    expect(html).toBeTruthy();
  });

  test('Slider renderiza sin excepción', () => {
    const html = renderToString(React.createElement(Slider, { defaultValue: 30 }));
    expect(html).toBeTruthy();
  });

  test('DatePicker renderiza sin excepción', () => {
    const html = renderToString(React.createElement(DatePicker, { placeholder: 'Select date' }));
    expect(html).toBeTruthy();
  });

  test('Form con FormItem renderiza sin excepción', () => {
    const html = renderToString(
      React.createElement(
        Form,
        { layout: 'vertical' },
        React.createElement(
          FormItem,
          { label: 'Name', name: 'name' },
          React.createElement(Input, { placeholder: 'Enter name' })
        )
      )
    );
    expect(html).toBeTruthy();
    expect(html).toContain('Name');
  });

  test('InputNumber renderiza sin excepción', () => {
    const html = renderToString(React.createElement(InputNumber, { defaultValue: 0 }));
    expect(html).toBeTruthy();
  });

  test('InputOTP renderiza sin excepción', () => {
    const html = renderToString(React.createElement(InputOTP, { length: 6 }));
    expect(html).toBeTruthy();
  });
});
