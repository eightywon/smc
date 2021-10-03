import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import User from '../../models/users';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
  validationForm: HTMLElement;
  readonly ROOT_URL;
  smsSent: boolean=false;
  showVerification: boolean=false;
  dim: boolean=false;
  min: number=111111;
  max: number=999999;
  regCode: number=0;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private el: ElementRef
  ) {
    this.ROOT_URL = "https://smokingmonkey.club:3978";
  }

  ngOnInit(): void {
    this.validationForm = this.el.nativeElement.querySelector("#validationForm");
    console.log(this.validationForm);
    console.log(this.validationForm);
  }

  cfSubmit(cf: NgForm, e: Event) {
    console.log(cf.value);
    if (cf.value.code==this.regCode) {
      console.log("we fuckin did it");
      window.location.href = '/wall';
    } else{
      e.preventDefault();
      this.validationForm.classList.add('animated');
      this.validationForm.classList.add('shake');
      setTimeout(() => {
        this.validationForm.classList.remove('animated');
        this.validationForm.classList.remove('shake');
     }, 500);
      console.log("poop");
    }
  }

  onSubmit(f: NgForm) {
    interface res {
      sid: String;
      status: String;
    }

    this.smsSent=true;

    this.min = Math.ceil(this.min);
    this.max = Math.floor(this.max);
    this.regCode = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;

    console.log(f.value);
    f.value.message = `Your SMC verification code is ${this.regCode}`;
    this.http.post<res>(`${this.ROOT_URL}/regsms`, f.value)
      .subscribe(res => {
        
        if (res.status == "201") {
          this.smsSent=true;
        } else {
          this.smsSent=false;
        }
        this.showVerification=true;
        console.log(res)
      });
  }
}
