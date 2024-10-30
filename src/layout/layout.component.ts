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
import { Title } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConferenceService } from '../services/conference-service/conference.service';
import { BookingService } from '../services/booking-service/booking.service';
import { Conference } from '../model/conference';
import { retry } from 'rxjs';
import Swal from 'sweetalert2';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth-service/auth.service';

declare var bootstrap: any;

interface ConferenceRoom {
  name: string;
  code: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
              CommonModule,
              RouterOutlet,
              RouterLink,
              FullCalendarModule,
              FormsModule,
              DialogModule,
              ButtonModule,
              InputTextModule,
              KeyFilterModule,
              DropdownModule, 
              CheckboxModule,
              CalendarModule,
              FloatLabelModule,
              SidebarModule,
              ButtonModule,
              RippleModule,
              AvatarModule,
              StyleClassModule,
              DividerModule,
              TagModule
            ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isBookingModalVisible: boolean = false;
  isEventModalVisible: boolean = false;
  isAdminEventModalVisible: boolean = false;
  currentTime: Date = new Date();
  selectedDate: string = '';
  formattedDate: string = '';
  // currentDate: Date | null = null;
  currentStep: number = 1;
  checked: boolean = false;
  currentTitle: string = "Organizer Information";
  currentID: number = 0;
  data: Booking = new Booking();
  bookingById: Booking = new Booking;
  tokenRole!: string | null;
  time: Date[] | undefined;
  private timer: any;
  private timer2: any;
  formattedTimeNow: string = ""
  bookingByDate: Booking[] = [];
  updateBookingData: Booking = new Booking();
  formattedDateNow: string = new Date().toISOString().slice(0, 10);

  //for side bar
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
      this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

  eventLegend: string = "";

  //Dropdown part
  ConferenceRoom: Conference[] = [];
  ConferenceData: Conference = new Conference;
  selectedRoom: ConferenceRoom | undefined;

  constructor(private conferenceServ: ConferenceService ,private bookingServ: BookingService, private router: Router, private AuthServ: AuthService) {}

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;

  ngOnInit(): void {
    this.startClock();
    this.onLoadConference();
    this.startEventOngoingChecker();
    //sample data diri i load ang naa didto sa ConferenceBooking table
  //   this.ConferenceRoom = [
  //     { name: 'New York', code: 'NY' },
  //     { name: 'Rome', code: 'RM' },
  //     { name: 'London', code: 'LDN' },
  //     { name: 'Istanbul', code: 'IST' },
  //     { name: 'Paris', code: 'PRS' }
  // ];
  }
  DisplayBookingByID(id: number) {
    console.log(`Searching for booking with ID: ${id}`);
    const booking = this.bookingData.find(b => b.bookingId === id);
  
    if (booking) {
      this.bookingById = booking;
      console.log("Booking found:", this.bookingById);
    } 
    else {
      console.error("No booking found with the provided ID.");
    }
  }


  // DisplayBookingByID(id: number){
  //   this.bookingById = this.bookingData.find(b => b.bookingId === id)!;
  //   console.log("reached here");

    // this.bookingServ.onGetBookingByBookingId(id).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     if (res.isSuccess) {
    //       this.bookingById = res.data
    //       console.table(this.bookingById)
          
    //     } else {
    //       alert("Get failed!");
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error inserting:', err); // Log any errors
    //   },
    //   complete: () => {
    //     // this.onLoadConference();
    //   }
    // });
  // }

