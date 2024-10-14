import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Booking } from '../model/booking';
import { BookingService } from '../services/booknig-service/booking.service';
import { Title } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';

interface ConferenceRoom {
  name: string;
  code: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FullCalendarModule, FormsModule, DialogModule, ButtonModule, InputTextModule,  KeyFilterModule, DropdownModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  visible: boolean = false;
  currentTime: Date = new Date();
  selectedDate: string = '';
  private timer: any;

  //Dropdown part
  ConferenceRoom: ConferenceRoom[] | undefined;
  selectedRoom: ConferenceRoom | undefined;

  constructor(private bookingServ: BookingService, private router: Router) {}


  ngOnInit(): void {
    this.startClock();
    this.onLoadCalendarEvents();

    //sample data diri i load ang naa didto sa ConferenceBooking table
    this.ConferenceRoom = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];
  }

  startClock() {
    // Update the time every second
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  showDialog() {
    this.visible = true;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2023-04-01' },
      { title: 'event 2', date: '2023-04-02' }
    ],
    aspectRatio: 1.35, // Lower value to make the calendar taller and fill more screen space
    dayCellDidMount: (info) => {
      if (info.date.getDay() === 0) {
        
        info.el.style.pointerEvents = 'none';
        info.el.style.backgroundColor = 'rgb(169, 169, 169)';
        info.el.style.color = 'rgb(255, 255, 255)';
      }
    },
  };

  handleDateClick(arg: any) {
    // Allow clicking on other days but not Sundays
    if (arg.date.getDay() !== 0) {
      this.visible = true;
      this.selectedDate = arg.dateStr;
      // alert('date click! ' + arg.dateStr);
    }
  }



  // Api calls for data events
  data: Booking[] = [];
  conferenceID: number = 1;

  onLoadCalendarEvents() {
    this.bookingServ.onGetBookingByConferenceId(this.conferenceID).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.data = res.data
          const events = this.data.map((booking: Booking) => {
            const event: { title: string; start?: string; end?: string } = {
                title: booking.purpose || 'No Title' // Use purpose as title or a default
            };

            // Only assign start and end if they are valid
            if (booking.bookingStart) {
                event.start = new Date(booking.bookingStart).toISOString(); // Convert to ISO string
            }
            if (booking.bookingEnd) {
                event.end = new Date(booking.bookingEnd).toISOString(); // Convert to ISO string
            }

            return event; // Return the constructed event
        });

          this.calendarOptions.events = events;
        }else {
          console.log("No booking events found");
        }
      },
      error: (err) => {
        console.error("Error loading bookings", err)
      }
    })
  }



}
