import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { DemoVideo } from "@/components/DemoVideo";
import { HeroFlowCard } from "@/components/HeroFlowCard";

const meetingImage = "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85";

export default function HomePage() {
  return (
    <>
      <section className="hero hero-premium">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SectionLabel>For agencies, consultants & service teams</SectionLabel>
            <h1 className="display">Turn “let’s book a call” into a <span className="gradient-text">system.</span></h1>
            <p>
              Meeting Automator is a consultation booking system we build and integrate for businesses that are tired of coordinating client meetings manually. Your website stays yours. We automate the booking workflow behind it.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/consultation">Book a 1:1 consultation <span>→</span></Link>
              <Link className="btn btn-secondary" href="/workflow">See how it works</Link>
            </div>
            <div className="hero-proof">
              <span>✓ Guest booking</span><span>✓ Admin approval</span><span>✓ Reschedule & cancel</span><span>✓ Google Meet</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <Image src={meetingImage} alt="Agency team discussing a client project" fill sizes="(max-width: 980px) 100vw, 50vw" priority />
            </div>
            <HeroFlowCard />
          </div>
        </div>
      </section>

      <div className="container pain-strip">
        <div><strong>Still doing this manually?</strong><span>DM → ask for availability → check calendar → confirm → send link → handle reschedules.</span></div>
        <Link className="text-link" href="/consultation">Replace the process →</Link>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionLabel>The problem we solve</SectionLabel>
              <h2 className="h2" style={{ marginTop: 16 }}>Your team should sell the service — not babysit the calendar.</h2>
            </div>
            <p>For agencies and consultants, every meeting is part of the sales and delivery experience. Meeting Automator removes the repetitive coordination between “interested” and “booked.”</p>
          </div>
          <div className="feature-grid">
            {[
              ["01", "Capture the request", "A focused guest booking flow collects the context your team needs before the call."],
              ["02", "Control availability", "Working hours, slot duration, capacity, buffers and advance rules determine what can actually be booked."],
              ["03", "Approve with confidence", "Admins review the request before confirmation. Approve it and the system handles the meeting setup."],
              ["04", "Automate the handoff", "Google Calendar, Google Meet and confirmation emails turn an approved request into a ready-to-join meeting."],
              ["05", "Let guests self-manage", "Private management links let guests reschedule or cancel without creating an account or calling your team."],
              ["06", "Fit your stack", "Integrate the booking layer into your current website or we can build a dedicated consultation experience around your business."],
            ].map(([number, title, description]) => (
              <article className="feature-card" key={title}>
                <div className="feature-mark">{number}</div>
                <h3 className="h3">{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DemoVideo />

      <section className="section section-dark">
        <div className="container">
          <div className="split-feature">
            <div>
              <SectionLabel>Not a SaaS subscription</SectionLabel>
              <h2 className="h2" style={{ marginTop: 16 }}>We build the consultation workflow around your business.</h2>
              <p className="dark-copy">Meeting Automator can be integrated into your existing website or delivered as a new consultation website. The point is not another dashboard for you to learn. The point is a smoother client journey and less operational work.</p>
              <div className="dark-list">
                <div><b>Existing website?</b><span>We integrate the booking and management layer into it.</span></div>
                <div><b>Starting fresh?</b><span>We can build the consultation website and workflow together.</span></div>
                <div><b>Need custom rules?</b><span>We adapt the flow to your approval, calendar and business process.</span></div>
              </div>
              <Link className="btn btn-primary" href="/consultation">Talk through your setup →</Link>
            </div>
            <div className="workflow-diagram">
              <div className="diagram-label">CLIENT JOURNEY</div>
              {["Visitor", "Choose a slot", "Share context", "Admin approves", "Meet + follow-up"].map((item, i) => (
                <div className="diagram-step" key={item}><span>0{i+1}</span><strong>{item}</strong>{i < 4 && <i>↓</i>}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionLabel>Built for revenue teams</SectionLabel>
              <h2 className="h2" style={{ marginTop: 16 }}>If meetings drive your business, the workflow matters.</h2>
            </div>
            <p>Especially useful when a founder, sales lead, strategist or account manager is repeatedly interrupted by scheduling work.</p>
          </div>
          <div className="audience-grid">
            {[
              ["01", "Agencies", "Turn inbound interest into qualified discovery calls without the back-and-forth.", "Lead → booked"],
              ["02", "Consultants", "Collect context before a session and give clients a polished self-service experience.", "Context → clarity"],
              ["03", "Service businesses", "Centralize availability and stop losing valuable time to calendar coordination.", "Availability → action"],
              ["04", "Custom teams", "Build the exact approval, calendar and guest-management flow your process needs.", "Process → system"],
            ].map(([number, title, text, outcome]) => (
              <article className="audience-card" key={title}>
                <div className="audience-card-top"><span className="audience-number">{number}</span><span className="audience-arrow">↗</span></div>
                <div className="audience-card-content"><div className="audience-kicker">{outcome}</div><h3>{title}</h3><p>{text}</p></div>
                <div className="audience-card-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <SectionLabel>Start with the workflow</SectionLabel>
            <h2 className="h2" style={{ marginTop: 16 }}>Show us how you book meetings today.</h2>
            <p>Book a one-to-one consultation. We’ll understand your current process, identify the manual steps worth removing, and recommend whether to integrate the system into your existing website or build a new consultation experience.</p>
            <div className="cta-actions">
              <Link className="btn btn-primary" href="/consultation">Book my 1:1 consultation</Link>
              <Link className="btn btn-secondary" href="/pricing">View engagement options</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
