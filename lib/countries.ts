export enum CountryCode {
  IN = "IN",
  US = "US",
  GB = "GB",
  AE = "AE",
  CA = "CA",
  AU = "AU",
  SG = "SG",
  NZ = "NZ",
  DE = "DE",
  FR = "FR",
  ES = "ES",
  IT = "IT",
  NL = "NL",
  IE = "IE",
  SA = "SA",
  QA = "QA",
  KW = "KW",
  BH = "BH",
  OM = "OM",
  MY = "MY",
  ID = "ID",
  PH = "PH",
  TH = "TH",
  JP = "JP",
  KR = "KR",
  CN = "CN",
  PK = "PK",
  BD = "BD",
  LK = "LK",
  NP = "NP",
  ZA = "ZA",
  NG = "NG",
  KE = "KE",
  GH = "GH",
  BR = "BR",
  MX = "MX",
  AR = "AR",
  CL = "CL",
  CO = "CO",
  SE = "SE",
  NO = "NO",
  DK = "DK",
  CH = "CH",
  AT = "AT",
  BE = "BE",
  PT = "PT",
  PL = "PL",
  TR = "TR",
  IL = "IL",
}


export type CountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
};

// Frontend-only country enum/list used by the guest booking form.

export const COUNTRIES: CountryOption[] = [
  ["IN", "India", "+91", "🇮🇳"], ["US", "United States", "+1", "🇺🇸"], ["GB", "United Kingdom", "+44", "🇬🇧"],
  ["AE", "United Arab Emirates", "+971", "🇦🇪"], ["CA", "Canada", "+1", "🇨🇦"], ["AU", "Australia", "+61", "🇦🇺"],
  ["SG", "Singapore", "+65", "🇸🇬"], ["NZ", "New Zealand", "+64", "🇳🇿"], ["DE", "Germany", "+49", "🇩🇪"],
  ["FR", "France", "+33", "🇫🇷"], ["ES", "Spain", "+34", "🇪🇸"], ["IT", "Italy", "+39", "🇮🇹"],
  ["NL", "Netherlands", "+31", "🇳🇱"], ["IE", "Ireland", "+353", "🇮🇪"], ["SA", "Saudi Arabia", "+966", "🇸🇦"],
  ["QA", "Qatar", "+974", "🇶🇦"], ["KW", "Kuwait", "+965", "🇰🇼"], ["BH", "Bahrain", "+973", "🇧🇭"],
  ["OM", "Oman", "+968", "🇴🇲"], ["MY", "Malaysia", "+60", "🇲🇾"], ["ID", "Indonesia", "+62", "🇮🇩"],
  ["PH", "Philippines", "+63", "🇵🇭"], ["TH", "Thailand", "+66", "🇹🇭"], ["JP", "Japan", "+81", "🇯🇵"],
  ["KR", "South Korea", "+82", "🇰🇷"], ["CN", "China", "+86", "🇨🇳"], ["PK", "Pakistan", "+92", "🇵🇰"],
  ["BD", "Bangladesh", "+880", "🇧🇩"], ["LK", "Sri Lanka", "+94", "🇱🇰"], ["NP", "Nepal", "+977", "🇳🇵"],
  ["ZA", "South Africa", "+27", "🇿🇦"], ["NG", "Nigeria", "+234", "🇳🇬"], ["KE", "Kenya", "+254", "🇰🇪"],
  ["GH", "Ghana", "+233", "🇬🇭"], ["BR", "Brazil", "+55", "🇧🇷"], ["MX", "Mexico", "+52", "🇲🇽"],
  ["AR", "Argentina", "+54", "🇦🇷"], ["CL", "Chile", "+56", "🇨🇱"], ["CO", "Colombia", "+57", "🇨🇴"],
  ["SE", "Sweden", "+46", "🇸🇪"], ["NO", "Norway", "+47", "🇳🇴"], ["DK", "Denmark", "+45", "🇩🇰"],
  ["CH", "Switzerland", "+41", "🇨🇭"], ["AT", "Austria", "+43", "🇦🇹"], ["BE", "Belgium", "+32", "🇧🇪"],
  ["PT", "Portugal", "+351", "🇵🇹"], ["PL", "Poland", "+48", "🇵🇱"], ["TR", "Türkiye", "+90", "🇹🇷"], ["IL", "Israel", "+972", "🇮🇱"],
].map(([code, name, dialCode, flag]) => ({ code: code as CountryCode, name, dialCode, flag }));

export const DEFAULT_COUNTRY = CountryCode.IN;

export function getCountry(code: CountryCode | string) {
  return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0];
}


/** Meeting Automator booking form: local phone input is limited to 10 digits. */
export function isValidLocalPhone(value: string) {
  return /^\d{10}$/.test(value.replace(/\D/g, ""));
}
