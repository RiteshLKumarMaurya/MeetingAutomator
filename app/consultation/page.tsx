import { SectionLabel } from "@/components/SectionLabel";
import { BookingFlow, BookingSide } from "@/components/BookingFlow";

export default function ConsultationPage() {
  return (
    <>
      <section className="page-hero consultation-page-hero">
        <div className="container">
          <SectionLabel>One-to-one workflow consultation</SectionLabel>
          <h1 className="h1" style={{ marginTop: 18 }}>Let’s remove the scheduling work from your sales process.</h1>
          <p>Choose a time that works, tell us how you currently handle client meetings, and we’ll map the automation opportunity with you. No account. No sales maze.</p>
        </div>
      </section>
      <section className="booking-shell">
        <div className="container booking-grid">
          <BookingSide />
          <BookingFlow />
        </div>
      </section>
    </>
  );
}
