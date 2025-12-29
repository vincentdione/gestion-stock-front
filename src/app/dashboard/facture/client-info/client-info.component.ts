import { Component, Input } from '@angular/core';

export interface Customer {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
}


@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent {
  @Input() customer!: Customer;

}
