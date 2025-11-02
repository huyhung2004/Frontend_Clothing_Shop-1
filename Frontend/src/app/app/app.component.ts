import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Loader
  isLoading$: Observable<boolean>;

  // Navbar padding theo route
  showNavbarPadding = true;

  // Danh sách route cần padding (không bị header che)
  private routesWithPadding = ['/product', '/account', '/cart', '/product-detail'];

  constructor(private loaderService: LoaderService, private router: Router) {
    // Gán isLoading$ giá trị từ LoaderService
    this.isLoading$ = this.loaderService.isLoading.asObservable();

    // Lắng nghe thay đổi route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if URL starts with any route that requires padding
        this.showNavbarPadding = this.routesWithPadding.some(route =>
          event.urlAfterRedirects.startsWith(route)
        );
      });

  }
}
