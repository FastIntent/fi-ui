import { Button, Progress } from "@atomizeui/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { RenewsTooltip } from "@/components/settings/RenewsTooltip";
import { InvoiceTable } from "@/components/settings/InvoiceTable";
import { currentPlan, invoices } from "@/lib/mock";

/**
 * Server component. Plan card and invoice list render at build time;
 * only Tooltip (renewal date) and Table (sorting/pagination internals)
 * hydrate as client atoms. The bulk of the page ships as static HTML.
 */
export default function BillingSettingsPage() {
  const seatUsage = Math.round((currentPlan.usedSeats / currentPlan.seats) * 100);

  return (
    <DashboardLayout>
      <PageHeader
        title="Billing"
        subtitle="Current plan, seat usage and invoice history. Plan changes apply at the next renewal."
      />

      <div className="settings-stack">
        <SettingsSection
          title="Current plan"
          description="Manage the subscription that powers this workspace."
          action={
            <div className="billing-plan-actions">
              <Button>Change plan</Button>
              <Button type="primary">Upgrade</Button>
            </div>
          }
        >
          <div className="billing-plan">
            <div className="billing-plan-summary">
              <div className="billing-plan-name">{currentPlan.name}</div>
              <div className="billing-plan-price">
                <span className="billing-plan-amount">{currentPlan.price}</span>
                <span className="billing-plan-cycle">/ {currentPlan.cycle}</span>
              </div>
              <RenewsTooltip date={currentPlan.renewsOn} amount={currentPlan.price} />
            </div>
            <div className="billing-plan-meta">
              <SettingsRow
                label="Seats"
                description={`${currentPlan.usedSeats} of ${currentPlan.seats} seats in use.`}
                control={
                  <div className="billing-plan-seats">
                    <Progress percent={seatUsage} showInfo={false} />
                    <span className="billing-plan-seats-count">
                      {currentPlan.usedSeats} / {currentPlan.seats}
                    </span>
                  </div>
                }
              />
              <SettingsRow
                label="Payment method"
                description="Visa ending in 4242 — expires 09/29"
                control={<Button>Update</Button>}
              />
              <SettingsRow
                label="Billing email"
                description="Receipts and dunning notices land here."
                control={<span className="settings-meta">billing@atomizeui.com</span>}
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Invoice history"
          description="The last twelve months of charges. Download a copy for accounting at any time."
          action={<Button>Export all</Button>}
        >
          <InvoiceTable invoices={invoices} />
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}
