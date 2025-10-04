import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Checkout, CheckoutService } from '../../services/checkout.service';
import {
  PaymentService,
  PaymentRequest,
  PaymentResponse,
} from '../../services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';

@Component({
  selector: 'app-checkoutbuynow',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkoutbuynow.component.html',
  styleUrls: ['./checkoutbuynow.component.scss'],
})
export class CheckoutbuynowComponent implements OnInit {
  checkoutForm: FormGroup;
  totalPrice: number = 0;
  shippingCost: number = 1;
  grandTotal: number = 0;
  checkoutItems: Checkout[] = [];
  orderId: number = 0; // Lưu orderId lấy từ URL
  isLoading = false;
  // Danh sách phương thức thanh toán
  paymentMethods = [
    { id: 'Paypal', label: 'Paypal' },
    { id: 'Direct Bank Transfer', label: 'Direct Bank Transfer' },
    { id: 'Cash on Delivery', label: 'Cash on Delivery' },
  ];

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) {
    this.checkoutForm = this.fb.group({
      fullname: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10,11}$')],
      ],
      address: ['', Validators.required],
      paymentMethod: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Xử lý callback sau thanh toán PayPal (ví dụ: ?paymentStatus=success&token=PAYPAL_ORDER_ID)
    this.route.queryParamMap.subscribe((params) => {
      const paymentStatus = params.get('paymentStatus');
      if (paymentStatus === 'success') {
        // Bật spinner
        this.isLoading = true;

        const token = params.get('token'); // token nhận từ PayPal (OrderID)
        const orderRequestString = sessionStorage.getItem('orderRequest');
        if (orderRequestString) {
          const orderRequest: Checkout = JSON.parse(orderRequestString);
          // Nếu có token, gọi capturePayment để lấy CaptureId trước khi đặt đơn hàng
          if (token) {
            this.paymentService
              .capturePayment(token, orderRequest.id)
              .subscribe({
                next: (captureRes) => {
                  // Sau khi capture thành công, đặt đơn hàng
                  this.checkoutService
                    .placeOrderBuyNow(orderRequest)
                    .subscribe({
                      next: () => {
                        sessionStorage.removeItem('orderRequest');
                        sessionStorage.removeItem('selectedItems');
                        // Khi hoàn tất, chuyển hướng -> spinner sẽ biến mất do component bị unload
                        this.router.navigate(['/account'], {
                          replaceUrl: true,
                        });
                      },
                      error: (err) => {
                        alert('Có lỗi xảy ra khi đặt hàng.');
                        console.error(err);
                        // Tắt spinner nếu có lỗi
                        this.isLoading = false;
                      },
                    });
                },
                error: (err) => {
                  alert('Lỗi khi capture thanh toán.');
                  console.error(err);
                  // Tắt spinner nếu có lỗi
                  this.isLoading = false;
                },
              });
          } else if (orderRequest.paymentMethod === 'Direct Bank Transfer') {
            // Sau khi capture thành công, đặt đơn hàng
            this.checkoutService.placeOrderBuyNow(orderRequest).subscribe({
              next: () => {
                sessionStorage.removeItem('orderRequest');
                sessionStorage.removeItem('selectedItems');
                this.router.navigate(['/account'], { replaceUrl: true });
              },
              error: (err) => {
                alert('Có lỗi xảy ra khi đặt hàng.');
                console.error(err);
                this.isLoading = false;
              },
            });
          } else {
            // Nếu không có token, gọi đặt hàng thông thường (có thể là các phương thức khác)
            this.checkoutService.placeOrderBuyNow(orderRequest).subscribe({
              next: () => {
                sessionStorage.removeItem('orderRequest');
                sessionStorage.removeItem('selectedItems');
                this.router.navigate(['/account']);
              },
              error: (err) => {
                alert('Có lỗi xảy ra khi đặt hàng.');
                console.error(err);
                this.isLoading = false;
              },
            });
          }
        }
      }
    });
    // Lấy orderId từ route parameter
    this.route.paramMap.subscribe((params: ParamMap) => {
      const orderId = Number(params.get('orderId'));
      this.orderId = orderId;
      console.log('OrderId:', orderId);
      if (orderId) {
        // Gọi API lấy thông tin checkout buy now sử dụng orderId
        this.checkoutService.getCheckoutBuyNowItems(orderId).subscribe({
          next: (items) => {
            this.checkoutItems = items;
            console.log('Checkout items:', items);
            // Tính tổng tiền
            this.totalPrice = items.reduce(
              (sum, item) => sum + item.price * (item.numberOfProducts || 0),
              0
            );
            this.grandTotal = this.totalPrice + this.shippingCost;
            // Điền thông tin mặc định vào form nếu có dữ liệu
            if (items.length > 0) {
              const firstItem = items[0];
              this.checkoutForm.patchValue({
                fullname: firstItem.fullname,
                phoneNumber: firstItem.phoneNumber,
                address: firstItem.address,
              });
            }
          },
          error: (error) => {
            console.error('Lỗi khi lấy dữ liệu checkout buy now', error);
          },
        });
      } else {
        console.error('orderId không được cung cấp trong URL.');
      }
    });
  }
  // Hàm mở dialog
  openAddressDialog(): void {
    // Lấy số điện thoại đang có trong form checkout
    const currentPhoneNumber = this.checkoutForm.get('phoneNumber')?.value;
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '500px',
      data: { phoneNumber: currentPhoneNumber },
      autoFocus: true,
      // data: { ... } // Nếu muốn truyền thêm data vào dialog
    });

    // Sau khi dialog đóng, ta nhận được địa chỉ user đã chọn
    dialogRef.afterClosed().subscribe((selectedAddress) => {
      if (selectedAddress) {
        // Patch form với địa chỉ đã chọn
        this.checkoutForm.patchValue({
          fullname: selectedAddress.fullname,
          phoneNumber: selectedAddress.phoneNumber,
          address: selectedAddress.address,
        });
      }
    });
  }
  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán.');
      return;
    }

    const formValue = this.checkoutForm.value;

    // Tạo đối tượng orderRequest theo kiểu mở rộng (có thể dựa trên Checkout2)
    const orderRequest: Checkout = {
      id: this.orderId,
      name: 'Mua ngay', // hoặc chuỗi rỗng nếu không cần thiết
      productId: 0, // giá trị mặc định
      price: 0, // nếu không dùng thì 0
      numberOfProducts: 0,
      orderDate: new Date(),
      fullname: formValue.fullname,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address,
      paymentMethod: formValue.paymentMethod,
      totalMoney: this.grandTotal,
    };

    // Nếu chọn thanh toán online (Direct Bank Transfer), xử lý thanh toán qua PaymentService
    if (formValue.paymentMethod === 'Direct Bank Transfer') {
      sessionStorage.setItem('orderRequest', JSON.stringify(orderRequest));
      this.makePayment(orderRequest);
    } else if (formValue.paymentMethod === 'Paypal') {
      sessionStorage.setItem('orderRequest', JSON.stringify(orderRequest));
      this.makePaymentPayPal(orderRequest);
    } else {
      // Đặt hàng theo cách thông thường
      this.checkoutService.placeOrderBuyNow(orderRequest).subscribe({
        next: () => {
          this.router.navigate(['/account']);
        },
        error: (err) => {
          alert('Có lỗi xảy ra khi đặt hàng.');
          console.error(err);
        },
      });
    }
  }

  makePayment(orderRequest: any): void {
    const paymentData: PaymentRequest = {
      orderCode: orderRequest.id,
      // amount: Math.floor((orderRequest.totalMoney ?? 0) * 25000),
      amount: Math.floor(3000),
      description: `TT DH #${orderRequest.id}`,
      buyerName: orderRequest.fullname,
      buyerEmail: 'buyer-email@gmail.com', // Thay bằng email nếu có
      buyerPhone: orderRequest.phoneNumber,
      buyerAddress: orderRequest.address,
      items: this.checkoutItems.map((item) => ({
        name: item.name,
        quantity: item.numberOfProducts || 1,
        price: Math.floor((item.price ?? 0) * 25000),
      })),
      cancelUrl: 'https://localhost:4200/',
      returnUrl: `https://localhost:4200/checkoutbuynow/${this.orderId}?paymentStatus=success`,
      expiredAt: Math.floor(Date.now() / 1000) + 3600,
    };

    this.paymentService.createPaymentLink(paymentData).subscribe({
      next: (response: PaymentResponse) => {
        if (response.code === '00') {
          // Chuyển hướng tới trang thanh toán của payOS
          window.location.href = response.data.checkoutUrl;
        } else {
          console.error('Lỗi thanh toán:', response.desc);
        }
      },
      error: (error) => {
        console.error('Có lỗi khi tạo thanh toán:', error);
      },
    });
  }
  makePaymentPayPal(orderRequest: any) {
    const paymentData: PaymentRequest = {
      orderCode: orderRequest.id,
      amount: Math.floor(orderRequest.totalMoney || 1),
      description: `TT DH #${orderRequest.id}`,
      buyerName: orderRequest.fullname,
      // Nếu bạn có thông tin email trong form, thay thế giá trị mặc định bên dưới
      buyerEmail: 'buyer-email@gmail.com',
      buyerPhone: orderRequest.phoneNumber,
      buyerAddress: orderRequest.address,
      items: this.checkoutItems.map((item) => ({
        name: item.name,
        quantity: item.numberOfProducts || 1,
        price: Math.floor(item.price),
      })),
      cancelUrl: 'https://localhost:4200/',
      returnUrl: `https://localhost:4200/checkoutbuynow/${this.orderId}?paymentStatus=success`,
      expiredAt: Math.floor(Date.now() / 1000) + 3600, // link hết hạn sau 1 giờ
    };
    this.paymentService.createPaymentPayPalLink(paymentData).subscribe({
      next: (response: PaymentResponse) => {
        if (response.code === '00') {
          // Chuyển hướng đến trang thanh toán do payOS cung cấp
          window.location.href = response.data.checkoutUrl;
        } else {
          console.error('Lỗi thanh toán:', response.desc);
        }
      },
      error: (error) => {
        console.error('Có lỗi khi tạo thanh toán:', error);
      },
    });
  }
}
