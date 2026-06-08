"use client";

import { useState } from "react";
import { message } from "@atomizeui/core";
import { TeamTable } from "./TeamTable";
import { TeamMemberDrawer } from "./TeamMemberDrawer";
import { InviteMemberDrawer } from "./InviteMemberDrawer";
import type { Role, TeamMember } from "@/lib/mock";

interface Props {
  initialMembers: TeamMember[];
}

/**
 * Single coordinated island. The members list, edit drawer, invite
 * drawer and remove confirmation all share the same `members` array, so
 * fragmenting them into separate islands would require prop-drilling
 * the array (and its setter) through every atom. One coherent island
 * is the right granularity here.
 *
 * The surrounding page stays a server component — PageHeader and the
 * DashboardLayout chrome render statically.
 */
export function TeamSection({ initialMembers }: Props) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [inviting, setInviting] = useState(false);

  const onSave = (next: TeamMember) => {
    setMembers((prev) => prev.map((m) => (m.id === next.id ? next : m)));
    setEditing(null);
    message.success(`${next.name} updated`);
  };

  const onRemove = (id: string) => {
    const removed = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (removed) message.success(`${removed.name} removed from the team`);
  };

  const onInvite = ({ email, role }: { email: string; role: Role }) => {
    const newMember: TeamMember = {
      id: `t${Date.now()}`,
      name: email.split("@")[0] ?? email,
      email,
      role,
      status: "Invited",
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "—",
    };
    setMembers((prev) => [newMember, ...prev]);
    setInviting(false);
    message.success(`Invitation sent to ${email}`);
  };

  return (
    <>
      <TeamTable
        members={members}
        onEdit={setEditing}
        onRemove={onRemove}
        onInvite={() => setInviting(true)}
      />
      <TeamMemberDrawer
        member={editing}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSave={onSave}
      />
      <InviteMemberDrawer open={inviting} onClose={() => setInviting(false)} onSubmit={onInvite} />
    </>
  );
}
