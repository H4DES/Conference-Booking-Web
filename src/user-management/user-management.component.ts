import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Conference } from '../model/conference';
import { ConferenceService } from '../services/conference-service/conference.service';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { User } from '../model/user';
import { AuthService } from '../services/auth-service/auth.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Register } from '../model/register';
import { DropdownModule } from 'primeng/dropdown';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [TableModule, 
            CommonModule, 
            TagModule, 
            ButtonModule, 
            InputTextModule, 
            FormsModule, 
            DialogModule, 
            FloatLabelModule, 
            RadioButtonModule, 
            MultiSelectModule,
            CheckboxModule,            
            IconFieldModule,
            InputIconModule,
            DropdownModule
            ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  @Output() userCountChange = new EventEmitter<number>();

  Conferences!: Conference[];
  conferenceData: Conference = new Conference;
  isUserModalVisible: boolean = false;
  registerModal: boolean = false;
  deleteModal: boolean = false;
  users: User[] = [];
  userById: User = new User;
  selectedAdmins: User[] = [];
  userData: Register = new Register;
  selectedRole!: string;

  userRoleOptions: { name: string, type: string }[] = [
    { name: 'Admin', type: 'admin' },
    { name: 'User', type: 'user' }
  ];

  constructor(private conferenceServ: ConferenceService, private router: Router, private authServ: AuthService, private toastr: ToastrService) {}


  ngOnInit() {
    this.onLoadConference();
    this.onGetUsers();
  }

  get dialogTitle(): string {
    if (this.deleteModal) return "Delete User"
    else return "Register User"

  }

  onRegisterUser(){
    if (this.selectedRole === 'user'){
      this.authServ.onRegisterUser(this.userData).subscribe({
        next: (res) => {
          if (res.isSuccess){
            this.toastr.success(`${res.data}`, 'Success');
          }
          else{
            this.toastr.error(`${res.data}`, 'Error');
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.isUserModalVisible = false
          this.registerModal = false;
          this.onGetUsers();
        }
      });
    }
    if (this.selectedRole === 'admin'){
      this.authServ.onRegisterAdmin(this.userData).subscribe({
        next: (res) => {
          if (res.isSuccess){
            this.toastr.success(`${res.data}`, 'Success');
          }
          else{
            this.toastr.error(`${res.data}`, 'Error');
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.isUserModalVisible = false
          this.registerModal = false;
          this.onGetUsers();
        }
      });
    }
    
  }
  onGetUsersById(id: string){
    this.userById = this.users.find(x => x.userId === id)!;
  }
  onGetUsers(){
    console.log("started...");
    this.authServ.onGetUsers().subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.users = res.data;
          this.userCountChange.emit(this.users.length);          
          console.table('onGetUsers'+this.users);
        }
        else{
          console.error(res.errorMessage)
        }
      },
      error: (err) => {
        console.error(err)
      } 
    })
  }
  onUserDelete(userId: string){
    this.authServ.onRemoveUser(userId).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.toastr.success(res.data, 'Success');
        }
        else {
          this.toastr.error(res.errorMessage, 'Error');
        }
      },
      error: (err) => {
        console.error(`Error: ${err}`);
      },
      complete: () => {
        this.isUserModalVisible = false
        this.deleteModal = false;
        this.onGetUsers();
      }
    });
  }


  showUserModal(user: User | null = null){
      if (user != null){
        this.registerModal = false;
        this.deleteModal = true;
        this.userById = { ...user };
      }
      else {
        this.deleteModal = false;
        this.registerModal = true;
      }
      this.isUserModalVisible = true;
  }

  getActiveStatus(active: boolean){
    switch (active) {
      case true:
        return 'success';
      case false:
        return 'contrast';
    }
  }

  
  onGetConferenceName(conferenceId: number) : string{
    return this.Conferences.find(x => x.conferenceId === conferenceId)?.conferenceName!;
  }

  onLoadConference() {
    this.conferenceServ.onGetAllConference().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.Conferences = res.data; // Load all conference data
          console.info("bruh has started");
          console.table(this.Conferences.forEach(x => x.userDtos));         
          // Set default to the first conference in the list
          
        } else {
          console.error("Error: " + res.errorMessage);
        }
      },
      error: (err) => {
        console.error("Error: " + err);
      }
    });
  }
}
