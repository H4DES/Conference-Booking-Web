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

@Component({
  selector: 'app-conference-management',
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
            InputIconModule
            ],
  templateUrl: './conference-management.component.html',
  styleUrl: './conference-management.component.css'
})
export class ConferenceManagementComponent {

  @Output() conferenceCountChange = new EventEmitter<number>();

  Conferences!: Conference[];
  conferenceData: Conference = new Conference;
  isConferenceModalVisible: boolean = false;
  updateModal: boolean = false;
  deleteModal: boolean = false;
  admins: User[] = [];
  selectedAdmins: User[] = [];

  constructor(private conferenceServ: ConferenceService, private router: Router, private authServ: AuthService) {}


  ngOnInit() {
    this.onLoadConference();
    this.onGetUsers();
  }

  get dialogTitle(): string {
    if (this.updateModal) return "Update Conference"
    else if (this.deleteModal) return "Delete Conference"
    else return "Add Conference"

  }

  onGetUsers(){
    console.log("started...");
    this.authServ.onGetUsers("user").subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.admins = res.data;
          console.table('onGetUsers'+this.admins);
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


  showConferenceModal(conference: Conference | null = null, conferenceDelete: boolean | null = null){
    //for inserting new conference
    if (conference?.conferenceId == null) {
      this.deleteModal = false;
      this.updateModal = false;
      this.conferenceData = new Conference;
    }
    //for the delete modal
    else if (conferenceDelete){
      this.updateModal = false;
      this.deleteModal = true;
      this.conferenceData = { ...conference };
    }
    //for the update modal
    else {
      this.selectedAdmins = [];
      this.deleteModal = false;
      this.updateModal = true;
      this.conferenceData = { ...conference };
      console.table(this.conferenceData.userDtos)
    }
      this.isConferenceModalVisible = true;
  }

  getActiveStatus(active: boolean){
    switch (active) {
      case true:
        return 'success';
      case false:
        return 'contrast';
    }
  }

  onConferenceDelete(id: number){
    this.conferenceServ.onConferenceDelete(id).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.isConferenceModalVisible = false;
          Swal.fire({
            title: "Deleted",
            text: String(res.data),
            icon: "warning"
          });
          this.onLoadConference();
        }
        else{
          Swal.fire({
            title: "ERROR",
            text: String(res.errorMessage),
            icon: "error"
          });
        }
      }
    })
  }

  onAddorUpdateConference(data: Conference) {
    if (!this.updateModal){
      data.conferenceId = null;
      data.isActive = true;
    }

    this.conferenceServ.onAddOrUpdateConference(data).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.isConferenceModalVisible = false;
          Swal.fire({
            title: "Saved",
            text: String(res.data),
            icon: "success"
          });
          this.onLoadConference();
        }
        else {
          Swal.fire({
            title: "ERROR",
            text: String(res.errorMessage),
            icon: "error"
          });
        }
      }
    })
  }

  onLoadConference() {
    this.conferenceServ.onGetAllConference().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.Conferences = res.data; // Load all conference data
          this.conferenceCountChange.emit(this.Conferences.length);
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
