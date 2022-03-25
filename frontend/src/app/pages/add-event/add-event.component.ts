import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { EventsService } from 'src/app/events.service';
import Event from "../../models/events";
import { EventsComponent } from '../events/events.component';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})

export class AddEventComponent implements OnInit {

  moment: any = moment;
  eventType: any;
  isChecked: boolean = true;
  today = (moment(new Date()).format('YYYY-MM-DD'));
  goTime = "20:00";
  buyIn="50";
  reBuysDefault="0";
  maxPlayersDefault="10";
  addEvent!: HTMLElement;
  events: Event[]=[];
  futureEvents: Event[]=[];

  constructor(private el: ElementRef,
    private eventService: EventsService,
    private EC: EventsComponent) { }

  ngOnInit(): void {
    this.addEvent = this.el.nativeElement.querySelector("#addEvent");
    this.eventType = "tournament"; //default radio button
  }


  hideAddEvent() {
    this.addEvent.classList.remove("w3-show");
    this.addEvent.classList.add("w3-hide");
  }

  submit(event: any) {
    console.log("form submitted ", event);

    const userId = localStorage.getItem("userId");
    if (userId) {
      var formVals = event.form.controls;

      //send blank if otherDesc isn't in DOM (other not selected), otherwise send value
      const otherDesc = !formVals.otherDesc ? "" : formVals.otherDesc.value;

      this.eventService.addEvent(formVals.eventDescription.value,
        userId,
        formVals.eventType.value,
        formVals.eventTime.value,
        formVals.eventDate.value,
        otherDesc,
        formVals.buyin.value,
        formVals.rebuys.value,
        formVals.maxplayers.value,"0")
        .subscribe((events) => {
          console.log("events after subscribe ",events);
          this.EC.updateEvents(events);
        });
    }
    this.hideAddEvent();
  }
}
