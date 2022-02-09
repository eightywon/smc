import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import User from 'src/app/models/users';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
//import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper'; //testing
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper'; //testing

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  fileName = "";

  user!: User;
  @ViewChild("updateUser") div!: ElementRef;
  @ViewChild("avatarUpload") input!: ElementRef;
  @Input() updateUser: boolean = false;
  updateUserDiv!: HTMLElement;
  uploadAvatarInput!: HTMLElement;
  tempAvatar!: string;
  avatarUpdated: boolean=false;
  tempAvatarFName!: string;
  showSpinner: boolean=false;
  croppedAvatarBlob!: Blob;

  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  constructor(private el: ElementRef, private userService: UserService, private http: HttpClient, private router: Router) { }

  //testing
  imageChangedEvent: any = '';
  croppedImage: any = '';

  imageLoaded() {
    console.log("image loaded");
  }

  cropperReady() {
    console.log("cropper ready");
  }

  loadImageFailed() {
    console.log("loadImageFailed");
    this.imageCropper.imageLoadedInView();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

    //console.log(this.croppedImage.substring(22,this.croppedImage.length));

    const byteCharacters = atob(this.croppedImage.substring(22,this.croppedImage.length));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    this.croppedAvatarBlob = new Blob([byteArray], {type: 'image/png'});
  }
  //testing

  ngOnInit(): void {
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    this.uploadAvatarInput = this.el.nativeElement.querySelector("#avatarUpload");
    let userId = localStorage.getItem("userId");
    if (userId) {
      this.getUser(userId);
    }
    this.tempAvatar=`assets/avatars/${userId}/avatar.png`;
  }

  async onSubmit(f: NgForm) {
    console.log("f submit running");
    await this.uploadFile()
    .then(()=>{
      console.log("after uploadFile then in onSubmit");
      if (f.value.displayName != "" || this.avatarUpdated) {
        if (f.value.displayName!="") {
          this.user.displayName = f.value.displayName;
        }
        this.userService.updateUser(this.user)
          .subscribe((user) => {
            console.log("user updated, hideUpdateUser");
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
            console.log("reload");
            window.location.reload();
          });
        //trap error
      }
    });
  }

  hideUpdateUser() {
    //this.showSpinner=false;
    this.tempAvatar=`assets/avatars/${this.user._id}/avatar.png`;
    this.updateUserDiv.classList.remove("w3-show");
    this.updateUserDiv.classList.add("w3-hide");
  }

/*
const myAsynFunction = async (url: string): Promise<T> => {
    const { data } = await fetch(url)
    return data
}
*/

  uploadAvatar() {
    //console.log("clicked");
    //this.showSpinner=true;
    //console.log("showing spinner");
    this.uploadAvatarInput.click();
  }

  public getUser(id: string) {
    this.userService.getUser(id)
      .subscribe((user) => {
        this.user = user;
        console.log("got user ", this.user);
      });
  }

  async uploadFile() {
    let formData: FormData = new FormData();

    interface res {
      loc: string;
    }

    formData.append('avatarUpload', this.croppedAvatarBlob, "upload.png");
    this.http.post<res>("https://smokingmonkey.club:3978/uploadFile", formData)
      .subscribe(res => {
        console.log("new avatar uploaded ",res)
        this.tempAvatar=`assets/avatars/${res.loc}/`;
        this.avatarUpdated=true;
        this.tempAvatarFName=res.loc;
        /*
        setTimeout(() => {

          //console.log("hiding spinner");
          //this.showSpinner=false;
        }, 1000);
        */
      }, err => console.log(err));
  }


  /*
  onFileSelected(event: Event) {
    let fileList = (<HTMLInputElement>event.target).files;
    if (fileList && fileList.length > 0) {
      let file: File = fileList[0];
      console.log("file: ", file);
      let formData: FormData = new FormData();

      //formData.append("name",file.name);
      //formData.append("files",file)

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
        }, err => console.log(err));
    }
  }
  */
}
