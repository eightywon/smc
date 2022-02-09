import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/events.service';

@Component({
  selector: 'app-events-summary',
  templateUrl: './events-summary.component.html',
  styleUrls: ['./events-summary.component.css']
})
export class EventsSummaryComponent implements OnInit {

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
  }

  public addEvent () {
    console.log("adding evnt");
    this.eventService.addEvent("Some Event",
    "12345",
    "Tournament",
    "8pm")
  }
}
