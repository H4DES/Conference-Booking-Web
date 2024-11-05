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
import { Register } from '../model/register';
import { AuthService } from '../services/auth-service/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 
 registerData: Register = new Register;

 constructor(private authServ: AuthService, private router: Router){}

 onRegisterUser(){
  this.authServ.onRegisterUser(this.registerData).subscribe({
    next: (res) => {
      if (res.isSuccess){
        alert(res.data);
      }
      else{
        alert(res.data);
      }
    },
    error: (err) => {
      console.error(err);
    },
    complete: () => {

    }
  })
 }
}
