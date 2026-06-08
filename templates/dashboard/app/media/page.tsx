import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { MediaSection } from "@/components/media/MediaSection";
import { mediaSummary } from "@/lib/media-mock";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/**
 * Server component. PageHeader and the summary strip render at build
 * time using the mock library's snapshot. The interactive ImageManager
 * lives in a single client island below.
 *
 * Note: dropping the "Selected" counter from the strip — that one
 * required client state. The other three stats are computed from the
 * mock library at build time and ship as HTML.
 */
export default function MediaPage() {
  const summary = mediaSummary();

  return (
    <DashboardLayout>
      <PageHeader
        title="Media"
        subtitle="Brand assets, marketing collateral and product imagery for the AtomizeUI team."
      />

      <div className="media-summary">
        <div className="media-summary-card">
          <div className="media-summary-label">Folders</div>
          <div className="media-summary-value">{summary.folders}</div>
        </div>
        <div className="media-summary-card">
          <div className="media-summary-label">Images</div>
          <div className="media-summary-value">{summary.images}</div>
        </div>
        <div className="media-summary-card">
          <div className="media-summary-label">Storage used</div>
          <div className="media-summary-value">{formatBytes(summary.bytes)}</div>
        </div>
        <div className="media-summary-card">
          <div className="media-summary-label">Folders + images</div>
          <div className="media-summary-value">{summary.folders + summary.images}</div>
        </div>
      </div>

      <MediaSection />
    </DashboardLayout>
  );
}
