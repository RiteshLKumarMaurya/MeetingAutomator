import Image from "next/image";
import Link from "next/link";

export function WorkflowDownload({ variant = "floating" }: { variant?: "floating" | "banner" }) {
  if (variant === "banner") {
    return (
      <section className="workflow-download-banner" aria-label="Download Meeting Automator workflow">
        <div className="workflow-download-banner-glow" aria-hidden="true" />
        <div className="workflow-download-banner-art" aria-hidden="true">
          <Image
            src="/workflow-banner.svg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 520px"
          />
        </div>

        <div className="workflow-download-banner-copy">
          <span className="workflow-download-eyebrow">
            <span className="workflow-download-eyebrow-dot" />
            Free workflow guide
          </span>
          <h2>See exactly how the system works.</h2>
          <p>
            A concise walkthrough of the consultation booking journey — from the first
            request to admin approval, calendar, Meet and guest self-management.
          </p>
          <Link
            className="workflow-download-primary"
            href="/workflow.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the Meeting Automator workflow PDF"
          >
            <span className="workflow-download-pdf-icon workflow-download-pdf-icon-sm" aria-hidden="true">
              <span>PDF</span>
            </span>
            <span>
              <strong>Open workflow PDF</strong>
              <small>View the full workflow in a new tab</small>
            </span>
            <span className="workflow-download-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="workflow-download-paper" aria-hidden="true">
          <span className="workflow-download-paper-pin" />
          <span className="workflow-download-paper-cord" />
          <span className="workflow-download-paper-fold" />
          <span className="workflow-download-paper-top">MEETING</span>
          <span className="workflow-download-paper-title">AUTOMATOR</span>
          <span className="workflow-download-paper-line" />
          <span className="workflow-download-paper-pdf">PDF</span>
          <span className="workflow-download-paper-check">✓</span>
        </div>
      </section>
    );
  }

  return (
    <Link
      className="workflow-download-float"
      href="/workflow.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Meeting Automator workflow PDF"
    >
      <span className="workflow-float-cord" aria-hidden="true" />
      <span className="workflow-float-pin" aria-hidden="true" />
      <span className="workflow-float-paper" aria-hidden="true">
        <span className="workflow-float-fold" />
        <span className="workflow-float-logo">MA</span>
        <span className="workflow-float-label">PDF</span>
        <span className="workflow-float-check">✓</span>
      </span>
      <span className="workflow-float-copy">
        <small>DOWNLOAD</small>
        <strong>Workflow PDF</strong>
        <span>How it works ↗</span>
      </span>
    </Link>
  );
}
