import { Component, Input } from '@angular/core';
import { InvoiceItem } from 'src/app/types/invoice';
import { formatCurrency } from 'src/app/utils/formatters';


@Component({
  selector: 'app-facture-items',
  templateUrl: './facture-items.component.html',
  styleUrls: ['./facture-items.component.scss']
})
export class FactureItemsComponent {

  @Input() items: InvoiceItem[] = [];

  ngOnInit(): void {
    console.log("items ====== ",this.items);
  }

  format(value: number, currency: string): string {
    return formatCurrency(value, currency);
  }

  getTotal(item: InvoiceItem): number {
    return item.quantity * item.unitPrice;
  }

}
