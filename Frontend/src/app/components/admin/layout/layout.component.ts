import { CommonModule } from '@angular/common';
import { Component, Renderer2, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AccountService, Account } from '../../../services/account.service';
import { UserService } from '../../../services/admin/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxes,
  faTags,
  faTshirt,
  faUsers,
  faShoppingCart,
  faAngleLeft,
  faAngleRight,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  showSearch = false;
  userName: string = ''; // ← thêm thuộc tính giữ tên người dùng
  private linkElements: HTMLLinkElement[] = [];
  isCollapsed = false;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  navItems = [
    { label: 'Brands', link: '/adminDashboard/brand', icon: faBoxes },
    { label: 'Categories', link: '/adminDashboard/category', icon: faTags },
    { label: 'Products', link: '/adminDashboard/product', icon: faTshirt },
    { label: 'Users', link: '/adminDashboard/users', icon: faUsers },
    { label: 'Orders', link: '/adminDashboard/order', icon: faShoppingCart },
    {
      label: 'Statistics',
      link: '/adminDashboard/statistics',
      icon: faChartLine,
    },
  ];

  // layout.component.ts
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.renderer.addClass(document.body, 'sidebar-collapse');
    } else {
      this.renderer.removeClass(document.body, 'sidebar-collapse');
    }
  }

  constructor(
    private renderer: Renderer2,
    private userService: UserService // ← inject service
  ) {}

  ngOnInit(): void {
    // 1) Load CSS như trước
    const links = [
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
      'assets/AdminLTE-master/dist/css/adminlte.min.css',
    ];
    links.forEach((linkHref) => {
      const linkEl = this.renderer.createElement('link');
      this.renderer.setAttribute(linkEl, 'rel', 'stylesheet');
      this.renderer.setAttribute(linkEl, 'href', linkHref);
      this.renderer.appendChild(document.head, linkEl);
      this.linkElements.push(linkEl);
    });

    this.userService.getCurrentUserName().subscribe({
      next: (name: string) => {
        this.userName = name;
      },
      error: (err) => {
        console.error('Không lấy được tên user:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.linkElements.forEach((linkEl) =>
      this.renderer.removeChild(document.head, linkEl)
    );
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
}
