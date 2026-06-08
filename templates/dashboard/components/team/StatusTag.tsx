import type { MemberStatus } from "@/lib/mock";

/**
 * Status pill: dot + label, no chip background. Reads more like a state
 * indicator and less like a category tag. Green = active (state), not a
 * brand accent. See VISUAL_PRINCIPLES.md.
 */
export function StatusTag({ status }: { status: MemberStatus }) {
  const cls = `team-status team-status-${status.toLowerCase()}`;
  return (
    <span className={cls}>
      <span className="team-status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
