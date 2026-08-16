"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPackageBySlug, type Package } from "@/lib/api";

const slugs = ["meeting-automation-launch", "meeting-automation-integration"];

export function PricingCards() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all(slugs.map(getPackageBySlug))
      .then((items) => mounted && setPackages(items))
      .catch((err) => mounted && setError(err instanceof Error ? err.message : "Unable to load plans."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="pricing-grid">
        {slugs.map((slug) => <div className="price-card price-card-skeleton" key={slug}><div className="skeleton-line short" /><div className="skeleton-line title" /><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-block" /></div>)}
      </div>
    );
  }

  if (error) return <div className="form-error">{error}</div>;

  return (
    <div className="pricing-grid">
      {packages.map((item, index) => {
        const services = (item.services || []).filter((service) => service.serviceResponse?.name).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        return (
          <article className={`price-card ${item.featured ? "featured" : ""}`} key={item.slug}>
            <div className="price-card-glow" aria-hidden="true" />
            <div className="price-card-top">
              <span className="price-badge">{index === 0 ? "New consultation website" : "Website integration"}</span>
              {item.featured && <span className="price-featured">Recommended</span>}
            </div>
            <h2 className="h3">{item.name}</h2>
            <p className="price-description">{item.shortDescription || item.longDescription || "A consultation booking workflow tailored to your business."}</p>

            {services.length > 0 && (
              <div className="service-list">
                {services.map((service) => (
                  <div className="service-row" key={service.id}>
                    <span className="service-check">✓</span>
                    <div>
                      <strong>{service.serviceResponse?.name}</strong>
                      {service.serviceResponse?.shortDescription && <span>{service.serviceResponse.shortDescription}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="price-card-bottom">
              <div className="price-note"><strong>Custom scope</strong><span>We define the investment after understanding your workflow.</span></div>
              <Link className="btn btn-primary btn-block pricing-cta" href="/consultation">
                <span>Discuss your workflow</span>
                <span className="pricing-cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
