import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../../../services/admin/order.service';
import { Order } from '../../../dto/order.dto';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Đảm bảo import FormsModule

@Component({
  selector: 'app-order-admin-delete',
  templateUrl: './order-admin-delete.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./order-admin-delete.component.scss'],
})
export class OrderAdminDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderAdminDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private orderService: OrderService
  ) {}

  onDelete(): void {
    this.orderService.deleteOrder(this.data.id).subscribe(
      () => {
        alert('Order deleted successfully!');
        this.dialogRef.close(true); // Đóng dialog và trả kết quả
      },
      (error) => {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    );
  }

  // Đóng dialog mà không làm gì
  onCancel(): void {
    this.dialogRef.close();
  }
}
