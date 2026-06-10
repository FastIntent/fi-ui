import { Avatar, Divider, Flex, Form, FormItem, Input, Tag } from "@atomizeui/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SaveButton } from "@/components/settings/SaveButton";
import { SimpleSelect } from "@/components/settings/SimpleSelect";
import { ThemeRadio } from "@/components/settings/ThemeRadio";
import { KitThemePicker } from "@/components/settings/KitThemePicker";
import { DangerDelete } from "@/components/settings/DangerDelete";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

const TIMEZONES = [
  { value: "utc", label: "UTC" },
  { value: "pst", label: "PST — Pacific Time" },
  { value: "cst", label: "CST — Central Time" },
  { value: "est", label: "EST — Eastern Time" },
  { value: "cet", label: "CET — Central European" },
];

/**
 * Server component. Form fields are uncontrolled (defaultValue), so the
 * inputs hydrate in place without lifting a useState chain into the
 * page. Save button, theme picker and delete flow are tiny client atoms.
 */
export default function GeneralSettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="General"
        subtitle="Workspace identity, appearance and locale. Settings here apply to everyone on the team."
        meta={<Tag color="processing">Team plan</Tag>}
      />

      <div className="settings-stack">
        <SettingsSection
          title="Workspace"
          description="Public identity for your team. Visible to collaborators and on shared links."
          action={<SaveButton label="Save changes" successMessage="Workspace settings saved" />}
        >
          <Form layout="vertical">
            <FormItem label="Workspace name" required>
              <Input defaultValue="AtomizeUI" />
            </FormItem>
            <FormItem label="Workspace URL">
              <Input prefix="atomize.ui/" defaultValue="atomizeui" />
            </FormItem>
            <FormItem label="Workspace avatar">
              <Flex align="center" gap={14}>
                <Avatar size="large" style={{ background: "var(--atom-primary-color)" }}>
                  AU
                </Avatar>
                {/* Static button; upload is a future enhancement. */}
                <a className="atom-btn atom-btn-default" href="#workspace-avatar" role="button">
                  Upload image
                </a>
              </Flex>
            </FormItem>
          </Form>
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          description="Pick the theme that drives the dashboard chrome. Changes apply instantly across this device."
        >
          <SettingsRow
            label="Theme"
            description="Switch between light and dark modes, or follow your OS preference."
            control={<ThemeRadio />}
          />
          <SettingsRow
            label="Dashboard theme"
            description="Combinations of sidebar, header and UI accent. Each theme is a standalone CSS file you can copy into your own project (app/themes/)."
            control={<KitThemePicker />}
          />
        </SettingsSection>

        <SettingsSection
          title="Locale"
          description="Defaults for new members. Each member can override these in their personal preferences."
        >
          <SettingsRow
            label="Language"
            description="UI language for shared dashboards and email templates."
            control={<SimpleSelect options={LANGUAGES} defaultValue="en" width={200} />}
          />
          <SettingsRow
            label="Timezone"
            description="Used to align activity logs and scheduled reports."
            control={<SimpleSelect options={TIMEZONES} defaultValue="utc" width={240} />}
          />
        </SettingsSection>

        <Divider className="settings-divider" />

        <SettingsSection
          title="Danger zone"
          description="Irreversible operations. Read each one twice before you click."
          danger
        >
          <SettingsRow
            label="Delete workspace"
            description="Removes the workspace, all members, projects, integrations and uploaded media. Cannot be undone."
            control={
              <DangerDelete
                label="Delete workspace"
                modalTitle="Delete workspace?"
                modalBody={
                  <p>
                    This will permanently remove <strong>AtomizeUI</strong> and every member,
                    project and asset attached to it. There is no way to recover this data once the
                    operation completes.
                  </p>
                }
                notificationMessage="Workspace deleted"
                notificationDescription="All members, projects, integrations and uploaded media have been removed."
              />
            }
          />
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}
