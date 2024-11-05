import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { Admin } from '../model/adminUsers';
import { AuthService } from '../services/auth-service/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, CommonModule, TagModule, ButtonModule, InputTextModule, FormsModule, DialogModule, FloatLabelModule, RadioButtonModule, MultiSelectModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  Conferences!: Conference[];
  conferenceData: Conference = new Conference;
  isConferenceModalVisible: boolean = false;
  updateModal: boolean = false;
  deleteModal: boolean = false;
  admins: Admin[] = [];
  selectedAdmins: Admin[] = [];

  constructor(private conferenceServ: ConferenceService, private router: Router, private authServ: AuthService) {}


  ngOnInit() {
    this.onLoadConference();
    this.onGetAllAdmins();
  }

  get dialogTitle(): string {
    if (this.updateModal) return "Update Conference"
    else if (this.deleteModal) return "Delete Conference"
    else return "Add Conference"

  }

  onGetAllAdmins(){
    console.log("started...");
    this.authServ.onGetAdmins().subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.admins = res.data;
          console.table(this.admins);
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
      // console.table(this.conferenceData.adminUserDtos)
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
          console.info("bruh has started");
          console.table(this.Conferences.forEach(x => x.adminUserDtos));         
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
