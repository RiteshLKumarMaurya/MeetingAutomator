import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";

const steps = [
  ["01", "A prospect wants to talk", "They arrive from your website, campaign, referral or sales conversation."],
  ["02", "They choose a real slot", "Availability rules decide which dates and times can actually be requested."],
  ["03", "They share useful context", "The guest gives their name, company and what they want to improve before the conversation."],
  ["04", "Your team reviews it", "An admin can approve, move or cancel the request from the consultation desk."],
  ["05", "The meeting is prepared", "Approval can create the Google Calendar event and Google Meet link, then send the guest the details."],
  ["06", "The guest self-manages", "A secure management link lets the guest reschedule or cancel without creating an account."],
];

export default function WorkflowPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionLabel>How the system works</SectionLabel>
          <h1 className="h1" style={{ marginTop: 18 }}>From “can we have a call?” to a managed meeting — without the back-and-forth.</h1>
          <p>Meeting Automator is the operational layer behind your consultation process. The client experience stays simple while your team gets control over approvals and exceptions.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container workflow-steps-grid">
          {steps.map(([number, title, text], index) => (
            <article className="workflow-step-card" key={number}>
              <div className="workflow-step-top"><span>{number}</span><i>{index < steps.length - 1 ? "→" : "✓"}</i></div>
              <div className="workflow-step-content"><div className="workflow-step-kicker">STEP {number}</div><h2>{title}</h2><p>{text}</p></div>
              <div className="workflow-step-footer"><span>{index === 0 ? "Entry" : index === 5 ? "Self-service" : "Automated handoff"}</span><b>{index === 5 ? "Done" : "Next"} {index < steps.length - 1 ? "→" : ""}</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-dark">
        <div className="container split-feature">
          <div>
            <SectionLabel>Flexible by design</SectionLabel>
            <h2 className="h2" style={{ marginTop: 16 }}>Keep your website. Change the operational layer.</h2>
            <p className="dark-copy">If you already have a website, we can integrate the booking experience into it. If you are building a new service website, we can build the consultation journey with the automation from day one.</p>
            <Link className="btn btn-primary" href="/consultation">Discuss your workflow →</Link>
          </div>
          <div className="workflow-card">
            <SectionLabel>What gets automated</SectionLabel>
            <div className="workflow-mini">
              <div>Availability rules</div>
              <div>Guest booking + context</div>
              <div>Admin approval</div>
              <div>Calendar + Google Meet</div>
              <div>Email confirmations</div>
              <div>Guest reschedule + cancellation</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container workflow-teaser">
          <div>
            <SectionLabel>Ready to map yours?</SectionLabel>
            <h2 className="h2" style={{ marginTop: 16 }}>Bring the messy process. We’ll bring the system thinking.</h2>
            <p className="muted" style={{ lineHeight: 1.75 }}>Book a one-to-one consultation and walk us through how meetings are currently requested, approved, scheduled and changed.</p>
            <Link className="btn btn-primary" href="/consultation" style={{ marginTop: 18 }}>Book the consultation</Link>
          </div>
          <div className="workflow-card">
            <SectionLabel>Core principle</SectionLabel>
            <div className="workflow-mini">
              <div>Less manual coordination</div>
              <div>More qualified conversations</div>
              <div>Better client experience</div>
              <div>Clear admin control</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
