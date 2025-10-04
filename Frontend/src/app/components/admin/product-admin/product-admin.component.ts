import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../dto/product.dto';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductAdminEditComponent } from '../product-admin-edit/product-admin-edit.component';
import { ProductAdminCreateComponent } from '../product-admin-create/product-admin-create.component';
import { ProductAdminDeleteComponent } from '../product-admin-delete/product-admin-delete.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-admin',
  imports: [CommonModule, RouterModule, MatDialogModule,FormsModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor(
    private productsService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts(this.currentPage);
  }

  getProducts(page: number): void {
    const itemsPerPage = 10; // số sản phẩm mỗi trang
    this.productsService.getProducts(page, itemsPerPage).subscribe(response => {
      this.products = response.items;
      this.totalPages = Math.ceil(response.total / itemsPerPage);
      this.currentPage = page;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  goToPage(page: number): void {
    this.getProducts(page);
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductAdminEditComponent, {
      width: '700px',
      data: { ...product },
      autoFocus: true, // Đảm bảo tiêu điểm di chuyển vào hộp thoại
      restoreFocus: true, // Khôi phục tiêu điểm sau khi đóng hộp thoại
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage);
      }
    });
  }
  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductAdminDeleteComponent, {
      width: '700px',
      data: { product }  // Truyền toàn bộ đối tượng product vào data
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage); // refresh danh sách sản phẩm sau khi xóa
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductAdminCreateComponent, {
      width: '10000px',
      data: {} 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage); 
      }
    });
  }
  

}
