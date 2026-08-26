import type { LeadInput } from "./types";
import { parseLanguage } from "./store";

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseLeadCsv(text: string): LeadInput[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((header) =>
    header.toLowerCase().replace(/\s+/g, "")
  );
  const index = (name: string) => headers.indexOf(name);
  const companyIdx = index("company") >= 0 ? index("company") : index("companyname");
  const emailIdx = index("email");

  if (emailIdx < 0) {
    throw new Error("CSV needs an email column.");
  }

  const rows: LeadInput[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const email = cells[emailIdx] || "";
    if (!email) {
      continue;
    }
    const countryIdx = index("country");
    const langIdx = index("language");
    const cityIdx = index("city");
    const websiteIdx = index("website");
    const productsIdx = index("products") >= 0 ? index("products") : index("productsnoted");
    const notesIdx = index("notes");
    const contactIdx = index("contact") >= 0 ? index("contact") : index("contactname");
    rows.push({
      companyName: companyIdx >= 0 ? cells[companyIdx] || "" : "",
      email,
      contactName: contactIdx >= 0 ? cells[contactIdx] || "" : "",
      city: cityIdx >= 0 ? cells[cityIdx] || "" : "",
      country: countryIdx >= 0 ? cells[countryIdx] || "" : "",
      website: websiteIdx >= 0 ? cells[websiteIdx] || "" : "",
      productsNoted: productsIdx >= 0 ? cells[productsIdx] || "" : "",
      language: langIdx >= 0 && cells[langIdx] ? parseLanguage(cells[langIdx]) : undefined,
      notes: notesIdx >= 0 ? cells[notesIdx] || "" : "",
    });
  }
  return rows;
}
