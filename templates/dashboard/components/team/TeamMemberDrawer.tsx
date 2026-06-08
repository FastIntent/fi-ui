"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Form, Input, Select, Option } from "@atomizeui/core";
import type { Role, TeamMember } from "@/lib/mock";
import { StatusTag } from "./StatusTag";

interface Props {
  member: TeamMember | null;
  open: boolean;
  onClose: () => void;
  onSave: (next: TeamMember) => void;
}

const ROLES: Role[] = ["Owner", "Admin", "Member"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamMemberDrawer({ member, open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Member");

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setRole(member.role);
    }
  }, [member]);

  const handleSave = () => {
    if (!member) return;
    onSave({ ...member, name: name.trim(), email: email.trim(), role });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={420}
      title="Member details"
      rootClassName="team-drawer"
      footer={
        <div className="team-drawer-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave} disabled={!member}>
            Save changes
          </Button>
        </div>
      }
    >
      {member && (
        <>
          <div className="team-drawer-identity">
            <Avatar size="large" src={member.avatarUrl}>
              {initials(member.name)}
            </Avatar>
            <div>
              <div className="team-drawer-identity-name">{member.name}</div>
              <StatusTag status={member.status} />
            </div>
          </div>

          <dl className="team-drawer-meta">
            <div>
              <dt>Joined</dt>
              <dd>{member.joinedAt}</dd>
            </div>
            <div>
              <dt>Last active</dt>
              <dd>{member.lastActive}</dd>
            </div>
          </dl>

          <Form layout="vertical" className="team-drawer-form">
            <Form.Item label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Role">
              <Select value={role} onChange={(v) => setRole(v as Role)}>
                {ROLES.map((r) => (
                  <Option key={r} value={r}>
                    {r}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </>
      )}
    </Drawer>
  );
}
