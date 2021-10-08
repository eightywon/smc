import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import User from 'src/app/models/users';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

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
  tempAvatar: string;
  avatarUpdated: boolean=false;
  tempAvatarFName: string;
  showSpinner: boolean=false;

  constructor(private el: ElementRef, private userService: UserService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    this.uploadAvatarInput = this.el.nativeElement.querySelector("#avatarUpload");
    let userId = localStorage.getItem("userId");
    if (userId) {
      this.getUser(userId);
    }
    this.tempAvatar=`assets/avatars/${userId}/avatar.png`;
  }

  onSubmit(f: NgForm) {
    console.log("f submit running");
    if (f.value.displayName != "" || this.avatarUpdated) {
      if (f.value.displayName!="") {
        this.user.displayName = f.value.displayName;
      }
      this.userService.updateUser(this.user)
        .subscribe((user) => {
          this.user = user;
          this.hideUpdateUser();
          if (this.avatarUpdated) {
            this.avatarUpdated=false;
            let tmpData={
              "newAvatarLoc": this.tempAvatarFName,
              "_id": this.user._id
            }
            this.http.post("https://smokingmonkey.club:3978/updateAvatar",tmpData)
             .subscribe(res=>console.log(res),
             err=>console.log(err));
          }
          //window.location.reload();
        });
      //trap error
    }
  }

  hideUpdateUser() {
    this.showSpinner=false;
    this.tempAvatar=`assets/avatars/${this.user._id}/avatar.png`;
    this.updateUserDiv.classList.remove("w3-show");
    this.updateUserDiv.classList.add("w3-hide");
  }

  uploadAvatar() {
    console.log("clicked");
    this.showSpinner=true;
    console.log("showing spinner");
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
    /*
    setTimeout(() => {
    }, 3000);
    */
    let fileList = (<HTMLInputElement>event.target).files;
    if (fileList && fileList.length > 0) {
      let file: File = fileList[0];
      console.log("file: ", file);
      let formData: FormData = new FormData();

      /*
      formData.append("name",file.name);
      formData.append("files",file)
      */

      interface res {
        loc: string;
      }

      formData.append('avatarUpload', file, file.name);
      console.log(formData.getAll('file'));
      this.http.post<res>("https://smokingmonkey.club:3978/uploadFile", formData)
        .subscribe(res => {
          console.log(res)
          this.tempAvatar=`assets/avatars/${res.loc}/`;
          setTimeout(() => {
            this.avatarUpdated=true;
            this.tempAvatarFName=res.loc;
            console.log("hiding spinner");
            this.showSpinner=false;
          }, 1000);
        },
          err => console.log(err));
    }
  }
}
