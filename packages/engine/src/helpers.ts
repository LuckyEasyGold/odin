import Handlebars from "handlebars";

/**
 * Coerce arbitrary input to a finite number.
 * Accepts strings with R$, dot/comma decimals, and locale-formatted numbers.
 */
function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined) return 0;
  let s = String(value).trim();
  if (!s) return 0;
  // Strip currency symbols and spaces
  s = s.replace(/[R$\s]/g, "");
  // Detect Brazilian format ("1.234,56") vs US ("1,234.56" or "1234.56")
  if (s.includes(",") && s.includes(".")) {
    // Whichever appears LAST is the decimal separator
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const s = String(value).trim();
  // Try DD/MM/YYYY (Brazilian)
  const brMatch = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) {
    const [, d, m, y] = brMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

let registered = false;

/**
 * Register ODIN's typed Handlebars helpers (idempotent).
 * Helpers (PT-BR aliases + EN aliases):
 *   {{texto v}}          → string
 *   {{numero v [casas]}} → "1.234,56"
 *   {{moeda v [moeda]}}  → "R$ 1.234,56"
 *   {{data v [formato]}} → "19/05/2026"
 *   {{soma a b}} {{subtrai a b}} {{multiplica a b}} {{divide a b}} {{percentual parte total}}
 */
export function registerOdinHelpers(): void {
  if (registered) return;
  registered = true;

  const fmtNumber = (v: unknown, decimals: unknown = 2) => {
    const n = toNumber(v);
    const d = typeof decimals === "number" ? decimals : 2;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n);
  };

  const fmtCurrency = (v: unknown, currency: unknown = "BRL") => {
    const n = toNumber(v);
    const c = typeof currency === "string" ? currency : "BRL";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: c }).format(n);
  };

  const fmtDate = (v: unknown, format: unknown = "dd/MM/yyyy") => {
    const d = toDate(v);
    if (!d) return "";
    const fmt = typeof format === "string" ? format : "dd/MM/yyyy";
    const pad = (n: number) => String(n).padStart(2, "0");
    return fmt
      .replace(/yyyy/g, String(d.getFullYear()))
      .replace(/MM/g, pad(d.getMonth() + 1))
      .replace(/dd/g, pad(d.getDate()))
      .replace(/HH/g, pad(d.getHours()))
      .replace(/mm/g, pad(d.getMinutes()));
  };

  // PT-BR
  Handlebars.registerHelper("texto", (v: unknown) => (v == null ? "" : String(v)));
  Handlebars.registerHelper("numero", (v: unknown, decimals: unknown) =>
    fmtNumber(v, typeof decimals === "object" ? 2 : decimals)
  );
  Handlebars.registerHelper("moeda", (v: unknown, currency: unknown) =>
    fmtCurrency(v, typeof currency === "object" ? "BRL" : currency)
  );
  Handlebars.registerHelper("data", (v: unknown, format: unknown) =>
    fmtDate(v, typeof format === "object" ? "dd/MM/yyyy" : format)
  );

  // EN aliases
  Handlebars.registerHelper("text", (v: unknown) => (v == null ? "" : String(v)));
  Handlebars.registerHelper("number", (v: unknown, decimals: unknown) =>
    fmtNumber(v, typeof decimals === "object" ? 2 : decimals)
  );
  Handlebars.registerHelper("currency", (v: unknown, currency: unknown) =>
    fmtCurrency(v, typeof currency === "object" ? "BRL" : currency)
  );
  Handlebars.registerHelper("date", (v: unknown, format: unknown) =>
    fmtDate(v, typeof format === "object" ? "dd/MM/yyyy" : format)
  );

  // Arithmetic
  Handlebars.registerHelper("soma", (a: unknown, b: unknown) => toNumber(a) + toNumber(b));
  Handlebars.registerHelper("subtrai", (a: unknown, b: unknown) => toNumber(a) - toNumber(b));
  Handlebars.registerHelper("multiplica", (a: unknown, b: unknown) => toNumber(a) * toNumber(b));
  Handlebars.registerHelper("divide", (a: unknown, b: unknown) => {
    const d = toNumber(b);
    return d === 0 ? 0 : toNumber(a) / d;
  });
  Handlebars.registerHelper("percentual", (parte: unknown, total: unknown) => {
    const t = toNumber(total);
    return t === 0 ? 0 : (toNumber(parte) / t) * 100;
  });

  // EN aliases
  Handlebars.registerHelper("add", (a: unknown, b: unknown) => toNumber(a) + toNumber(b));
  Handlebars.registerHelper("subtract", (a: unknown, b: unknown) => toNumber(a) - toNumber(b));
  Handlebars.registerHelper("multiply", (a: unknown, b: unknown) => toNumber(a) * toNumber(b));
  Handlebars.registerHelper("divideBy", (a: unknown, b: unknown) => {
    const d = toNumber(b);
    return d === 0 ? 0 : toNumber(a) / d;
  });
}
