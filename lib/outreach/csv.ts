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

  if (companyIdx < 0 || emailIdx < 0) {
    throw new Error("CSV needs company and email columns.");
  }

  const rows: LeadInput[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const email = cells[emailIdx] || "";
    const companyName = cells[companyIdx] || "";
    if (!email || !companyName) {
      continue;
    }
    rows.push({
      companyName,
      email,
      contactName: cells[index("contact") >= 0 ? index("contact") : index("contactname")] || "",
      city: cells[index("city")] || "",
      website: cells[index("website")] || "",
      productsNoted: cells[index("products") >= 0 ? index("products") : index("productsnoted")] || "",
      language: parseLanguage(cells[index("language")]),
      notes: cells[index("notes")] || "",
    });
  }
  return rows;
}
