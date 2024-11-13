import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sweet-alert',
  standalone: true,
  template: '', // No need to render any HTML as SweetAlert uses JavaScript to display the alert
})
export class SweetAlertComponent {
    
 @Input() title: string = '';  
 @Input() message: string = '';
 @Input() status: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info';

 @Output() alertClosed = new EventEmitter<void>();

  // Add the showAlert() method to trigger the SweetAlert popup
  showAlert(): void {
    Swal.fire({
      title: this.title || 'Notification',
      text: this.message,
      icon: this.status,
      confirmButtonText: 'OK',
    }).then(() => {
      this.alertClosed.emit(); // Emit an event when the alert is closed
    });
  }
}
