import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/admin/category.service';
import { Category } from '../../../dto/category.dto';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Đảm bảo import FormsModule

@Component({
  selector: 'app-category-admin-create',
  templateUrl: './category-admin-create.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./category-admin-create.component.scss'],
})
export class CategoryAdminCreateComponent {
  category: Category = {
    id: 0,
    name: '',
  };

  constructor(
    private dialogRef: MatDialogRef<CategoryAdminCreateComponent>,
    private categoryService: CategoryService
  ) {}

  onSubmit(): void {
    this.categoryService.createCategory(this.category).subscribe(
      () => {
        alert('Category added successfully!');
        this.dialogRef.close(true); // return true to refresh list
      },
      (error) => {
        console.error('Error adding category:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
