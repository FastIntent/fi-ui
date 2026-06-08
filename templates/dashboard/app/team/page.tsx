import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamSection } from "@/components/team/TeamSection";
import { teamMembers } from "@/lib/mock";

/**
 * Server component. Reads the initial member list at build time and
 * passes it to a single coordinated client island. The PageHeader and
 * DashboardLayout chrome ship as HTML.
 */
export default function TeamPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Team"
        subtitle="Manage roles, invitations and access for everyone working with you."
      />
      <TeamSection initialMembers={teamMembers} />
    </DashboardLayout>
  );
}
