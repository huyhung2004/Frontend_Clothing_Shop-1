import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Product } from '../../../dto/product.dto';
import { ProductAdminService } from '../../../services/admin/productadmin.service';

@Component({
  selector: 'app-product-admin-create',
  templateUrl: './product-admin-create.component.html',
  styleUrls: ['./product-admin-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class ProductAdminCreateComponent {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    brandId: 0,
    categoryId: 0,
    // Thêm các field khác nếu cần
  };

  categories = [
    { id: 1, name: 'Áo thun' },
    { id: 2, name: 'Áo khoác' },
    { id: 3, name: 'Áo kiểu' },
    { id: 4, name: 'Đầm ngắn' },
    { id: 5, name: 'Váy' },
    { id: 6, name: 'Quần' },
  ];

  brands = [
    { id: 1, name: 'Nike' },
    { id: 2, name: 'Adidas' },
    { id: 3, name: 'Puma' },
    { id: 4, name: 'Reebook' },
    { id: 5, name: 'Under Armour' },
    { id: 6, name: 'New Balance' },
    { id: 7, name: 'Asics' },
    { id: 8, name: 'Fila' },
    { id: 9, name: 'Converse' },
    { id: 10, name: 'Vans' },
  ];

  constructor(
    private dialogRef: MatDialogRef<ProductAdminCreateComponent>,
    private productAdminService: ProductAdminService
  ) {}

  onSubmit(): void {
    this.productAdminService.createProduct(this.product).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Lỗi khi tạo sản phẩm:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
