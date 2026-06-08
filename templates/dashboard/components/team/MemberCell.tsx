import { Avatar } from "@atomizeui/core";
import type { TeamMember } from "@/lib/mock";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Per-member avatar colour: deterministic hash → palette of 6 muted
 * accents. Not for branding — for scannability. Same trick GitHub /
 * Linear / Slack use so the eye can lock onto a row by silhouette before
 * reading the name.
 *
 * Palette is intentionally low-saturation so it never competes with the
 * primary green CTAs. Greens stay last in the rotation so the Owner row
 * (typically index 0 in any team) reads with brand colour by coincidence.
 */
const AVATAR_PALETTE = [
  "#3b82f6", // blue
  "#a855f7", // purple
  "#f97316", // orange
  "#0ea5e9", // cyan
  "#ec4899", // pink
  "var(--atom-primary-color)",
];

function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length]!;
}

export function MemberCell({ member }: { member: TeamMember }) {
  const bg = member.avatarUrl ? undefined : avatarColor(member.id);
  return (
    <div className="team-member-cell">
      <Avatar size="small" src={member.avatarUrl} style={bg ? { background: bg } : undefined}>
        {initials(member.name)}
      </Avatar>
      <div className="team-member-cell-text">
        <div className="team-member-cell-name">{member.name}</div>
        <div className="team-member-cell-email">{member.email}</div>
      </div>
    </div>
  );
}
