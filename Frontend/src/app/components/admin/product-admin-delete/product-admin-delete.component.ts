import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../dto/product.dto';
import { ProductAdminService } from '../../../services/admin/productadmin.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Nếu sử dụng icon
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-admin-delete',
  templateUrl: './product-admin-delete.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule, // Nếu bạn dùng icon trong các button
    MatFormFieldModule,
    MatInputModule,
  ],
  styleUrls: ['./product-admin-delete.component.scss'],
})
export class ProductAdminDeleteComponent implements OnInit {
  product!: Product;

  constructor(
    private dialogRef: MatDialogRef<ProductAdminDeleteComponent>,
    private productAdminService: ProductAdminService,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {}

  ngOnInit(): void {
    this.product = this.data.product;
  }

  onDelete(): void {
    this.productAdminService.deleteProduct(this.product.id).subscribe({
      next: () => {
        alert('Product deleted sucessfully!');
        this.dialogRef.close(true); // đóng dialog và trả kết quả thành công
      },
      error: (err) => {
        console.error('Lỗi khi xoá sản phẩm:', err);
        alert('Xoá thất bại: ' + err.message);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
