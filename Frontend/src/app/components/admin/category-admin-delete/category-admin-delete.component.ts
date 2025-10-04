import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../services/admin/category.service';
import { Category } from '../../../dto/category.dto';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Đảm bảo import FormsModule

@Component({
  selector: 'app-category-admin-delete',
  templateUrl: './category-admin-delete.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./category-admin-delete.component.scss'],
})
export class CategoryAdminDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryAdminDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string },
    private categoryService: CategoryService
  ) {}

  onDelete(): void {
    this.categoryService.deleteCategory(this.data.id).subscribe(
      () => {
        alert('Category deleted successfully!');
        this.dialogRef.close(true); // Đóng dialog và trả kết quả
      },
      (error) => {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    );
  }

  // Đóng dialog mà không làm gì
  onCancel(): void {
    this.dialogRef.close();
  }
}
