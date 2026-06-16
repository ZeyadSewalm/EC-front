import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
 @Input() order: any;

  ngOnInit(): void {
    console.log('Receipt loaded:', this.order);
  }

  get subtotal() {
    return this.order?.vendor_total?.subtotal || 0;
  }

  get shipping() {
    return this.order?.vendor_total?.shipping_amount || 0;
  }

  get taxFee() {
    return this.order?.vendor_total?.tax_fee || 0;
  }

  get serviceFee() {
    return this.order?.vendor_total?.service_fee || 0;
  }

  get total() {
    return this.order?.vendor_total?.total || 0;
  }



}
