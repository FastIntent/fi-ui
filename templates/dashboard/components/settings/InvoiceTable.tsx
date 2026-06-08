"use client";

import { Button, Table, Tag } from "@atomizeui/core";
import type { Invoice } from "@/lib/mock";

type InvoiceRow = Invoice & { [key: string]: unknown };

const STATUS_COLOR: Record<Invoice["status"], "success" | "warning" | "error"> = {
  Paid: "success",
  Pending: "warning",
  Failed: "error",
};

const columns = [
  {
    key: "id",
    title: "Invoice",
    dataIndex: "id",
    render: (id: string) => <span className="billing-invoice-id">{id}</span>,
  },
  { key: "date", title: "Date", dataIndex: "date", width: 140 },
  { key: "description", title: "Description", dataIndex: "description" },
  {
    key: "amount",
    title: "Amount",
    dataIndex: "amount",
    width: 120,
    render: (a: string) => <span className="billing-invoice-amount">{a}</span>,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    width: 120,
    render: (s: Invoice["status"]) => <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
  },
  {
    key: "actions",
    title: "",
    width: 110,
    render: () => <Button>Download</Button>,
  },
];

/**
 * Table renderers are functions; functions cannot cross the
 * server→client boundary as props. We keep the column definitions co-
 * located with the Table inside this small island so the page itself
 * can stay server-only.
 */
export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const rows: InvoiceRow[] = invoices.map((i) => ({ ...i }));
  return <Table columns={columns} data={rows} rowKey="id" pagination={false} />;
}
