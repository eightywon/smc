import { Component, OnInit, ElementRef } from '@angular/core';
import Event from "../../models/events";
import { EventsService } from 'src/app/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  addEvent!: HTMLElement;
  events: Event[] = [];
  isAdmin: boolean = true;

  constructor(private eventService: EventsService,
    private el: ElementRef) { }

  ngOnInit() {
    this.addEvent = this.el.nativeElement.querySelector("#addEvent");
    this.eventService.geEvents()
      .subscribe(events => {
        console.log(events);
        this.events = events;
      });
  }

  public deleteEvent(id: string) {
    this.eventService.deleteEvent(id);
  }

  public showAddEvent() {
    this.addEvent.classList.add("w3-show");
    this.addEvent.classList.remove("w3-hide");
    console.log("show add event");
  }
}
