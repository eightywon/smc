import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Socket } from 'ngx-socket-io';
import Event from './models/events';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  readonly ROOT_URL;

  constructor(private http: HttpClient, private socket: Socket) {
    this.ROOT_URL = "https://smokingmonkey.club:3978";
  }

  geEvents() {
    return this.http.get<Event[]>(`${this.ROOT_URL}/events`);
  }

  addEvent(eventDescription: string,
    eventCreatedByUserId: string,
    eventType: string,
    eventTime: string) {
    
    var tmpJson = {
      "eventDescription": eventDescription,
      "eventCreatedByUserId": eventCreatedByUserId,
      "eventType": eventType,
      "eventTIme": eventTime
    };
    console.log("adding event events.service ",tmpJson);
    return this.http.post<Event[]>(`${this.ROOT_URL}/addEvent`, tmpJson).subscribe(res=>console.log(res));
  }

  deleteEvent(id: string) {
    console.log("deleteEvent from service ",id);
    return this.http.delete<Event[]>(`${this.ROOT_URL}/events/${id}`).subscribe(res=>console.log(res));
  }
}
