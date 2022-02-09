import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import User from "../../models/users";
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild("updateUser") div!: ElementRef;
  user!: User;
  displayName!: string;
  updateUserDiv!: HTMLElement;
  @Input() updateUser: boolean = false;

  constructor(private userService: UserService,
    private router: Router,
    private el: ElementRef,
    private MC: MainComponent) { }

  ngOnInit(): void {
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.userService.getUser(userId)
        .subscribe(user => {
          this.user = user;
          console.log("wall init user: ", this.user);
          if (this.user.realName != this.user.displayName) {
            this.displayName = `(${this.user.displayName})`;
          }
        });
    }
  }

  showUpdateUser() {
    this.MC.showUpdateUser();
  }

  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    this.router.navigate(["/"]);
  }

  goWall() {
    this.router.navigate(["/main/wall"]);
  }

  goEvents() {
    this.router.navigate(["/main/events"]);
  }
}
