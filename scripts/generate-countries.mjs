import fs from "fs";
const names = new Intl.DisplayNames(["en"], { type: "region" });
const codes = [];
for (let i = 65; i <= 90; i++) {
  for (let j = 65; j <= 90; j++) {
    const code = String.fromCharCode(i) + String.fromCharCode(j);
    const name = names.of(code);
    if (name && name !== code && !name.startsWith("Unknown")) {
      codes.push({ code, name });
    }
  }
}
codes.sort((a, b) => a.name.localeCompare(b.name));

const legacy = {
  Philippines: "PH",
  Kenya: "KE",
  "Sri Lanka": "LK",
  Bangladesh: "BD",
  India: "IN",
  Indonesia: "ID",
  Nepal: "NP",
  Ethiopia: "ET",
  Uganda: "UG",
  Other: "",
};

const lines = [
  "export type Country = {",
  "  code: string;",
  "  name: string;",
  "};",
  "",
  `export const COUNTRIES: Country[] = ${JSON.stringify(codes, null, 2)};`,
  "",
  "/** Legacy onboarding values stored as full country names before ISO codes. */",
  `export const LEGACY_NATIONALITY_TO_CODE: Record<string, string> = ${JSON.stringify(legacy, null, 2)};`,
  "",
  "const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));",
  "const COUNTRY_BY_NAME = new Map(COUNTRIES.map((c) => [c.name.toLowerCase(), c]));",
  "",
  "export function isCountryCode(value: string): boolean {",
  "  return /^[A-Za-z]{2}$/.test(value) && COUNTRY_BY_CODE.has(value.toUpperCase());",
  "}",
  "",
  "export function normalizeNationalityCode(value: string): string {",
  "  if (!value) return '';",
  "  const trimmed = value.trim();",
  "  if (isCountryCode(trimmed)) return trimmed.toUpperCase();",
  "  const legacyCode = LEGACY_NATIONALITY_TO_CODE[trimmed];",
  "  if (legacyCode !== undefined) return legacyCode;",
  "  const byName = COUNTRY_BY_NAME.get(trimmed.toLowerCase());",
  "  return byName?.code ?? trimmed;",
  "}",
  "",
  "export function getCountryName(code: string): string {",
  "  if (!code) return '';",
  "  const normalized = normalizeNationalityCode(code);",
  "  return COUNTRY_BY_CODE.get(normalized)?.name ?? code;",
  "}",
  "",
  "export function getCountry(code: string): Country | undefined {",
  "  const normalized = normalizeNationalityCode(code);",
  "  return COUNTRY_BY_CODE.get(normalized);",
  "}",
  "",
  "export function searchCountries(query: string): Country[] {",
  "  const q = query.trim().toLowerCase();",
  "  if (!q) return COUNTRIES;",
  "  return COUNTRIES.filter(",
  "    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)",
  "  );",
  "}",
  "",
  "export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);",
  "",
];

fs.writeFileSync("lib/countries.ts", lines.join("\n"));
console.log("written", codes.length, "countries");
