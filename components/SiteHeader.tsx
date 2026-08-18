"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname?.startsWith(href);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label="Meeting Automator home">
          <Image className="brand-logo brand-logo-light" src="/logos/logo-header-light.png" alt="Meeting Automator" width={170} height={56} priority />
          <Image className="brand-logo brand-logo-dark" src="/logos/logo-header-dark.png" alt="Meeting Automator" width={170} height={56} priority />
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <Link className={active("/") ? "active" : ""} aria-current={active("/") ? "page" : undefined} href="/">Home</Link><Link className={active("/pricing") ? "active" : ""} aria-current={active("/pricing") ? "page" : undefined} href="/pricing">Solutions</Link><Link className={active("/workflow") ? "active" : ""} aria-current={active("/workflow") ? "page" : undefined} href="/workflow">How it works</Link><Link className={active("/consultation") ? "active" : ""} aria-current={active("/consultation") ? "page" : undefined} href="/consultation">Book a 1:1</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="btn btn-primary header-cta" href="/consultation">Schedule 1:1</Link>
          <button className="btn btn-secondary mobile-nav" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Toggle navigation">Menu</button>
        </div>
      </div>
      {open && <div className="mobile-menu"><div className="container">
        <Link href="/" onClick={() => setOpen(false)}>Home</Link><Link href="/pricing" onClick={() => setOpen(false)}>Solutions</Link>
        <Link href="/workflow" onClick={() => setOpen(false)}>How it works</Link><Link href="/consultation" onClick={() => setOpen(false)}>Book a 1:1</Link>
      </div></div>}
    </header>
  );
}
