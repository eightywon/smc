import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import User from '../../models/users';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
  cf: HTMLElement;
  f: HTMLElement
  readonly ROOT_URL;
  smsSent: boolean = false;
  showVerification: boolean = false;
  dim: boolean = false;
  min: number = 111111;
  max: number = 999999;
  regCode: number = 0;
  inputCode: string = "";
  badCell: boolean = false;
  cellMessage: string = "";
  model: User = new User();
  user: User = new User();

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private el: ElementRef,
    private _router: Router
  ) {
    this.ROOT_URL = "https://smokingmonkey.club:3978";
  }

  ngOnInit(): void {
    this.cf = this.el.nativeElement.querySelector("#cf");
    this.f = this.el.nativeElement.querySelector("#f");
    if (this.userService.loggedIn()) {
      this._router.navigate(["/wall"]);
    }
  }

  cfSubmit(cf: NgForm, e: Event) {
    //testing
    this.regCode=cf.value.code;

    if (cf.value.code == this.regCode) {
      console.log("matched! user: ", this.user);
      this.user.displayName = this.user.realName;
      this.user.verificationCode = String(this.regCode);
      this.userService.addUser(this.user)
        .subscribe(res => {
          console.log(res);
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.userId)
          this._router.navigate(["/wall"]);
        });
        //catch error here
    } else {
      e.preventDefault();

      const code = this.el.nativeElement.querySelector("#code");
      code.focus();
      code.select();

      this.cf.classList.add('animated');
      this.cf.classList.add('shake');
      setTimeout(() => {
        this.cf.classList.remove('animated');
        this.cf.classList.remove('shake');
      }, 500);
    }
  }

  onSubmit(f: NgForm) {
    interface res {
      sid: String;
      status: String;
      error: String;
    }

    this.userService.getUserByCell(f.value.cell)
      .subscribe((user) => {
        this.badCell = false;
        this.cellMessage = "";
        if (user.length == 0) {
          this.min = Math.ceil(this.min);
          this.max = Math.floor(this.max);
          this.regCode = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
          f.value.message = `Your SMC verification code is ${this.regCode}`;

          //testing
          /*
          this.http.post<res>(`${this.ROOT_URL}/regsms`, f.value)
            .subscribe(res => {

              if (res.status == "201") {
                this.smsSent = true;
                console.log("new user: ", f.value);
                this.user = f.value;
              } else {
                this.cellMessage = JSON.stringify(res.error);
                this.smsSent = false;
                this.badCell = true;
              }
              this.showVerification = true;
            });
          */
            this.user = f.value;
            this.smsSent=true;
            this.showVerification=true;
        } else {
          this.cellMessage = "A user with that cell already exists";
          this.badCell = true;
          const cell = this.el.nativeElement.querySelector("#cell");
          cell.focus();
          cell.select();
        }
      });
  }
}
