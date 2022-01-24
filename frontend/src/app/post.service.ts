import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import Post from "./models/posts"

@Injectable({
  providedIn: 'root'
})

export class PostService {
   readonly ROOT_URL;

  constructor(private http: HttpClient) {
   this.ROOT_URL="https://smokingmonkey.club:3978";
  }

  getPosts() {
   return this.http.get<Post[]>(`${this.ROOT_URL}/posts`);
  }

  addPost(postText: string, postedByUserId: string) {
   var tmpJson={
    "postText": postText,
    "postedByUserId": postedByUserId
   };
   return this.http.post<Post[]>(`${this.ROOT_URL}/addPost`,tmpJson)
  }

  deletePost(id: string) {
   return this.http.delete<Post[]>(`${this.ROOT_URL}/posts/${id}`)
  }

  addReply(postText: string, postedByUserId: string, parentId: string) {
    var tmpJson={
      "postText": postText,
      "postedByUserId": postedByUserId,
      "parentId": parentId
     };
    console.log("addReply obj: ",tmpJson);
    return this.http.patch<Post[]>(`${this.ROOT_URL}/addReply/${parentId}`,tmpJson)
  }

  getReplies(id: string) {
    return this.http.get<Post[]>(`${this.ROOT_URL}/replies/${id}`);
   }
}
