import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../table/table.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { MychartComponent } from '../mychart/mychart.component';

@Component({
  selector: 'app-statistics',
  imports: [MychartComponent, TableComponent, StatCardComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  totalRevenue: number = 0;
  averageOrderValue: number = 0;
  averageItemsPerOrder: number = 0;
  averageOrdersToday: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTotalRevenue();
    this.loadAverageOrderValue();
    this.loadAverageItemsPerOrder();
    this.loadAverageOrdersToday();
  }

  loadTotalRevenue() {
    // Updated the API URL to localhost:7163
    this.http
      .get<any>('https://localhost:7163/api/statistics/total-revenue')
      .subscribe((data) => {
        this.totalRevenue = data.totalRevenue;
      });
  }

  loadAverageOrderValue() {
    // Updated the API URL to localhost:7163
    this.http
      .get<number>('https://localhost:7163/api/statistics/average-order-value')
      .subscribe((data) => {
        this.averageOrderValue = data;
      });
  }

  loadAverageItemsPerOrder() {
    // Updated the API URL to localhost:7163
    this.http
      .get<any>('https://localhost:7163/api/statistics/average-items-per-order')
      .subscribe((data) => {
        this.averageItemsPerOrder = data.averageItemsPerOrder;
      });
  }

  loadAverageOrdersToday() {
    this.http
      .get<any>('https://localhost:7163/api/statistics/average-orders-today')
      .subscribe((data) => {
        this.averageOrdersToday = data.totalOrders;
      });
  }
}
