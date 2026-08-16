"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";

export function HeroFlowCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
    card.style.setProperty("--card-x", "0px");
    card.style.setProperty("--card-y", "0px");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--card-rx", `${(-y * 4).toFixed(2)}deg`);
    card.style.setProperty("--card-ry", `${(x * 5).toFixed(2)}deg`);
    card.style.setProperty("--card-x", `${(x * 3).toFixed(1)}px`);
    card.style.setProperty("--card-y", `${(y * 3).toFixed(1)}px`);
  };

  const handleClick = () => {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 420);
  };

  return (
    <div
      ref={cardRef}
      className={`hero-card ${pressed ? "is-pressed" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onClick={handleClick}
      role="presentation"
    >
      <div className="hero-card-shine" aria-hidden="true" />
      <div className="hero-card-brand">
        <Image src="/logos/logo-mark.png" alt="" width={64} height={64} />
        <div>
          <strong>Meeting Automator</strong>
          <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>Consultation flow</div>
        </div>
      </div>
      <small>Availability → booking → confirmation → Google Meet. A single flow, without the friction.</small>
      <div className="hero-card-status">
        <span>Booking engine</span>
        <span className="status-pill"><i aria-hidden="true" />Ready</span>
      </div>
    </div>
  );
}
