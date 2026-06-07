import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { Tooltip } from '../Tooltip';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Table>;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <span>
        <a>Invite</a>
        <span style={{ margin: '0 8px', color: '#e6e6e6' }}>|</span>
        <a>Delete</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

export const Basic: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
  },
};

export const Bordered: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
    bordered: true,
  },
};

export const Striped: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
    striped: true,
  },
};

export const Loading: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
    loading: true,
  },
};

export const Small: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
    size: 'small',
  },
};

export const Large: StoryObj<typeof Table> = {
  args: {
    columns,
    data,
    size: 'large',
  },
};

export const Ellipsis: StoryObj<typeof Table> = {
  render: (args) => {
    const ellipsisColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Long Text',
        dataIndex: 'long',
        key: 'long',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ];

    const ellipsisData = [
      {
        key: '1',
        name: 'John Brown with a very long name that should be truncated',
        address:
          'New York No. 1 Lake Park, very long address that will definitely overflow the cell container',
        long: 'This is a very long text that demonstrates how the ellipsis property works in conjunction with our new Tooltip component for a premium user experience.',
      },
    ];

    return <Table {...args} columns={ellipsisColumns} data={ellipsisData} />;
  },
};

const fixedColumns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left' as const,
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left' as const,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  { title: 'Column 8', dataIndex: 'address', key: '8', width: 150 },
  { title: 'Column 9', dataIndex: 'address', key: '9', width: 150 },
  { title: 'Column 10', dataIndex: 'address', key: '10', width: 150 },
  { title: 'Column 11', dataIndex: 'address', key: '11', width: 150 },
  { title: 'Column 12', dataIndex: 'address', key: '12', width: 150 },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right' as const,
    width: 100,
    render: () => <a>action</a>,
  },
];

const fixedData = Array.from({ length: 100 }).map((_, i) => ({
  key: `${i}`,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

export const FixedColumns: StoryObj<typeof Table> = {
  args: {
    columns: fixedColumns,
    data: fixedData,
    scroll: { x: 2000, y: 500 },
  },
  render: (args) => {
    return (
      <div style={{ width: '100%', maxWidth: '500px', height: 600 }}>
        <Table {...args} />
      </div>
    );
  },
};

export const RowSelection: StoryObj<typeof Table> = {
  render: (args) => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return <Table {...args} rowSelection={rowSelection} columns={columns} data={data} />;
  },
};

// --- DND Kit Integration with Handle ---

const DragHandle = ({
  listeners,
  attributes,
}: {
  listeners?: SyntheticListenerMap;
  attributes?: React.HTMLAttributes<HTMLSpanElement>;
}) => (
  <span
    {...attributes}
    {...listeners}
    style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 2C4 2.55228 3.55228 3 3 3C2.44772 3 2 2.55228 2 2C2 1.44772 2.44772 1 3 1C3.55228 1 4 1.44772 4 2Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <path
        d="M4 6C4 6.55228 3.55228 7 3 7C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5C3.55228 5 4 5.44772 4 6Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <path
        d="M4 10C4 10.5523 3.55228 11 3 11C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9C3.55228 9 4 9.44772 4 10Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <path
        d="M10 2C10 2.55228 9.55228 3 9 3C8.44772 3 8 2.55228 8 2C8 1.44772 8.44772 1 9 1C9.55228 1 10 1.44772 10 2Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <path
        d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <path
        d="M10 10C10 10.5523 9.55228 11 9 11C8.44772 11 8 10.5523 8 10C8 9.44772 8.44772 9 9 9C9.55228 9 10 9.44772 10 10Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  </span>
);

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<Readonly<RowProps>> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999, background: 'rgba(0,0,0,0.02)' } : {}),
  };

  // We pass listeners and attributes to children (specifically to the handle)
  const children = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child) && (child as React.ReactElement).key === 'sort-handle') {
      return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        children: (
          <DragHandle
            listeners={listeners}
            attributes={attributes as unknown as React.HTMLAttributes<HTMLSpanElement>}
          />
        ),
      });
    }
    return child;
  });

  return (
    <tr {...props} ref={setNodeRef} style={style}>
      {children}
    </tr>
  );
};

