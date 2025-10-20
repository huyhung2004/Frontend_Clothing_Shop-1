import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
}

interface Activity {
  type: string;
  icon: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-welcome-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome-admin.component.html',
  styleUrls: ['./welcome-admin.component.scss']
})
export class WelcomeAdminComponent implements OnInit {
  adminName = 'Admin';
  currentDate = new Date();

  stats: Stats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  };

  recentActivities: Activity[] = [
    {
      type: 'success',
      icon: 'fas fa-shopping-cart',
      text: 'Đơn hàng #DH001 đã được đặt thành công',
      time: '5 phút trước'
    },
    {
      type: 'info',
      icon: 'fas fa-user-plus',
      text: 'Người dùng mới "Nguyễn Văn A" đã đăng ký',
      time: '15 phút trước'
    },
    {
      type: 'warning',
      icon: 'fas fa-tshirt',
      text: 'Sản phẩm "Áo thun nam" sắp hết hàng',
      time: '1 giờ trước'
    },
    {
      type: 'primary',
      icon: 'fas fa-box',
      text: 'Đơn hàng #DH002 đã được giao thành công',
      time: '2 giờ trước'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Lấy thông tin admin từ localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.adminName = storedName;
    }

    // Tải dữ liệu thống kê
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Tạm thời dùng dữ liệu mẫu, sau này có thể kết nối API
    this.stats = {
      totalOrders: 248,
      totalRevenue: 45500000,
      totalProducts: 156,
      totalUsers: 89
    };

    // TODO: Uncomment khi có API
    // this.statisticsService.getStats().subscribe(data => {
    //   this.stats = data;
    // });
  }
}
