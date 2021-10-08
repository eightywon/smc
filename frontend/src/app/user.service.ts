import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http" 
import User from "./models/users"

interface JSONWebToken {
  token: string;
  userId: string;
}

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
    return this.http.get<User>(`${this.ROOT_URL}/users/${id}`);
   }

  getUserByCell(cell: string) {
    return this.http.get<User[]>(`${this.ROOT_URL}/userByCell/${cell}`);
  }

  addUser(user: User) {
    return this.http.post<JSONWebToken>(`${this.ROOT_URL}/addUser`,user)
  }

  //is the user logged in (JWT exists in local storage)?
  loggedIn() {
    return !!localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  login(id: string) {
    return this.http.get<JSONWebToken>(`${this.ROOT_URL}/login/${id}`)
  }

  updateUser(user: User) {
    return this.http.patch<User>(`${this.ROOT_URL}/users/${user._id}`,user)
  }
}
