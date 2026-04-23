import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseLine(line: string): string[] {
  const cols: string[] = [];
  let col = "";
  let inQuote = false;
  for (const ch of line) {
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === "," && !inQuote) { cols.push(col.trim()); col = ""; continue; }
    col += ch;
  }
  cols.push(col.trim());
  return cols;
}

function parseCsv(raw: string): { rows: string[][] } {
  const lines: string[] = [];
  let cur = "";
  let inQ = false;
  for (const ch of raw) {
    if (ch === '"') { inQ = !inQ; cur += ch; }
    else if (ch === "\n" && !inQ) { lines.push(cur); cur = ""; }
    else if (ch === "\r" && !inQ) { /* skip */ }
    else cur += ch;
  }
  if (cur.trim()) lines.push(cur);

  const rows = lines.slice(1).filter(l => l.trim()).map(parseLine);
  return { rows };
}

export function loadResponses(): { rows: string[][] } {
  const raw = readFileSync(join(__dirname, "responses.csv"), "utf-8");
  return parseCsv(raw);
}
