import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Post from "../../models/posts";
import { PostService } from "../../post.service";
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import User from "../../models/users";
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})

export class WallComponent implements OnInit {

  @ViewChild("updateUser") div: ElementRef;

  posts: Post[];
  user: User;
  moment: any = moment;
  @Input() updateUser: boolean = false;
  updateUserDiv: HTMLElement;

  constructor(private postService: PostService, 
              private el: ElementRef, 
              private router: Router,
              private userService: UserService) { }


  ngOnInit() {
    const userId=localStorage.getItem("userId");
    if (userId) {
      this.userService.getUser(userId)
      .subscribe(user=> {
        this.user=user
        console.log("wall init user: ",this.user);
      });
    }
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    this.postService.getPosts()
      .subscribe(
        posts => {
        console.log("posts:", posts);
        this.posts = posts;
      },
      err=> {
        console.log("error getting posts");
        if (err instanceof HttpErrorResponse) {
          if (err.status===401) {
            this.router.navigate(["/"]);
          }
        }
      });
  }

  public post() {
    var postFld = document.getElementById("newPost"), postText = "";
    if (postFld) {
      var postText = postFld.innerHTML;
      postFld.innerHTML = "";
    }
    console.log(postText);
    let userId = localStorage.getItem("userId");
    if (userId) {
      this.postService.addPost(postText, userId)
        .subscribe((posts) => {
          this.posts = posts;
        });
      //.catch((error)=>console.log(error));
    }
  }

  public deletePost(id: string) {
    this.postService.deletePost(id)
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  showUpdateUser() {
    this.updateUserDiv.classList.add("w3-show");
    this.updateUserDiv.classList.remove("w3-hide");
  }

  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    this.router.navigate(["/"]);
  }
}
