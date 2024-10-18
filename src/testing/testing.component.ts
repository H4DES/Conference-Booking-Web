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

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [TableModule, CommonModule, TagModule, ButtonModule, InputTextModule, FormsModule, DialogModule, FloatLabelModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent implements OnInit {

  Conferences!: Conference[];
  conferenceData: Conference = new Conference;
  isConferenceModalVisible: boolean = false;

  constructor(private conferenceServ: ConferenceService, private router: Router) {}


  ngOnInit() {
    this.onLoadConference();
  }

  showConferenceModal(){
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

  onAddConference(data: Conference) {
    debugger;
    data.isActive = true;
    data.conferenceId = null;
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
