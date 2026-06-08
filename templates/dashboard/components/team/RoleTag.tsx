import { Tag } from "@atomizeui/core";
import type { Role } from "@/lib/mock";

/**
 * Role badges are intentionally neutral. Per the AtomizeUI Visual
 * Principles, green carries state (active/success), not category. Roles
 * stay quiet so the eye lands on the Status column when scanning the
 * table.
 */
export function RoleTag({ role }: { role: Role }) {
  return <Tag>{role}</Tag>;
}
