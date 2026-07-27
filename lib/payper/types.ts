export type PayperInvoiceLine = {
  description: string;
  quantity: number;
  price_per_unit: number;
  include_vat: true;
  catalog_id?: string;
  currency_symbol: "ILS";
};

export type PayperReceiptLine = {
  payment_type: "Cc";
  date: string;
  amount: number;
  currency_symbol: "ILS";
  cc_num: string;
  proof_number: string;
  num_of_payments: number;
  cc_payment_type?: 1;
};

export type PayperInvoiceReceiptRequest = {
  api_user: string;
  customer_mail: string;
  customer_name: string;
  customer_mobile: string;
  customer_address: string;
  customer_city: string;
  customer_zip_code?: string;
  order_id: string;
  document_subject: string;
  document_remarks?: string;
  document_lang: "hb";
  send_by_mail: boolean;
  invoice_lines: PayperInvoiceLine[];
  receipt_lines: PayperReceiptLine[];
};

export type PayperDocumentResponse = {
  result: string;
  description: string;
  document_id?: string;
  document_system_id?: number;
  document_link?: string;
  thermal_link?: string;
};

export type PaidStoreOrder = {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    notes?: string;
  };
  lines: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  shipping: number;
  total: number;
  payment: {
    paidAt: Date;
    lastFour: string;
    approvalNumber: string;
    installments: number;
  };
};
