import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/admin/user.service';
import { User } from '../../../dto/user.dto';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-user-admin-edit',
  templateUrl: './user-admin-edit.component.html',
  styleUrls: ['./user-admin-edit.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
})
export class UserAdminEditComponent {
  user: User;

  constructor(
    private dialogRef: MatDialogRef<UserAdminEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService
  ) {
    // Clone dữ liệu gốc để tránh sửa trực tiếp
    this.user = { ...data };
  }

  onSubmit(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
