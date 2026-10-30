// Fonts, the logo and the bank details for invoice PDFs. Server side only: fonts and logo are read from
// disk once per server instance, bank details from env. Figtree (SIL Open Font License) is embedded and
// subset into each PDF. next.config.mjs traces the fonts and logo into the serverless bundle
// (outputFileTracingIncludes).

import { readFile } from "node:fs/promises";
import path from "node:path";

export type InvoiceAssets = {
  regular: Uint8Array;
  medium: Uint8Array;
  semibold: Uint8Array;
  logo: Uint8Array;
};

/** Bank transfer details shown on the invoice. Empty fields are left out. */
export type InvoiceBank = {
  bank: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  iban: string;
  bic: string;
  intermediaryBic: string;
  /** Free text (INVOICE_BANK_DETAILS), used when the structured fields are empty. */
  text: string;
};

let cache: Promise<InvoiceAssets> | undefined;

export function invoiceAssets(): Promise<InvoiceAssets> {
  cache ??= (async () => {
    const fonts = path.join(process.cwd(), "lib", "admin", "fonts");
    const [regular, medium, semibold, logo] = await Promise.all([
      readFile(path.join(fonts, "Figtree-Regular.ttf")),
      readFile(path.join(fonts, "Figtree-Medium.ttf")),
      readFile(path.join(fonts, "Figtree-SemiBold.ttf")),
      readFile(path.join(process.cwd(), "public", "logo.png")),
    ]);
    return { regular, medium, semibold, logo };
  })().catch((err) => {
    cache = undefined;
    throw err;
  });
  return cache;
}

const env = (k: string) => (process.env[k] ?? "").trim();

/** Bank details from the server-only INVOICE_BANK_* env (see .env.example). */
export function bankFromEnv(): InvoiceBank {
  return {
    bank: env("INVOICE_BANK_NAME"),
    accountName: env("INVOICE_BANK_ACCOUNT_NAME"),
    sortCode: env("INVOICE_BANK_SORT_CODE"),
    accountNumber: env("INVOICE_BANK_ACCOUNT_NUMBER"),
    iban: env("INVOICE_BANK_IBAN"),
    bic: env("INVOICE_BANK_BIC"),
    intermediaryBic: env("INVOICE_BANK_INTERMEDIARY_BIC"),
    text: env("INVOICE_BANK_DETAILS"),
  };
}
