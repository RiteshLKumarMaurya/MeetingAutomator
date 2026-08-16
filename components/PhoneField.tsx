"use client";

import { useMemo, useRef, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, getCountry, type CountryCode, type CountryOption } from "@/lib/countries";

export function PhoneField({
  value,
  onChange,
  countryCode,
  onCountryChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  countryCode?: CountryCode;
  onCountryChange?: (countryCode: CountryCode) => void;
  error?: boolean;
}) {
  const [internalCountryCode, setInternalCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const selectedCountryCode: CountryCode = countryCode || internalCountryCode;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const country = getCountry(selectedCountryCode);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((item) =>
      `${item.name} ${item.dialCode} ${item.code}`.toLowerCase().includes(q),
    );
  }, [query]);

  const choose = (item: CountryOption) => {
    setInternalCountryCode(item.code);
    onCountryChange?.(item.code);
    setOpen(false);
    setQuery("");
    requestAnimationFrame(() => searchRef.current?.blur());
  };

  return (
    <div className={`phone-field ${error ? "has-error" : ""}`}>
      <div className="phone-country-wrap">
        <button
          className="phone-country"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="phone-flag">{country.flag}</span>
          <span className="phone-dial">{country.dialCode}</span>
          <span className="phone-chevron">⌄</span>
        </button>
        {open && (
          <div className="country-popover" role="listbox">
            <div className="country-search-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                ref={searchRef}
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search country or code"
                aria-label="Search country"
              />
            </div>
            <div className="country-list">
              {filtered.length ? (
                filtered.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={`country-option ${item.code === selectedCountryCode ? "active" : ""}`}
                    onClick={() => choose(item)}
                    role="option"
                    aria-selected={item.code === selectedCountryCode}
                  >
                    <span className="phone-flag">{item.flag}</span>
                    <span className="country-name">{item.name}</span>
                    <span className="country-dial">{item.dialCode}</span>
                  </button>
                ))
              ) : (
                <div className="country-empty">No country found.</div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder="10-digit number"
        maxLength={10}
        autoComplete="tel-national"
        aria-label="WhatsApp phone number"
      />
    </div>
  );
}

/** Backend contract stores the international number as digits only (no + sign). */
export function buildE164(countryCode: string, localNumber: string) {
  const country = getCountry(countryCode);
  return `${country.dialCode.replace(/\D/g, "")}${localNumber.replace(/\D/g, "")}`;
}