export const DragSorting: StoryObj<typeof Table> = {
  render: (args) => {
    const [dataSource, setDataSource] = React.useState([
      { key: '1', id: 1, name: 'Planning', progress: 'Open', priority: 'Normal' },
      { key: '2', id: 2, name: 'Plan timeline', progress: 'In Progress', priority: 'Normal' },
      { key: '3', id: 3, name: 'Plan budget', progress: 'Started', priority: 'Low' },
      { key: '4', id: 4, name: 'Allocate resources', progress: 'Open', priority: 'Critical' },
    ]);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 1,
        },
      })
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        setDataSource((prev) => {
          const activeIndex = prev.findIndex((i) => i.key === active.id);
          const overIndex = prev.findIndex((i) => i.key === over?.id);
          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    };

    return (
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            {...args}
            components={{
              body: { row: Row },
            }}
            rowKey="key"
            columns={[
              {
                key: 'sort-handle',
                width: 40,
                align: 'center',
                render: () => null, // Will be replaced by handle in Row component
              },
              { title: 'Task ID', dataIndex: 'id', key: 'id', width: 80 },
              { title: 'Task Name', dataIndex: 'name', key: 'name' },
              { title: 'Progress', dataIndex: 'progress', key: 'progress' },
              { title: 'Priority', dataIndex: 'priority', key: 'priority' },
            ]}
            data={dataSource}
          />
        </SortableContext>
      </DndContext>
    );
  },
};

