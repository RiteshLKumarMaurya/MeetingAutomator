import { SectionLabel } from "@/components/SectionLabel";
import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <>
      <section className="page-hero pricing-page-hero">
        <div className="container">
          <SectionLabel>Engagements, not subscriptions</SectionLabel>
          <h1 className="h1" style={{ marginTop: 18 }}>We scope the meeting system around the way your business actually sells.</h1>
          <p>There is no generic SaaS tier to force your workflow into. Start with a complete consultation system, or integrate the automation layer into the website you already have. We finalize the scope and investment after understanding your process.</p>
        </div>
      </section>
      <section className="section-tight pricing-section">
        <div className="container">
          <div className="pricing-intro-row">
            <div>
              <span className="pricing-kicker">Two common starting points</span>
              <h2 className="pricing-subtitle">Build it. Or integrate it.</h2>
            </div>
            <p>Both options can include availability rules, guest booking, admin approval, calendar + Meet automation, email communication and secure guest rescheduling/cancellation.</p>
          </div>
          <PricingCards />
        </div>
      </section>
    </>
  );
}
