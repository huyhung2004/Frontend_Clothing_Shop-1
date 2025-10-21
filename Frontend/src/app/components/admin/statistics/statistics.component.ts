import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SharedService } from '../../../services/admin/statistics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnDestroy {
  isLoading = true;
  
  // Thống kê tổng quan
  totalRevenue: number = 0;
  totalOrders: number = 0;
  averageOrderValue: number = 0;
  averageItemsPerOrder: number = 0;

  // Dữ liệu biểu đồ
  monthlyRevenueData: any[] = [];
  topProducts: any[] = [];
  userGrowthData: any[] = [];
  orderStatusData: any[] = [];

  // Chart instances
  revenueChart: any;
  productChart: any;
  userGrowthChart: any;
  statusChart: any;

  constructor(private statisticsService: SharedService) {}

  ngOnInit() {
    this.loadAllStatistics();
  }

  loadAllStatistics() {
    this.isLoading = true;

    // Load tổng quan
    this.statisticsService.getTotalRevenue().subscribe({
      next: (data) => {
        this.totalRevenue = data.totalRevenue;
        this.totalOrders = data.totalOrders;
        this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
      },
      error: (error) => console.error('Lỗi khi tải tổng doanh thu:', error)
    });

    // Load average items per order
    this.statisticsService.loadAverageItemsPerOrder().subscribe({
      next: (data: any) => {
        this.averageItemsPerOrder = data.averageItemsPerOrder;
      },
      error: (error) => console.error('Lỗi khi tải TB sản phẩm/đơn:', error)
    });

    // Load biểu đồ doanh thu
    this.statisticsService.getMonthlyRevenueChart().subscribe({
      next: (data) => {
        this.monthlyRevenueData = data;
        setTimeout(() => this.renderRevenueChart(), 100);
      },
      error: (error) => console.error('Lỗi khi tải biểu đồ doanh thu:', error)
    });

    // Load sản phẩm bán chạy
    this.statisticsService.getTopSellingProducts(5).subscribe({
      next: (data) => {
        this.topProducts = data;
        setTimeout(() => this.renderProductChart(), 100);
      },
      error: (error) => console.error('Lỗi khi tải sản phẩm bán chạy:', error)
    });

    // Load tăng trưởng người dùng
    this.statisticsService.getUserGrowth().subscribe({
      next: (data) => {
        this.userGrowthData = data;
        setTimeout(() => this.renderUserGrowthChart(), 100);
      },
      error: (error) => console.error('Lỗi khi tải tăng trưởng người dùng:', error)
    });

    // Load đơn hàng theo trạng thái
    this.statisticsService.loadordersbystatus().subscribe({
      next: (data) => {
        this.orderStatusData = data;
        setTimeout(() => this.renderStatusChart(), 100);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải trạng thái đơn hàng:', error);
        this.isLoading = false;
      }
    });
  }

  renderRevenueChart() {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) {
      console.log('Không tìm thấy canvas revenueChart');
      return;
    }

    const labels = this.monthlyRevenueData.map(d => d.month);
    const revenues = this.monthlyRevenueData.map(d => d.revenue);
    const orders = this.monthlyRevenueData.map(d => d.orderCount);

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: revenues,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Số đơn hàng',
            data: orders,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Doanh thu (VNĐ)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Số đơn hàng'
            },
            grid: {
              drawOnChartArea: false,
            }
          }
        }
      }
    });
  }

  renderProductChart() {
    if (this.productChart) {
      this.productChart.destroy();
    }

    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    if (!ctx) {
      console.log('Không tìm thấy canvas productChart');
      return;
    }

    const labels = this.topProducts.map(p => p.productName);
    const data = this.topProducts.map(p => p.totalSold);

    this.productChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Số lượng đã bán',
          data: data,
          backgroundColor: [
            '#667eea',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#3b82f6'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số lượng'
            }
          }
        }
      }
    });
  }

  renderUserGrowthChart() {
    if (this.userGrowthChart) {
      this.userGrowthChart.destroy();
    }

    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    if (!ctx) {
      console.log('Không tìm thấy canvas userGrowthChart');
      return;
    }

    const labels = this.userGrowthData.map(d => d.month);
    const newUsers = this.userGrowthData.map(d => d.newUsers);
    const totalUsers = this.userGrowthData.map(d => d.totalUsers);

    this.userGrowthChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Người dùng mới',
            data: newUsers,
            backgroundColor: '#667eea',
            borderWidth: 0
          },
          {
            label: 'Tổng người dùng',
            data: totalUsers,
            backgroundColor: '#10b981',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số người dùng'
            }
          }
        }
      }
    });
  }

  renderStatusChart() {
    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) {
      console.log('Không tìm thấy canvas statusChart');
      return;
    }

    const labels = this.orderStatusData.map(d => d.status);
    const data = this.orderStatusData.map(d => d.count);

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#667eea',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#3b82f6',
            '#ec4899'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.productChart) this.productChart.destroy();
    if (this.userGrowthChart) this.userGrowthChart.destroy();
    if (this.statusChart) this.statusChart.destroy();
  }
}
