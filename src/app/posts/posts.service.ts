import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
 private posts: Post[] = [];
 private postsUpdate = new Subject<Post[]>();

 constructor(private http: HttpClient) {}

 getPosts() {
   this.http.get<{message: string, posts: any}>(
     'http://localhost:3000/api/posts'
   )
   .pipe(map((postData) => {
     return postData.posts.map((post) => {
       return {
         title: post.title,
         content: post.content,
         id: post._id
       };
     });
   }))
   .subscribe(transformedData => {
     this.posts = transformedData;
     this.postsUpdate.next([...this.posts]);
   });
 }

 getPostsUpdateListener() {
   return this.postsUpdate.asObservable();
 }

 addPost(title: string, content: string){
   const post: Post = {id: null, title, content}
   this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
   .subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
   });
 }

deletePost(postId) {
  this.http.delete('http://localhost:3000/api/posts/' + postId)
  .subscribe(() => {
    const updatePosts = this.posts.filter(post => post.id !== postId);
    this.posts = updatePosts;
    this.postsUpdate.next([...this.posts]);
  });
}

}
