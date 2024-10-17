import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { Booking } from '../model/booking';
import { BookingService } from '../services/booknig-service/booking.service';
import { Title } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConferenceService } from '../services/conference-service/conference.service';
import { Conference } from '../model/conference';

interface ConferenceRoom {
  name: string;
  code: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FullCalendarModule, FormsModule, 
            DialogModule, ButtonModule, InputTextModule,  KeyFilterModule, DropdownModule, 
            CheckboxModule, CalendarModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isBookingModalVisible: boolean = false;
  isEventModalVisible: boolean = false;
  currentTime: Date = new Date();
  selectedDate: string = '';
  // currentDate: Date | null = null;
  currentStep: number = 1;
  checked: boolean = false;
  currentTitle: string = "Organizer Information";
  currentID: number = 0;
  data: Booking = new Booking();
  bookingById: Booking = new Booking();
  time: Date[] | undefined;
  private timer: any;

  eventLegend: string = "";

  //Dropdown part
  ConferenceRoom: Conference[] = [];
  ConferenceData: Conference = new Conference;
  selectedRoom: ConferenceRoom | undefined;

  constructor(private conferenceServ: ConferenceService ,private bookingServ: BookingService, private router: Router) {}

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;

  ngOnInit(): void {
    this.startClock();
    this.onLoadConference();
    //sample data diri i load ang naa didto sa ConferenceBooking table
  //   this.ConferenceRoom = [
  //     { name: 'New York', code: 'NY' },
  //     { name: 'Rome', code: 'RM' },
  //     { name: 'London', code: 'LDN' },
  //     { name: 'Istanbul', code: 'IST' },
  //     { name: 'Paris', code: 'PRS' }
  // ];
  }

