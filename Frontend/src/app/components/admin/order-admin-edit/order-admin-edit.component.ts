// order-status-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../dto/order.dto';
import { OrderService } from '../../../services/admin/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin-edit',
  templateUrl: './order-admin-edit.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./order-admin-edit.component.scss'],
})
export class OrderAdminEditComponent {
  order: Order;
  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(
    public dialogRef: MatDialogRef<OrderAdminEditComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    this.order = { ...data };
  }

  onSubmit(): void {
    this.orderService.updateOrder(this.order.id, this.order).subscribe(
      () => {
        alert('Order status updated successfully!');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close(); // Đóng mà không thay đổi gì
  }
}
