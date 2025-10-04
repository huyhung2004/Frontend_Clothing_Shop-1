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
  selector: 'app-category-admin-edit',
  templateUrl: './category-admin-edit.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./category-admin-edit.component.scss'],
})
export class CategoryAdminEditComponent {
  category: Category;

  constructor(
    private dialogRef: MatDialogRef<CategoryAdminEditComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) data: Category
  ) {
    this.category = { ...data };
  }

  onSubmit(): void {
    this.categoryService
      .updateCategory(this.category.id, this.category)
      .subscribe(
        () => {
          alert('Category updated successfully!');
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
