import { Component, OnInit, ElementRef } from '@angular/core';
import Event from "../../models/events";
import { EventsService } from 'src/app/events.service';
import * as moment from 'moment';
import { UserService } from 'src/app/user.service';
import User from "../../models/users";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  addEvent!: HTMLElement;
  confirmRegistration!: HTMLElement;
  events: Event[] = [];
  moment: any = moment;
  user!: User;
  futureEvents: Event[] = [];

  constructor(private eventService: EventsService,
    private el: ElementRef,
    private userService: UserService) { }

  ngOnInit() {
    this.addEvent = this.el.nativeElement.querySelector("#addEvent");
    this.confirmRegistration = this.el.nativeElement.querySelector("#confirmRegistration");

    const userId = localStorage.getItem("userId");
    if (userId) {
      this.userService.getUser(userId)
        .subscribe(user => {
          this.user = user;
          console.log("events user: ", this.user);
        });
    }

    this.eventService.geEvents()
      .subscribe(events => {
        this.events = events;
        this.events.sort((a, b) => new Date(a.eventDateTime).valueOf() - new Date(b.eventDateTime).valueOf());
        this.futureEvents = this.events.filter(event => moment(event.eventDateTime) > moment());
        console.log("future events: ", this.futureEvents)
      });
  }

  deleteEvent(id: string) {

    if (confirm("Confirm delete?")) {
      console.log("deleting event");
      this.eventService.deleteEvent(id)
        .subscribe((events) => {
          console.log("events after subscribe ", events);
          this.events = events;
          this.events.sort((a, b) => new Date(a.eventDateTime).valueOf() - new Date(b.eventDateTime).valueOf());
          this.futureEvents = this.events.filter(event => moment(event.eventDateTime) > moment());
          console.log("futureevents: ", this.futureEvents);
        });
    }
  }

  showAddEvent() {
    this.addEvent.classList.add("w3-show");
    this.addEvent.classList.remove("w3-hide");
    //set focus to description field when add event modal is shown
    this.el.nativeElement.querySelector("#eventDescription").focus();
  }

  showConfirmRegistration() {
    this.confirmRegistration.classList.add("w3-show");
    this.confirmRegistration.classList.remove("w3-hide");
    //set focus to description field when add event modal is shown
    //this.el.nativeElement.querySelector("#eventDescription").focus();
  }

  public updateEvents(events: Event[]) {
    this.events = events;
    this.events.sort((a, b) => new Date(a.eventDateTime).valueOf() - new Date(b.eventDateTime).valueOf());
    this.futureEvents = this.events.filter(event => moment(event.eventDateTime) > moment());
    console.log("futureevents: ", this.futureEvents);
  }

  updateRegistration(eventId: string) {
    this.showConfirmRegistration();
    /*
    console.log("user", this.user.displayName, "registering for ", eventId);

    this.eventService.updateRegistration(eventId, this.user._id, false)
      .subscribe((res) => console.log(res));
      */
  }
}
