import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Post from "../../models/posts";
import Reply from "../../models/replies";
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
  replies: Reply[];
  user: User;
  moment: any = moment;
  @Input() updateUser: boolean = false;
  updateUserDiv: HTMLElement;
  displayName: string;

  constructor(private postService: PostService,
    private el: ElementRef,
    private router: Router,
    private userService: UserService) { }


  ngOnInit() {
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
          this.postService.getPosts()
          .subscribe(
            posts => {
              console.log("posts:", posts);
              this.posts = posts;
            },
            err => {
              console.log("error getting posts");
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                  this.router.navigate(["/"]);
                }
              }
            });
        });
    }
  }

  public post() {
    const postFld = (<HTMLInputElement>document.getElementById("newPost"));
    const postText = postFld.value;
    console.log(postFld);
    if (postFld) {
      postFld.value = "";
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

  public reply(parentId: string) {
    const replyField = (<HTMLInputElement>document.getElementById("replyText"+parentId));
    const replyText = replyField.value;
    let userId = localStorage.getItem("userId");
    if (userId) {
      console.log("adding new reply with text of: ",replyText);
      this.postService.addReply(replyText, userId, parentId)
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