export const Expandable: StoryObj<typeof Table> = {
  render: () => {
    interface OrderType {
      key: string;
      orderId: string;
      customer: string;
      email: string;
      date: string;
      total: string;
      status: string;
      shippingName: string;
      shippingAddress: string;
      shippingCity: string;
      shippingPhone: string;
      paymentMethod: string;
      paymentRef: string;
      paymentStatus: string;
      [k: string]: unknown;
    }

    const [expandedKeys, setExpandedKeys] = React.useState<readonly React.Key[]>([]);

    const ExpandArrow = ({ rowKey }: { rowKey: React.Key }) => {
      const isOpen = expandedKeys.includes(rowKey);
      return (
        <span
          className={`fi-table-expand-arrow${isOpen ? ' fi-table-expand-arrow-expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedKeys((prev) =>
              prev.includes(rowKey) ? prev.filter((k) => k !== rowKey) : [...prev, rowKey]
            );
          }}
        />
      );
    };

    const orderColumns = [
      { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
      { title: 'Customer', dataIndex: 'customer', key: 'customer' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Total', dataIndex: 'total', key: 'total' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => {
          const color =
            text === 'Delivered' ? '#52c41a' : text === 'Shipped' ? '#1677ff' : '#faad14';
          return <span style={{ color }}>{text}</span>;
        },
      },
      {
        title: '',
        key: 'expand',
        width: 50,
        align: 'center' as const,
        render: (_: unknown, record: OrderType) => <ExpandArrow rowKey={record.key} />,
      },
    ];

    const orderData: OrderType[] = [
      {
        key: '1',
        orderId: 'ORD-2024-0041',
        customer: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        date: '2024-08-12',
        total: '$1,249.00',
        status: 'Delivered',
        shippingName: 'Sarah Johnson',
        shippingAddress: '1420 W Madison St',
        shippingCity: 'Chicago, IL 60607',
        shippingPhone: '+1 (312) 555-0192',
        paymentMethod: 'Visa **** 4291',
        paymentRef: 'TXN-88291034',
        paymentStatus: 'Completed',
      },
      {
        key: '2',
        orderId: 'ORD-2024-0042',
        customer: 'Michael Chen',
        email: 'mchen@globaltech.io',
        date: '2024-08-13',
        total: '$3,780.50',
        status: 'Shipped',
        shippingName: 'Michael Chen',
        shippingAddress: '550 Kearny St, Suite 400',
        shippingCity: 'San Francisco, CA 94108',
        shippingPhone: '+1 (415) 555-0287',
        paymentMethod: 'Mastercard **** 8810',
        paymentRef: 'TXN-88291035',
        paymentStatus: 'Completed',
      },
      {
        key: '3',
        orderId: 'ORD-2024-0043',
        customer: 'Emily Rodriguez',
        email: 'emily.r@startup.co',
        date: '2024-08-14',
        total: '$892.00',
        status: 'Processing',
        shippingName: 'Emily Rodriguez',
        shippingAddress: '200 E Randolph St',
        shippingCity: 'Chicago, IL 60601',
        shippingPhone: '+1 (773) 555-0134',
        paymentMethod: 'PayPal',
        paymentRef: 'TXN-88291036',
        paymentStatus: 'Pending',
      },
      {
        key: '4',
        orderId: 'ORD-2024-0044',
        customer: 'David Park',
        email: 'dpark@enterprise.com',
        date: '2024-08-14',
        total: '$5,100.00',
        status: 'Delivered',
        shippingName: 'David Park',
        shippingAddress: '350 5th Ave',
        shippingCity: 'New York, NY 10118',
        shippingPhone: '+1 (212) 555-0478',
        paymentMethod: 'Visa **** 3307',
        paymentRef: 'TXN-88291037',
        paymentStatus: 'Completed',
      },
    ];

    const label: React.CSSProperties = { fontSize: 12, color: '#999', marginBottom: 2 };
    const val: React.CSSProperties = { fontSize: 13 };
    const heading: React.CSSProperties = { fontWeight: 600, marginBottom: 8, fontSize: 13 };

    return (
      <Table<OrderType>
        columns={orderColumns}
        data={orderData}
        expandable={{
          expandedRowKeys: expandedKeys,
          expandedRowRender: (record: OrderType) => (
            <div style={{ display: 'flex', gap: 64 }}>
              <div>
                <div style={heading}>Shipping info</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 160px)',
                    gap: '12px 32px',
                  }}
                >
                  <div>
                    <div style={label}>Name</div>
                    <div style={val}>{record.shippingName}</div>
                  </div>
                  <div>
                    <div style={label}>Phone</div>
                    <div style={val}>{record.shippingPhone}</div>
                  </div>
                  <div>
                    <div style={label}>Address</div>
                    <div style={val}>{record.shippingAddress}</div>
                  </div>
                  <div>
                    <div style={label}>City</div>
                    <div style={val}>{record.shippingCity}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={heading}>Payment</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 140px)',
                    gap: '12px 32px',
                  }}
                >
                  <div>
                    <div style={label}>Method</div>
                    <div style={val}>{record.paymentMethod}</div>
                  </div>
                  <div>
                    <div style={label}>Reference</div>
                    <div style={val}>{record.paymentRef}</div>
                  </div>
                  <div>
                    <div style={label}>Status</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: record.paymentStatus === 'Completed' ? '#52c41a' : '#faad14',
                      }}
                    >
                      {record.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
          showExpandColumn: false,
        }}
      />
    );
  },
};

export const FixedColumnsExpandable: StoryObj<typeof Table> = {
  render: () => {
    interface EmployeeType {
      key: string;
      name: string;
      role: string;
      department: string;
      location: string;
      email: string;
      phone: string;
      startDate: string;
      salary: string;
      manager: string;
      status: string;
      emergencyContact: string;
      emergencyPhone: string;
      notes: string;
      [k: string]: unknown;
    }

    const [expandedKeys, setExpandedKeys] = React.useState<readonly React.Key[]>([]);

    const ExpandArrow = ({ rowKey }: { rowKey: React.Key }) => {
      const isOpen = expandedKeys.includes(rowKey);
      return (
        <span
          className={`fi-table-expand-arrow${isOpen ? ' fi-table-expand-arrow-expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedKeys((prev) =>
              prev.includes(rowKey) ? prev.filter((k) => k !== rowKey) : [...prev, rowKey]
            );
          }}
        />
      );
    };

    const employeeColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, fixed: 'left' as const },
      { title: 'Role', dataIndex: 'role', key: 'role', width: 180 },
      { title: 'Department', dataIndex: 'department', key: 'department', width: 140 },
      { title: 'Location', dataIndex: 'location', key: 'location', width: 160 },
      { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
      { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 160 },
      { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', width: 120 },
      { title: 'Salary', dataIndex: 'salary', key: 'salary', width: 120 },
      { title: 'Manager', dataIndex: 'manager', key: 'manager', width: 150 },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text: string) => {
          const color = text === 'Active' ? '#52c41a' : text === 'On Leave' ? '#faad14' : '#ff4d4f';
          return <span style={{ color, fontWeight: 500 }}>{text}</span>;
        },
      },
      {
        title: '',
        key: 'expand',
        width: 50,
        align: 'center' as const,
        fixed: 'right' as const,
        render: (_: unknown, record: EmployeeType) => <ExpandArrow rowKey={record.key} />,
      },
    ];

    const employees: EmployeeType[] = Array.from({ length: 30 }, (_, i) => {
      const names = [
        'Olivia Martinez',
        'James Wilson',
        'Sophia Lee',
        'Benjamin Clark',
        'Ava Thompson',
        'Lucas Harris',
        'Isabella Wright',
        'Mason Young',
        'Mia Robinson',
        'Ethan Hall',
      ];
      const roles = [
        'Senior Engineer',
        'Product Manager',
        'UX Designer',
        'Data Analyst',
        'DevOps Lead',
        'QA Engineer',
        'Frontend Dev',
        'Backend Dev',
        'Scrum Master',
        'Tech Lead',
      ];
      const depts = [
        'Engineering',
        'Product',
        'Design',
        'Analytics',
        'Infrastructure',
        'Quality',
        'Engineering',
        'Engineering',
        'Agile',
        'Engineering',
      ];
      const locations = [
        'New York, NY',
        'San Francisco, CA',
        'Austin, TX',
        'Chicago, IL',
        'Seattle, WA',
        'Denver, CO',
        'Boston, MA',
        'Portland, OR',
        'Miami, FL',
        'Atlanta, GA',
      ];
      const managers = [
        'VP Engineering',
        'CPO',
        'Design Director',
        'Head of Data',
        'CTO',
        'QA Director',
        'Engineering Manager',
        'Engineering Manager',
        'Agile Coach',
        'VP Engineering',
      ];
      const statuses = [
        'Active',
        'Active',
        'Active',
        'On Leave',
        'Active',
        'Active',
        'Inactive',
        'Active',
        'Active',
        'Active',
      ];
      const idx = i % 10;
      return {
        key: `${i}`,
        name: names[idx],
        role: roles[idx],
        department: depts[idx],
        location: locations[idx],
        email: `${names[idx].toLowerCase().replace(' ', '.')}@acme.com`,
        phone: `+1 (${300 + i}) 555-${String(1000 + i).slice(-4)}`,
        startDate: `2${String(20 + (i % 5)).slice(-2)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
        salary: `$${(80 + idx * 8).toLocaleString()},000`,
        manager: managers[idx],
        status: statuses[idx],
        emergencyContact: `${names[(idx + 3) % 10]}`,
        emergencyPhone: `+1 (${400 + i}) 555-${String(2000 + i).slice(-4)}`,
        notes:
          i % 3 === 0
            ? 'Eligible for promotion review Q4'
            : i % 3 === 1
              ? 'Participating in leadership program'
              : 'Annual review scheduled',
      };
    });

    const label: React.CSSProperties = { fontSize: 12, color: '#999', marginBottom: 2 };
    const val: React.CSSProperties = { fontSize: 13 };
    const heading: React.CSSProperties = { fontWeight: 600, marginBottom: 8, fontSize: 13 };

    return (
      <div style={{ maxWidth: 320 }}>
        <Table<EmployeeType>
          columns={employeeColumns}
          data={employees}
          scroll={{ x: 1600 }}
          pagination={{ pageSize: 8 }}
          expandable={{
            expandedRowKeys: expandedKeys,
            expandedRowRender: (record: EmployeeType) => (
              <div style={{ display: 'flex', gap: 64 }}>
                <div>
                  <div style={heading}>Emergency Contact</div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 160px)',
                      gap: '12px 32px',
                    }}
                  >
                    <div>
                      <div style={label}>Contact Name</div>
                      <div style={val}>{record.emergencyContact}</div>
                    </div>
                    <div>
                      <div style={label}>Phone</div>
                      <div style={val}>{record.emergencyPhone}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={heading}>HR Notes</div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 160px)',
                      gap: '12px 32px',
                    }}
                  >
                    <div>
                      <div style={label}>Notes</div>
                      <div style={val}>{record.notes}</div>
                    </div>
                    <div>
                      <div style={label}>Manager</div>
                      <div style={val}>{record.manager}</div>
                    </div>
                  </div>
                </div>
              </div>
            ),
            showExpandColumn: false,
          }}
        />
      </div>
    );
  },
};

export const WithPagination: StoryObj<typeof Table> = {
  args: {
    columns,
    data: Array.from({ length: 46 }).map((_, i) => ({
      key: `${i}`,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    })),
    pagination: {
      total: 46,
      pageSize: 10,
    },
  },
};
