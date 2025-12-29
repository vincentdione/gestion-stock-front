import { Component, Input } from '@angular/core';
import { Entreprise } from 'src/app/api/model/entreprise';

@Component({
  selector: 'app-facture-header',
  templateUrl: './facture-header.component.html',
  styleUrls: ['./facture-header.component.scss']
})
export class FactureHeaderComponent {
  @Input() entreprise!: Entreprise;

}
