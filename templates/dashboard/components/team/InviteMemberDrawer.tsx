"use client";

import { useState } from "react";
import { Button, Drawer, Form, Input, Select, Option } from "@atomizeui/core";
import type { Role } from "@/lib/mock";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { email: string; role: Role }) => void;
}

const ROLES: Role[] = ["Owner", "Admin", "Member"];

export function InviteMemberDrawer({ open, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Member");

  const reset = () => {
    setEmail("");
    setRole("Member");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = () => {
    if (!email.trim()) return;
    onSubmit({ email: email.trim(), role });
    reset();
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      placement="right"
      width={420}
      title="Invite a new member"
      rootClassName="team-drawer"
      footer={
        <div className="team-drawer-footer">
          <Button onClick={close}>Cancel</Button>
          <Button type="primary" onClick={submit} disabled={!email.trim()}>
            Send invite
          </Button>
        </div>
      }
    >
      <p className="team-drawer-help">
        They will receive an email with a link to join your workspace.
      </p>
      <Form layout="vertical" className="team-drawer-form">
        <Form.Item label="Email">
          <Input
            type="email"
            placeholder="member@atomizeui.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
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
    </Drawer>
  );
}
