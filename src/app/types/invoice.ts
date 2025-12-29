import { Customer } from "../dashboard/facture/client-info/client-info.component";

export interface Company {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
  website?: string;
  taxId?: string;
}

export interface InvoiceDetails {
  number: string;
  date: string;
  dueDate: string;
  currency: string;
}

export interface InvoiceItem {
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface InvoiceSummary {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface PaymentInfo {
  terms: string;
  methods: string[];
}

export interface InvoiceData {
  company: Company;
  customer: Customer;
  invoice: InvoiceDetails;
  items: InvoiceItem[];
  summary: InvoiceSummary;
  paymentInfo: PaymentInfo;
  notes?: string;
}