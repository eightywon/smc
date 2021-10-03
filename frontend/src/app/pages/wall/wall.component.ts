import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Post from "../../models/posts";
import { PostService } from "../../post.service";
import * as moment from 'moment';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})

export class WallComponent implements OnInit {

  @ViewChild("updateUser") div: ElementRef;

  posts: Post[];
  moment: any = moment;
  @Input() updateUser: boolean = false;
  updateUserDiv: HTMLElement;

  avatar = "https://smokingmonkey.club/assets/avatars/6155c3b11e992589e42fdd7d/avatar.png";

  constructor(private postService: PostService, private el: ElementRef) { }


  ngOnInit() {
    this.updateUserDiv = this.el.nativeElement.querySelector("#updateUser");
    this.postService.getPosts()
      .subscribe((posts) => {
        console.log("posts:", posts);
        this.posts = posts;
      });
  }

  public post() {
    var postFld = document.getElementById("newPost"), postText = "";
    if (postFld) {
      var postText = postFld.innerHTML;
      postFld.innerHTML = "";
    }
    console.log(postText);
    this.postService.addPost(postText, "6155c3b11e992589e42fdd7d")
      .subscribe((posts) => {
        this.posts = posts;
      });
    //.catch((error)=>console.log(error));
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
}
