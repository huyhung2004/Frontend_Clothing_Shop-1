import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-user-admin-create',
  templateUrl: './user-admin-create.component.html',
  styleUrls: ['./user-admin-create.component.scss'],
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
export class UserAdminCreateComponent {
  user: User = {
    id: 0,
    fullname: '',
    phoneNumber: '',
    password: '',
    createdAt: undefined,
    updatedAt: undefined,
    isActive: true,
    facebookAccountId: undefined,
    googleAccountId: undefined,
    roleId: undefined,
  };

  constructor(
    private dialogRef: MatDialogRef<UserAdminCreateComponent>,
    private userService: UserService
  ) {}

  onSubmit(): void {
    this.userService.createUser(this.user).subscribe({
      next: () => {
        alert('User added successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error adding user:', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
