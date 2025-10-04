import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/admin/user.service';
import { User } from '../../../dto/user.dto';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserAdminCreateComponent } from '../user-admin-create/user-admin-create.component';
import { UserAdminEditComponent } from '../user-admin-edit/user-admin-edit.component';
import { UserAdminDeleteComponent } from '../user-admin-delete/user-admin-delete.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-admin',
  imports: [CommonModule, RouterModule, MatDialogModule, FormsModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss',
})
export class UserAdminComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  itemsPerPage = 10;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers(this.currentPage);
  }

  getUsers(page: number): void {
    this.userService.getUsers(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.currentPage = page;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.getUsers(page);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getUsers(page);
    }
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserAdminCreateComponent, {
      width: '500px', // Chỉnh kích thước dialog tùy ý
    });

    // Lắng nghe sự kiện khi dialog đóng
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Khi dialog đóng và có kết quả, refresh danh sách người dùng
        this.getUsers(this.currentPage);
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserAdminEditComponent, {
      width: '600px',
      data: { ...user },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUsers(this.currentPage);
      }
    });
  }
  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(UserAdminDeleteComponent, {
      width: '500px',
      data: { id: user.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUsers(this.currentPage); // refresh brand list sau khi xóa
      }
    });
  }
}