  DisplayBookingByID(id: number){
    this.bookingServ.onGetBookingByBookingId(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.isSuccess) {
          alert("Get success!");
          this.bookingById = res.data
          console.table(this.bookingById)

        } else {
          alert("Get failed!");
        }
      },
      error: (err) => {
        console.error('Error inserting:', err); // Log any errors
      },
      complete: () => {
        // this.onLoadConference();
      }
    });
  }

  BookConference(data: Booking) {
    
    data.bookingId = null;
    data.conferenceId = this.currentID;
    data.bookedDate = this.selectedDate;
  
    // Convert the time to the correct format (HH:mm:ss) before sending to the backend
    const bookingStart = this.convertTimeToSQLFormat(this.data.bookingStart);
    const bookingEnd = this.convertTimeToSQLFormat(this.data.bookingEnd);
  
    if (bookingStart && bookingEnd) {
      data.bookingStart = bookingStart;
      data.bookingEnd = bookingEnd;
    }

    console.table(data);
    this.bookingServ.onAddOrUpdateBooking(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res.isSuccess) {
          alert("Booked Success");
        } else {
          alert("Insert Failed!");
        }
      },
      error: (err) => {
        console.error('Error inserting:', err); // Log any errors
      },
      complete: () => {
        this.onLoadConference();
      }
    });
  }

  // Helper function to format Date to 'YYYY-MM-DD'
  formatDateToSQLFormat(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, hence adding 1
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

  
  // Helper function to convert time (HH:mm) to SQL format (HH:mm:ss)
  convertTimeToSQLFormat(time: string): string {
    // Check if time is already in the correct format
    if (time && time.length === 5) {
      return `${time}:00`; // Append seconds to the HH:mm format
    }
    return '';
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

  resetModal() {
    this.currentStep = 1;           // Reset the step to 1
    this.currentTitle = "Organizer Information";  // Reset title to initial step // Optionally reset conference data
    this.selectedDate = ''; // Clear selected date
    
  }

  showDialog() {
    this.isBookingModalVisible = true;
    this.currentStep = 1;
  }

  showEventDialog() {
    this.isEventModalVisible = true;
}

  nextStep() {
    this.currentStep++;
    this.currentTitle = "Meeting Details";
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.currentTitle = "Organizer Information";
    }
  }

  getCurrentStepTemplate(): TemplateRef<any> {
    switch (this.currentStep) {
      case 1:
        return this.step1Template;
      case 2:
        return this.step2Template;
      default:
        return this.step1Template;
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2023-04-01' },
      { title: 'event 2', date: '2023-04-02' }
    ],
    eventTimeFormat: {
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    },
    // TIME FORMAT CHANGES
    eventContent: (arg) => {
      const startTime = arg.event.start;
      const endTime = arg.event.end;
      const status = arg.event.extendedProps['status']; // Get the status

      let dotColor = 'black'; // Default color

      // Change dot color based on the status
      switch (status) {
        case 'approved':
          dotColor = 'green';
          break;
        case 'pending':
          dotColor = 'orange';
          break;
        case 'canceled':
          dotColor = 'red';
          break;
        default:
          dotColor = 'black'; // Fallback color
      }

      if (!startTime || !endTime) {
        return { html: 'Time not available' }; // Fallback in case times are not available
      }

      const timeDisplay = `<b style="color: ${dotColor}">●</b> ${startTime.getHours() % 12 || 12}${startTime.getHours() < 12 ? 'AM' : 'PM'}-${endTime.getHours() % 12 || 12}${endTime.getHours() < 12 ? 'AM' : 'PM'}`;
      const title = arg.event.title || 'No Title';

      return {
        html: `<div>${timeDisplay} <b>${title}</b></div>`,
      };
    },
    eventDidMount: (info) => {
      info.el.style.backgroundColor = 'lightblue';
      info.el.style.borderRadius = '4px';
      info.el.style.padding = '5px';
      info.el.style.color = '#505050';
    },
    aspectRatio: 1.35, // Lower value to make the calendar taller and fill more screen space
    dayCellDidMount: (info) => {
      if (info.date.getDay() === 0) {
        
        info.el.style.pointerEvents = 'none';
        info.el.style.backgroundColor = 'rgb(169, 169, 169)';
        info.el.style.color = 'rgb(255, 255, 255)';
      }
    },
    eventClick: this.handleEventClick.bind(this)
  };

  handleEventClick(info: any) {
    this.DisplayBookingByID(info.event.id);
    const eventDetails = `
      ID: ${info.event.id}
      Meeting Title: ${info.event.title}
      Start: ${info.event.start}
      End: ${info.event.end || 'Not set'}
      Description: ${info.event.extendedProps.description || 'No description'}
      Location: ${info.event.extendedProps.location || 'No location'}
      Speaker: ${info.event.extendedProps.speaker || 'No speaker'}
    `;
    this.showEventDialog();
    // alert(eventDetails);  // Display the event details in an alert
  }

  handleDateClick(arg: any) {
    // Allow clicking on other days but not Sundays
    if (arg.date.getDay() !== 0) {
      this.isBookingModalVisible = true;
      this.selectedDate = arg.dateStr;
      // alert('date click! ' + arg.dateStr);
    }

    
  }



  // Api calls for data events
  bookingData: Booking[] = [];

  onLoadCalendarEvents(conferenceID: number) {
    this.bookingServ.onGetBookingByConferenceId(conferenceID).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.bookingData = res.data
          console.table(this.bookingData);
          const events = this.bookingData.map((booking: Booking) => {
            // alert("TEST" + booking.bookingId);
            const event: {} = {
                id: booking.bookingId,
                title: booking.purpose || 'No Title',
                // CONCAT BOOKED DATE WITH THE TIME
                start: `${booking.bookedDate}T${booking.bookingStart}`,
                end: `${booking.bookedDate}T${booking.bookingEnd}`,
                extendedProps: {
                  status: booking.status // Include status here
                }
            };            
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

  onLoadConference() {
    this.conferenceServ.onGetAllConference().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.ConferenceRoom = res.data; // Load all conference data
          console.log("Conference Rooms: ", this.ConferenceRoom);
          
          // Set default to the first conference in the list
          if (this.ConferenceRoom.length > 0) {
            this.ConferenceData = this.ConferenceRoom[0]; 
            
            // Call onConferenceChange here to load calendar events and alert the ID
            this.onConferenceChange();
          }
        } else {
          console.error("Error: " + res.errorMessage);
        }
      },
      error: (err) => {
        console.error("Error: " + err);
      }
    });
  }
  

  getConferenceName(): string[] {
    const conferenceName = new Set<string>();

    for(const items of this.ConferenceRoom){
      if(items.conferenceName){
        conferenceName.add(items.conferenceName);
      }
    }
    return Array.from(conferenceName);
  }
  onConferenceChange() {
    if (this.ConferenceData) {
      this.onLoadCalendarEvents(this.ConferenceData.conferenceId as number);
      console.log("Conference data changed!: " + this.ConferenceData.conferenceId?.toString());
      this.currentID = parseInt(this.ConferenceData.conferenceId?.toString() || '0', 10);
      console.log(this.currentID);
      // alert(this.currentID);
    }
  }

  

}
