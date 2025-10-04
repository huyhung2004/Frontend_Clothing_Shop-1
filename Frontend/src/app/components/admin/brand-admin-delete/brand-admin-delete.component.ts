import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrandService } from '../../../services/admin/brand.service';
import { Brand } from '../../../dto/brand.dto';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Đảm bảo import FormsModule

@Component({
  selector: 'app-brand-admin-delete',
  templateUrl: './brand-admin-delete.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./brand-admin-delete.component.scss'],
})
export class BrandAdminDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BrandAdminDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string },
    private brandService: BrandService
  ) {}

  // Hàm xóa brand
  onDelete(): void {
    this.brandService.deleteBrand(this.data.id).subscribe(
      () => {
        alert('Brand deleted successfully!');
        this.dialogRef.close(true); // Đóng dialog và trả kết quả
      },
      (error) => {
        console.error('Error deleting brand:', error);
        alert('Error deleting brand');
      }
    );
  }

  // Đóng dialog mà không làm gì
  onCancel(): void {
    this.dialogRef.close();
  }
}
