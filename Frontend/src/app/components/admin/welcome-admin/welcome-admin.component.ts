import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-admin',
  templateUrl: './welcome-admin.component.html',
  styleUrls: ['./welcome-admin.component.scss']
})
export class WelcomeAdminComponent implements OnInit {
  adminName = 'Admin';

  constructor() {}

  ngOnInit(): void {
    // Có thể lấy thông tin từ localStorage hoặc authService nếu có
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      this.adminName = storedName;
    }
  }
}
