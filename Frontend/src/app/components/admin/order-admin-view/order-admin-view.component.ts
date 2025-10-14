import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../dto/order.dto';
import { OrderService } from '../../../services/admin/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-admin-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-admin-view.component.html',
  styleUrls: ['./order-admin-view.component.scss'],
})
export class OrderAdminViewComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<OrderAdminViewComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.orderService.getOrderById(this.data.id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.loading = false;
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'processing':
        return 'badge bg-info';
      case 'shipped':
        return 'badge bg-primary';
      case 'delivered':
        return 'badge bg-success';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getTotalQuantity(): number {
    return this.order?.orderDetails?.reduce((sum, detail) => sum + (detail.numberOfProducts || 0), 0) || 0;
  }
}

