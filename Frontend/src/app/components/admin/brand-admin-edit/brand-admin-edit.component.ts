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
  selector: 'app-brand-admin-edit',
  templateUrl: './brand-admin-edit.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./brand-admin-edit.component.scss'],
})
export class BrandAdminEditComponent {
  brand: Brand;

  constructor(
    private dialogRef: MatDialogRef<BrandAdminEditComponent>,
    private brandService: BrandService,
    @Inject(MAT_DIALOG_DATA) data: Brand
  ) {
    this.brand = { ...data };
  }

  onSubmit(): void {
    this.brandService.updateBrand(this.brand.id, this.brand).subscribe(
      () => {
        alert('Brand updated successfully!');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error updating brand:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
