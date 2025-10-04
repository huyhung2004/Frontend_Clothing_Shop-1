import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/admin/order.service';
import { Order } from '../../../dto/order.dto';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderAdminEditComponent } from '../order-admin-edit/order-admin-edit.component';
import { OrderAdminDeleteComponent } from '../order-admin-delete/order-admin-delete.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin',
  imports: [CommonModule, RouterModule, MatDialogModule, FormsModule],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.scss',
})
export class OrderAdminComponent implements OnInit {
  orders: Order[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  itemsPerPage = 10;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getOrders(this.currentPage);
  }

  getOrders(page: number): void {
    this.orderService.getOrders(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.currentPage = page;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.getOrders(page);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getOrders(page);
    }
  }

  openEditDialog(order: Order): void {
    const dialogRef = this.dialog.open(OrderAdminEditComponent, {
      width: '900px',
      height: '80vh', // giới hạn chiều cao
      maxHeight: '80vh', // hoặc chỉ dùng maxHeight
      data: { ...order },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrders(this.currentPage);
      }
    });
  }
  openDeleteDialog(order: Order): void {
    const dialogRef = this.dialog.open(OrderAdminDeleteComponent, {
      width: '500px',
      data: { id: order.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrders(this.currentPage); // refresh brand list sau khi xóa
      }
    });
  }
}
