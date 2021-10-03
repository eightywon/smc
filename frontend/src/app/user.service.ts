import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http" 

import User from "./models/users"

@Injectable({
  providedIn: 'root'
})

export class UserService {
   readonly ROOT_URL;

  constructor(private http: HttpClient) {
   this.ROOT_URL="https://smokingmonkey.club:3978";
  }

  getUsers() {
   return this.http.get<User[]>(`${this.ROOT_URL}/users`);
  }

  getUser(id: string) {
    return this.http.get<User[]>(`${this.ROOT_URL}/users/${id}`);
   }

  /*
  createPost(postText: string, postedByUserId: string) {
   return this.webService.post(lists,{})
  }
  */

}
