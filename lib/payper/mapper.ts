import type { PaidStoreOrder, PayperInvoiceReceiptRequest } from "@/lib/payper/types";

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function payperDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(date).replaceAll("/", "-");
}

export function buildInvoiceReceipt(
  order: PaidStoreOrder,
  apiUser: string,
): PayperInvoiceReceiptRequest {
  const invoiceLines: PayperInvoiceReceiptRequest["invoice_lines"] = order.lines.map((line) => ({
    description: line.name,
    quantity: line.quantity,
    price_per_unit: money(line.unitPrice),
    include_vat: true,
    catalog_id: line.sku,
    currency_symbol: "ILS",
  }));

  if (order.shipping > 0) {
    invoiceLines.push({
      description: "משלוח",
      quantity: 1,
      price_per_unit: money(order.shipping),
      include_vat: true,
      catalog_id: "SHIPPING",
      currency_symbol: "ILS",
    });
  }

  return {
    api_user: apiUser,
    customer_mail: order.customer.email,
    customer_name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    customer_mobile: order.customer.phone,
    customer_address: order.customer.street,
    customer_city: order.customer.city,
    ...(order.customer.postalCode ? { customer_zip_code: order.customer.postalCode } : {}),
    order_id: order.orderId,
    document_subject: `הזמנת NIC POUCH ${order.orderId}`,
    ...(order.customer.notes ? { document_remarks: order.customer.notes } : {}),
    document_lang: "hb",
    send_by_mail: true,
    invoice_lines: invoiceLines,
    receipt_lines: [{
      payment_type: "Cc",
      date: payperDate(order.payment.paidAt),
      amount: money(order.total),
      currency_symbol: "ILS",
      cc_num: order.payment.lastFour,
      proof_number: order.payment.approvalNumber,
      num_of_payments: order.payment.installments,
      ...(order.payment.installments > 1 ? { cc_payment_type: 1 as const } : {}),
    }],
  };
}
