import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import User from 'src/app/models/users';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  fileName = "";

  user: User;
  @ViewChild("updateUser") div: ElementRef;
  @ViewChild("avatarUpload") input: ElementRef;
  @Input() updateUser: boolean = false;
  updateUserDiv: HTMLElement;
  uploadAvatarInput: HTMLElement;

  constructor(private el: ElementRef, private userService: UserService, http: HttpClient) { }

  ngOnInit(): void {
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    this.uploadAvatarInput = this.el.nativeElement.querySelector("#avatarUpload");
    let userId=localStorage.getItem("userId");
    if (userId) {
      this.getUser(userId);
    }
  }

  onSubmit(f: NgForm) {
    interface res {
      sid: String;
      status: String;
    }

    console.log(f.value);
  }

  hideUpdateUser() {
    this.updateUserDiv.classList.remove("w3-show");
    this.updateUserDiv.classList.add("w3-hide");
  }

  uploadAvatar() {
    console.log("clicked");
    this.uploadAvatarInput.click();
  }

  public getUser(id: string) {
    this.userService.getUser(id)
      .subscribe((user) => {
        this.user = user;
        console.log("got user ", this.user);
      });
  }

  onFileSelected(event: Event) {
    console.log(event);


    
  }
}