  BookConference(data: Booking) {
    debugger;

    data.bookingId = null;
    data.conferenceId = this.currentID;
    data.bookedDate = this.selectedDate;
  
    // Convert the time to the correct format (HH:mm:ss) before sending to the backend
    const bookingStart = this.convertTimeToSQLFormat(this.data.bookingStart);
    const bookingEnd = this.convertTimeToSQLFormat(this.data.bookingEnd);

    alert(data.bookingStart + " " + data.bookingEnd);

    if(data.bookingStart >= '00:00:00' && data.bookingStart < '08:00:00') {
      this.isBookingModalVisible = false;
      Swal.fire({
        title: "Error!",
        text: "Start: Please select booking time from 8:00AM to 5:00PM",
        icon: "error",
      }).then(() => {
        this.isBookingModalVisible = true;
      });
      return;
    } 
    else if (data.bookingEnd > '17:00:00' && data.bookingEnd <= '24:00:00'){
      this.isBookingModalVisible = false;
      Swal.fire({
        title: "Error!",
        text: "Please select booking time from 8:00AM to 5:00PM",
        icon: "error",
      }).then(() => {
        this.isBookingModalVisible = true;
      });
       return;
    }
  
    if(data.bookingStart > data.bookingEnd) {
      this.isBookingModalVisible = false;
      Swal.fire({
        title: "Error!",
        text: "Booking end time can't be earlier than booking start time!",
        icon: "error",
      }).then(() => {
        this.isBookingModalVisible = true;
      });
      return;
    }

    if (bookingStart && bookingEnd) {
      data.bookingStart = bookingStart;
      data.bookingEnd = bookingEnd;
    }
    if (Number(this.ConferenceData.capacity) < Number(data.expectedAttendees)){
      this.isBookingModalVisible = false;

      Swal.fire({
        title: "Error!",
        text: `The expected number of attendees has exceeded the conference capacity of ${this.ConferenceData.capacity} `,
        icon: "error",
      }).then(() => {
        this.isBookingModalVisible = true;  // Re-enable/show your custom modal
      });
      return;
    }


    console.table(data);
    this.bookingServ.onAddOrUpdateBooking(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res.isSuccess) {
          alert("Booked Success");
          this.isBookingModalVisible = false
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
  

  startClock(){
    // Update the time every second
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }


  onUpdateStatus(data: Booking){
    this.bookingServ.onUpdateBookingStatus(data).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.onLoadCalendarEvents(Number(this.ConferenceData.conferenceId));
          console.info("bruh" + res.data);
        }
        else{
          console.error(res.errorMessage);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  startEventOngoingChecker(){
    this.timer2 = setInterval(() => {
      this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
      this.checkEventStarting(this.formattedTimeNow);
    }, 10000);
  }

  checkEventStarting(timeNow: string) {
    // console.info(`${this.formattedTimeNow}`);
    // console.log(this.bookingByDate.map(x => x.bookingStart <= timeNow));

    for (let booking of this.bookingByDate) {
        // Check if timeNow is less than bookingStart
        if (timeNow < booking.bookingStart) {
            continue; // Skip to the next booking
        }

        if (booking.status == "done"){
          continue;
        }
        // Check if timeNow is greater than or equal to bookingEnd
        if (timeNow >= booking.bookingEnd && booking.status == "ongoing") {
            this.updateBookingData.bookingId = booking.bookingId;      
            this.updateBookingData.status = "done";
            this.onUpdateStatus(this.updateBookingData);
            console.log("status DONE");
            continue; // Skip to the next booking
        }

        if (booking.status == "ongoing"){
          continue;
        }
        // Check if timeNow is greater than or equal to bookingStart
        if (timeNow >= booking.bookingStart) {
            // booking.status = "ongoing";
            this.updateEvent();
            // this.updateBookingData.bookingId = booking.bookingId;
            // this.onUpdateStatus(this.updateBookingData);
            console.log("status ONGOING");
        }
    }

    console.log("Finished processing all bookings");
}

  
  getBookingByDate(){
    for (let booking of this.bookingData){
    console.info(`formatted:${this.formattedDateNow}  bookedDate:${booking.bookedDate}`);
      if (booking.bookedDate == this.formattedDateNow){
        this.bookingByDate.push(booking);
        console.log("shit appended");
      }
    }
    this.bookingByDate.sort((a,b) => {
      return a.bookingStart.localeCompare(b.bookingStart);
    })
  }


  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resetModal() {
    this.currentStep = 1;
    this.data = new Booking();
    this.checked = false; 
  }

  showDialog() {
    this.isBookingModalVisible = true;
    this.currentStep = 1;
  }

  showRoleEventDialog(){
    this.tokenRole = this.AuthServ.getUserRole();
      if (this.tokenRole == 'AdminRole'){
        this.isAdminEventModalVisible = true;
      }
      else {
        this.isEventModalVisible = true;
      }
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
        case 'done':
          dotColor = 'gray';
          break;
        case 'ongoing':
          dotColor = 'red';
          break;
        default:
          dotColor = 'black'; // Fallback color
      }

      if (!startTime || !endTime) {
        return { html: `<div><strong>Time not available</strong></div>` }; // Fallback in case times are not available
      }

      // const timeDisplay = `<b style="color: ${dotColor}">●</b> ${startTime.getHours() % 12 || 12}${startTime.getHours() < 12 ? 'AM' : 'PM'}-${endTime.getHours() % 12 || 12}${endTime.getHours() < 12 ? 'AM' : 'PM'}`;
      const timeDisplay = `<span class="pi pi-circle-fill" style="font-size: 0.55rem; color: ${dotColor}">  </span> ${startTime.getHours() % 12 || 12}${startTime.getHours() < 12 ? 'AM' : 'PM'}-${endTime.getHours() % 12 || 12}${endTime.getHours() < 12 ? 'AM' : 'PM'}`;
      const title = arg.event.title || 'No Title';

      return {
        html: `<div>${timeDisplay} <b>${title}</b></div>`,
      };
    },
    eventDidMount: (info) => {
      info.el.style.backgroundColor = 'lightblue';
      info.el.style.borderRadius = '6px';
      info.el.style.color = '#505050';
      info.el.style.padding = "4px 6px";
      
      info.el.style.overflow = "hidden";
      info.el.style.whiteSpace = "nowrap"; // Prevent text from wrapping
      info.el.style.textOverflow = "ellipsis"; // Show "..." when text overflows

      // Set the event width to auto but constrained by its parent cell



      info.el.addEventListener('mouseenter', () => {
        info.el.style.backgroundColor = 'lightslategray'; // Change to a darker color
        info.el.style.color = '#ffffff';
      });
      info.el.addEventListener('mouseleave', () => {
        info.el.style.backgroundColor = 'lightblue'; // Revert to original color
        info.el.style.color = '#505050';
    });
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
    this.DisplayBookingByID(Number(info.event.id));
    const eventDetails = `
      ID: ${info.event.id}
      Meeting Title: ${info.event.title}
      Start: ${info.event.start}
      End: ${info.event.end || 'Not set'}
      Description: ${info.event.extendedProps.description || 'No description'}
      Location: ${info.event.extendedProps.location || 'No location'}
      Speaker: ${info.event.extendedProps.speaker || 'No speaker'}
    `;
    this.showRoleEventDialog();
    // alert(eventDetails);  // Display the event details in an alert

  }



  handleDateClick(arg: any) {
    // Allow clicking on other days but not Sundays
    if (arg.date.getDay() !== 0) {
      this.isBookingModalVisible = true;
  
      // Set the selected date from the clicked date (arg.dateStr is in YYYY-MM-DD format)
      this.selectedDate = arg.dateStr;
  
      this.formattedDate = this.convertDateToLongFormat(this.selectedDate);

      
    }
  }

  getFormattedSelectedDate(): string {
    return this.convertDateToLongFormat(this.selectedDate);
  }

  convertDateToLongFormat(dateString: string): string {
    const date = new Date(dateString); // Create a Date object from the string
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date); // Return formatted date
  }

  toggleAccordion(collapseId: string): void {
    const element = document.getElementById(collapseId);
    if (element) {
      const bootstrapCollapse = new bootstrap.Collapse(element, { toggle: false }); // Initialize without toggling
      if (this.checked) {
        bootstrapCollapse.show(); // Open the accordion section when checked
      } else {
        bootstrapCollapse.hide(); // Close the accordion section when unchecked
      }
    }
  }

  getTagStyle(status: string | null): { [key: string]: string } {
    if (!status) {
      status = 'default';  // Set to a default string to avoid type issues
    }
    
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: 'green', backgroundColor: 'rgba(0, 128, 0, 0.1)' };
      case 'pending':
        return { color: 'white', backgroundColor: 'rgb(250, 162, 0)', padding: '2px' };
      case 'ongoing':
        return { color: 'white', backgroundColor: 'rgb(0, 91, 196)', padding: '2px' };
      default:
        return { color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)' };
    }
  }
  
  updateEventStatus() {
  this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });

  this.bookingData.forEach((booking: Booking) => {
    // Update status based on current time and existing conditions
    if (this.formattedTimeNow >= booking.bookingStart && booking.status !== "done") {
      booking.status = "ongoing";
    }

    // Update the status in the calendar if the event exists
  });
}


  updateEvent(){
   this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
      const events = this.bookingData.map((booking: Booking) => {
        // alert("TEST" + booking.bookingId);

        if (this.formattedTimeNow >= booking.bookingStart && booking.status === "approved"){
          booking.status = "ongoing";
        }
        const event: {} = {
          id: booking.bookingId,
          title: booking.purpose || 'No Title',
          // CONCAT BOOKED DATE WITH THE TIME
          start: `${booking.bookedDate}T${booking.bookingStart}`,
          end: `${booking.bookedDate}T${booking.bookingEnd}`,
          extendedProps: {
          status: booking.status
        }
      };            
      return event;
    });
    this.calendarOptions.events = events;
  }
  
  // Api calls for data events
  bookingData: Booking[] = [];

  onLoadCalendarEvents(conferenceID: number) {
    this.bookingServ.onGetBookingByConferenceId(conferenceID).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.bookingData = res.data;
          console.table(this.bookingData);          
          this.updateEvent();
          this.getBookingByDate();
        }else {
          console.log(res.errorMessage);
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
      this.onLoadCalendarEvents(Number(this.ConferenceData.conferenceId));
      console.log("Conference data changed!: " + this.ConferenceData.conferenceId?.toString());
      this.currentID = parseInt(this.ConferenceData.conferenceId?.toString() || '0', 10);
      console.log(this.currentID);
      // alert(this.currentID);
    }
  }

  

}