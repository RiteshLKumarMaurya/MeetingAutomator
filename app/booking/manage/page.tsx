import { ManageBooking } from "@/components/ManageBooking";

export default async function ManageBookingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params.token || "";
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow"><span className="eyebrow-dot" />Secure booking management</div>
          <h1 className="h1" style={{ marginTop: 18 }}>Manage your consultation.</h1>
          <p>Reschedule or cancel your guest booking using the private link from your confirmation email.</p>
        </div>
      </section>
      <section className="booking-shell">
        <div className="container">
          {token ? <ManageBooking token={token} /> : <div className="manage-card"><div className="form-error">A secure booking token is required. Please use the management link from your email.</div></div>}
        </div>
      </section>
    </>
  );
}
