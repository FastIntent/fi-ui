import Link from "next/link";
import { Button, Paragraph, Title } from "@atomizeui/core";
import { Logo } from "@/components/layout/Logo";

/**
 * 404 page. Standalone — does not render the DashboardLayout because
 * the page is meant to read as "you're outside the app", not "you're
 * deep inside it on a missing tab". Composition mirrors the Result
 * pattern from the core (status + title + subtitle + CTA) but is
 * inlined so we can drive the visual identity of the kit.
 */
export default function NotFoundPage() {
  return (
    <main className="notfound">
      <div className="notfound-shell">
        <div className="notfound-brand">
          <Logo height={28} />
        </div>

        <div className="notfound-code" aria-hidden="true">
          404
        </div>
        <Title level={1} className="notfound-title">
          This page slipped through the grid.
        </Title>
        <Paragraph color="secondary" className="notfound-subtitle">
          The link you followed may be broken, or the resource was moved. The rest of the dashboard
          is still where you left it.
        </Paragraph>

        <div className="notfound-actions">
          <Link href="/">
            <Button type="primary">Back to Overview</Button>
          </Link>
          <Link
            href="https://github.com/atomizeui/atomize-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Report a broken link</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
