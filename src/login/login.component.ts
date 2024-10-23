import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Login } from '../model/login';
import { LoginService } from '../services/auth-service/login.service';
import { Router } from '@angular/router';

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
 constructor(private loginServ: LoginService, private router: Router){};

  onLogin(){
    this.loginServ.onLogin(this.loginData).subscribe({
      next: (res) => {
        if (res.isSuccess){
          localStorage.setItem('authToken', res.data.token);
          alert("login successful");
        }
        else {
          alert(res.errorMessage);
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
