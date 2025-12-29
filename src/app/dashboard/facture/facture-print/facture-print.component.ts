import { Component } from '@angular/core';
import { sampleInvoice } from 'src/app/data/sampleInvoice';
import { InvoiceData } from 'src/app/types/invoice';

@Component({
  selector: 'app-facture-print',
  templateUrl: './facture-print.component.html',
  styleUrls: ['./facture-print.component.scss']
})
export class FacturePrintComponent {

  invoiceData: InvoiceData = sampleInvoice;

  handlePrint(): void {
    window.print();
  }

}
