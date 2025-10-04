import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../services/admin/user.service';
import { User } from '../../../dto/user.dto';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Nếu sử dụng icon
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-admin-delete',
  templateUrl: './user-admin-delete.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule, // Nếu bạn dùng icon trong các button
    MatFormFieldModule,
    MatInputModule,
  ],
  styleUrls: ['./user-admin-delete.component.scss'],
})
export class UserAdminDeleteComponent {
  constructor(
    private dialogRef: MatDialogRef<UserAdminDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService
  ) {}

  onDelete(): void {
    this.userService.deleteUser(this.data.id).subscribe({
      next: () => {
        alert('User deleted successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        // Nếu server trả về 409 Conflict nghĩa là không thể xóa do ràng buộc
        if (error.status === 409) {
          alert('User đang liên quan đến các dịch vụ khác, không thể xóa');
        } else {
          console.error('Error deleting user:', error);
          alert('User is involved in other services, cannot be deleted');
        }
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
