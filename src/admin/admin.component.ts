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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, CommonModule, TagModule, ButtonModule, InputTextModule, FormsModule, DialogModule, FloatLabelModule, RadioButtonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  Conferences!: Conference[];
  conferenceData: Conference = new Conference;
  isConferenceModalVisible: boolean = false;
  updateModal: boolean = false;
  deleteModal: boolean = false;

  constructor(private conferenceServ: ConferenceService, private router: Router) {}


  ngOnInit() {
    this.onLoadConference();
  }

  get dialogTitle(): string {
    if (this.updateModal) return "Update Conference"
    else if (this.deleteModal) return "Delete Conference"
    else return "Add Conference"

  }



  showConferenceModal(conference: Conference | null = null, conferenceDelete: boolean | null = null){
    if (conference?.conferenceId == null) {
      this.deleteModal = false;
      this.updateModal = false;
      this.conferenceData = new Conference;
    }
    else if (conferenceDelete){
      this.updateModal = false;
      this.deleteModal = true;
      this.conferenceData = { ...conference };
    }
    else {
      this.deleteModal = false;
      this.updateModal = true;
      this.conferenceData = { ...conference };
    }
      this.isConferenceModalVisible = true;
  }

  getActiveStatus(active: boolean){
    switch (active) {
      case true:
        return 'success';
      case false:
        return 'danger';
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
    debugger;
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
          console.log("Conference Rooms: ", this.Conferences);         
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
