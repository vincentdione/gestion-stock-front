import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-facture-footer',
  templateUrl: './facture-footer.component.html',
  styleUrls: ['./facture-footer.component.scss']
})
export class FactureFooterComponent {

  @Input() paymentTerms!: string;
  @Input() paymentMethods: string[] = [];
  @Input() notes?: string;

}
