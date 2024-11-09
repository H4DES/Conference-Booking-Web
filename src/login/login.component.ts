import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Login } from '../model/login';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
            FloatLabelModule,
            CommonModule,
            FormsModule,
            DialogModule,
            InputTextModule,
            PasswordModule,
            ButtonModule
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 loginData: Login = new Login;
 constructor(private authServ: AuthService, private router: Router, private toastr: ToastrService){};

  onLogin(){
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    this.authServ.onLogin(this.loginData).subscribe({
      next: (res) => {
        if (res.isSuccess){
          localStorage.setItem('authToken', res.data.token);
          this.toastr.success('Successfully login!', 'Success');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored URL
            this.router.navigateByUrl(redirectUrl); // Redirect to the original destination
          } else {
            this.router.navigateByUrl('/layout'); // Or redirect to a default home page
          }
        }
        else {
          this.toastr.error(res.errorMessage, 'Error');
        }

      },
      error: (err) => {
        console.error("ERROR: " + err);
      },
      complete: () => {
        
      }
    })
  }

}
