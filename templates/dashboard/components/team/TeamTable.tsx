"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  Table,
  Tooltip,
} from "@atomizeui/core";
import type { TeamMember } from "@/lib/mock";
import { NavIcon } from "@/components/layout/NavIcon";
import { MemberCell } from "./MemberCell";
import { RoleTag } from "./RoleTag";
import { StatusTag } from "./StatusTag";

interface Props {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onRemove: (id: string) => void;
  onInvite: () => void;
}

const PAGE_SIZE = 5;

export function TeamTable({ members, onEdit, onRemove, onInvite }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmRemove, setConfirmRemove] = useState<TeamMember | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q),
    );
  }, [members, query]);

  const total = filtered.length;
  const startIdx = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const columns = [
    {
      key: "member",
      title: "Member",
      dataIndex: "name",
      render: (_: unknown, row: TeamMember) => <MemberCell member={row} />,
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      width: 120,
      render: (_: unknown, row: TeamMember) => <RoleTag role={row.role} />,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      width: 130,
      render: (_: unknown, row: TeamMember) => <StatusTag status={row.status} />,
    },
    {
      key: "lastActive",
      title: "Last active",
      dataIndex: "lastActive",
      width: 130,
    },
    {
      key: "actions",
      title: "",
      width: 56,
      render: (_: unknown, row: TeamMember) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          overlay={
            <Menu>
              <MenuItem key="edit" onClick={() => onEdit(row)}>
                Edit member
              </MenuItem>
              <MenuItem key="copy" onClick={() => navigator.clipboard?.writeText(row.email)}>
                Copy email
              </MenuItem>
              <MenuItem
                key="remove"
                onClick={() => setConfirmRemove(row)}
                disabled={row.role === "Owner"}
              >
                Remove from team
              </MenuItem>
            </Menu>
          }
        >
          <Tooltip title="More actions" placement="left">
            <button type="button" className="team-row-action" aria-label="Row actions">
              <NavIcon name="More" size={16} />
            </button>
          </Tooltip>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="team-table-card">
      <div className="team-table-toolbar">
        <div className="team-table-search">
          <Input
            placeholder="Search by name, email, role or status…"
            prefix={<NavIcon name="Search" />}
            allowClear
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="team-table-toolbar-actions">
          <Button>Export</Button>
          <Button type="primary" icon={<NavIcon name="Plus" />} onClick={onInvite}>
            Invite member
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="team-empty">
          <Empty description={query ? "No members match this search." : "No members yet."} />
        </div>
      ) : (
        <>
          <Table columns={columns} data={visible} rowKey="id" />
          <div className="team-table-footer">
            <div className="team-table-footer-meta">
              {total === members.length
                ? `${total} member${total === 1 ? "" : "s"}`
                : `${total} of ${members.length} member${members.length === 1 ? "" : "s"}`}
            </div>
            {total > PAGE_SIZE && (
              <Pagination current={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
            )}
          </div>
        </>
      )}

      <Modal
        open={Boolean(confirmRemove)}
        title="Remove from team"
        okText="Remove"
        cancelText="Cancel"
        onCancel={() => setConfirmRemove(null)}
        onOk={() => {
          if (confirmRemove) {
            onRemove(confirmRemove.id);
            setConfirmRemove(null);
          }
        }}
      >
        {confirmRemove && (
          <p>
            Remove <strong>{confirmRemove.name}</strong> from your team? They will lose access to
            projects and integrations immediately. This cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
