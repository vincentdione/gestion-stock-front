import { Component, Input } from '@angular/core';

export function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(value);
}


@Component({
  selector: 'app-facture-summary',
  templateUrl: './facture-summary.component.html',
  styleUrls: ['./facture-summary.component.scss']
})
export class FactureSummaryComponent {

  @Input() subtotal!: number;
  // @Input() taxRate!: number;
  @Input() taxAmount!: number;
  @Input() total!: number;
  @Input() currency: string = 'EUR';

  format(value: number): string {
    return formatCurrency(value, this.currency);
  }
}
