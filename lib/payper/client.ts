import "server-only";

import type {
  PaidStoreOrder,
  PayperDocumentResponse,
} from "@/lib/payper/types";
import { buildInvoiceReceipt } from "@/lib/payper/mapper";

const PAYPER_API_BASE_URL = "https://app.payper.co.il/api";

function credentials() {
  const apiKey = process.env.PAYPER_API_KEY;
  const apiUser = process.env.PAYPER_API_USER;

  if (!apiKey || !apiUser) {
    throw new Error("Payper is not configured: PAYPER_API_KEY and PAYPER_API_USER are required");
  }

  return { apiKey, apiUser };
}

export async function createPayperInvoiceReceipt(
  order: PaidStoreOrder,
): Promise<PayperDocumentResponse> {
  const { apiKey, apiUser } = credentials();
  const response = await fetch(`${PAYPER_API_BASE_URL}/generate_invoice_receipt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      API_KEY: apiKey,
    },
    body: JSON.stringify(buildInvoiceReceipt(order, apiUser)),
    cache: "no-store",
  });

  const body = await response.json() as PayperDocumentResponse;
  if (!response.ok || body.result !== "200") {
    throw new Error(`Payper document generation failed (${body.result || response.status}): ${body.description || "Unknown error"}`);
  }

  return body;
}
