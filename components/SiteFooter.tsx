import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link" aria-label="Meeting Automator home">
            <Image src="/logos/logo-header-dark.png" alt="Meeting Automator" width={166} height={54} />
          </Link>
          <p>A custom consultation booking system for agencies, consultants and service teams that want less scheduling work and a better client experience.</p>
        </div>
        <div className="footer-column">
          <span className="footer-title">Explore</span>
          <Link href="/pricing">Solutions</Link>
          <Link href="/workflow">How it works</Link>
          <Link href="/consultation">Book a consultation</Link>
        </div>
        <div className="footer-column">
          <span className="footer-title">Built for</span>
          <span>Agencies</span>
          <span>Consultants</span>
          <span>Service businesses</span>
        </div>
        <div className="footer-column footer-contact">
          <span className="footer-title">Talk to us</span>
          <a href="mailto:booking@meetingautomator.com">booking@meetingautomator.com</a>
          <Link className="footer-cta" href="/consultation">Schedule a 1:1 →</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Meeting Automator. All rights reserved.</span>
        <span>Less coordination. More conversations.</span>
      </div>
    </footer>
  );
}
