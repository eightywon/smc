import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Socket } from 'ngx-socket-io';
import Event from './models/events';
import * as moment from 'moment';

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
    eventTime: string,
    eventDate: string,
    eventOtherDesc: string,
    eventBuyin: string,
    eventRebuys: string,
    eventMaxregs: string,
    eventCurrentRegs: string) {
    
    var tmpJson = {
      "eventDescription": eventDescription,
      "eventCreatedByUserId": eventCreatedByUserId,
      "eventType": eventType,
      "eventDateTime": moment(eventDate+' '+eventTime+":00").utc(),
      "eventOtherDesc": eventOtherDesc,
      "eventBuyin": eventBuyin,
      "eventRebuys": eventRebuys,
      "eventMaxregs": eventMaxregs,
      "eventCurrentRegs": eventCurrentRegs
    };
    console.log("adding event events.service ",tmpJson);
    return this.http.post<Event[]>(`${this.ROOT_URL}/addEvent`, tmpJson);
  }

  deleteEvent(id: string) {
    console.log("deleteEvent from service ",id);
    return this.http.delete<Event[]>(`${this.ROOT_URL}/events/${id}`);
  }

  updateRegistration(eventId: string, userId: string, newStatus: boolean) {
    var tmpJson = {
      "eventId": eventId,
      "userId": userId,
      "newStatus": newStatus
    };
    console.log("user",userId," updating reg for event",eventId,"to",newStatus);
    return this.http.patch<Event[]>(`${this.ROOT_URL}/updateRegistration/${eventId}`,tmpJson)
  }
}
