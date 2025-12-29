import { InvoiceData } from "../types/invoice";

// Calculate sample invoice totals
const items = [
  {
    description: 'Website Design',
    details: 'Custom responsive website design with 5 pages',
    quantity: 1,
    unitPrice: 1200,
    currency: 'EUR'
  },
  {
    description: 'Logo Design',
    details: 'Original logo design with 3 revisions',
    quantity: 1,
    unitPrice: 600,
    currency: 'EUR'
  },
  {
    description: 'Hosting (Annual)',
    details: '12 months of premium hosting services',
    quantity: 1,
    unitPrice: 240,
    currency: 'EUR'
  },
  {
    description: 'SEO Package',
    details: 'Basic search engine optimization package',
    quantity: 1,
    unitPrice: 350,
    currency: 'EUR'
  }
];

const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
const taxRate = 20; // 20% VAT
const taxAmount = subtotal * (taxRate / 100);
const total = subtotal + taxAmount;

export const sampleInvoice: InvoiceData = {
  company: {
    name: 'Design Studio Pro',
    address: '123 Creative St, Paris, 75001, France',
    email: 'contact@designstudiopro.com',
    phone: '+33 1 23 45 67 89',
    website: 'www.designstudiopro.com',
    taxId: 'FR123456789'
  },
  customer: {
    name: 'Jean Dupont',
    company: 'Café Parisien',
    address: '456 Rue de Paris, Lyon, 69001, France',
    email: 'jean@cafeparisien.com',
    phone: '+33 6 12 34 56 78'
  },
  invoice: {
    number: 'INV-2025-001',
    date: '15/05/2025',
    dueDate: '14/06/2025',
    currency: 'EUR'
  },
  items: items,
  summary: {
    subtotal,
    taxRate,
    taxAmount,
    total
  },
  paymentInfo: {
    terms: 'Payment due within 30 days. Late payments subject to a 2% monthly fee.',
    methods: ['Bank Transfer', 'Credit Card', 'PayPal']
  },
  notes: 'Thank you for your business. For questions concerning this invoice, please contact our accounting department.'
};