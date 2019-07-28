import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
 constructor(private http: HttpClient, private router: Router) {}

 private posts: Post[] = [];
 private postsUpdate = new Subject<Post[]>();

 getPosts() {
   this.http.get<{message: string, posts: any}>(
     'http://localhost:3000/api/posts'
   )
   .pipe(map((postData) => {
     return postData.posts.map((post) => {
       return {
         title: post.title,
         content: post.content,
         id: post._id,
         imagePath: post.imagePath
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

 getPost(id: string) {
   return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
     'http://localhost:3000/api/posts/' + id
     );
 }

 addPost(title: string, content: string, image: File) {
   const postData = new FormData();
   postData.append('title', title);
   postData.append('content', content);
   postData.append('image', image, title);
   this.http.post<{message: string, post: Post}>(
     'http://localhost:3000/api/posts',
     postData
   )
   .subscribe((responseData) => {
     const post: Post = {
       id: responseData.post.id,
       title,
       content,
       imagePath: responseData.post.imagePath
     };
    this.posts.push(post);
    this.postsUpdate.next([...this.posts]);
    this.router.navigate(['/']);
   });
 }

 updatePost(id: string, title: string, content: string, image: File | string) {
  let postData: Post | FormData;
  if (typeof(image) === 'object') {
    postData = new FormData();
    postData.append('id', id);
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
  } else {
    postData = {
      id,
      title,
      content,
      imagePath: image
    };
  }
  this.http.put('http://localhost:3000/api/posts/' + id, postData)
  .subscribe(respose => {
    const updatePosts = [...this.posts];
    const oldPostIndex = updatePosts.findIndex(p => p.id === id);
    const post: Post = {
      id,
      title,
      content,
      imagePath: ''
    };
    updatePosts[oldPostIndex] = post;
    this.posts = updatePosts;
    this.postsUpdate.next([...this.posts]);
    this.router.navigate(['/']);
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
