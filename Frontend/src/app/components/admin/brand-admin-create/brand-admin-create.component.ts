import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BrandService } from '../../../services/admin/brand.service';
import { Brand } from '../../../dto/brand.dto';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Đảm bảo import FormsModule

@Component({
  selector: 'app-brand-admin-create',
  templateUrl: './brand-admin-create.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Đảm bảo FormsModule đã được import
  ],
  styleUrls: ['./brand-admin-create.component.scss'],
})
export class BrandAdminCreateComponent {
  brand: Brand = {
    id: 0,
    name: '',
  };

  constructor(
    private dialogRef: MatDialogRef<BrandAdminCreateComponent>,
    private brandService: BrandService
  ) {}

  onSubmit(): void {
    this.brandService.createBrand(this.brand).subscribe(
      () => {
        alert('Brand added successfully!');
        this.dialogRef.close(true); // return true to refresh list
      },
      (error) => {
        console.error('Error adding brand:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
