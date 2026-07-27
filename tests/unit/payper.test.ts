import { describe, expect, it } from "vitest";
import { buildInvoiceReceipt } from "@/lib/payper/mapper";
import type { PaidStoreOrder } from "@/lib/payper/types";

const order: PaidStoreOrder = {
  orderId: "NIC-1001",
  customer: {
    firstName: "דנה",
    lastName: "כהן",
    email: "dana@example.com",
    phone: "0501234567",
    street: "הרצל 10",
    city: "תל אביב",
    postalCode: "6100000",
  },
  lines: [{
    sku: "NOIS-CHERRY",
    name: "NOIS דובדבן אקסטרים",
    quantity: 5,
    unitPrice: 28,
  }],
  shipping: 29,
  total: 169,
  payment: {
    paidAt: new Date("2026-07-27T10:30:00+03:00"),
    lastFour: "1234",
    approvalNumber: "987654",
    installments: 1,
  },
};

describe("Payper invoice-receipt mapping", () => {
  it("maps a paid order to Payper without exposing full card details", () => {
    const payload = buildInvoiceReceipt(order, "api@nicpouch.co.il");

    expect(payload.api_user).toBe("api@nicpouch.co.il");
    expect(payload.order_id).toBe("NIC-1001");
    expect(payload.customer_mail).toBe("dana@example.com");
    expect(payload.invoice_lines).toEqual([
      {
        description: "NOIS דובדבן אקסטרים",
        quantity: 5,
        price_per_unit: 28,
        include_vat: true,
        catalog_id: "NOIS-CHERRY",
        currency_symbol: "ILS",
      },
      {
        description: "משלוח",
        quantity: 1,
        price_per_unit: 29,
        include_vat: true,
        catalog_id: "SHIPPING",
        currency_symbol: "ILS",
      },
    ]);
    expect(payload.receipt_lines[0]).toMatchObject({
      payment_type: "Cc",
      amount: 169,
      cc_num: "1234",
      proof_number: "987654",
      num_of_payments: 1,
    });
    expect(JSON.stringify(payload)).not.toContain("cardNumber");
  });

  it("marks multi-payment credit-card transactions correctly", () => {
    const payload = buildInvoiceReceipt({
      ...order,
      payment: { ...order.payment, installments: 3 },
    }, "api@nicpouch.co.il");

    expect(payload.receipt_lines[0].cc_payment_type).toBe(1);
  });
});
