import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {HttpClient} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdate = new Subject<{posts: Post[], postCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

 getPosts(postsPerPage: number, currentPage: number) {
   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
   this.http.get<{message: string, posts: any, maxPosts: number}>(
     'http://localhost:3000/api/posts' + queryParams
   )
   .pipe(
     map(postData => {
      return {
        posts: postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
   }))
   .subscribe(transformedPostData => {
    //  console.log(transformedPostData);
     this.posts = transformedPostData.posts;
     this.postsUpdate.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
   });
 }

 getPostsUpdateListener() {
   return this.postsUpdate.asObservable();
 }

 getPost(id: string) {
   return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(
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
      imagePath: image,
      creator: null
    };
  }
  this.http.put('http://localhost:3000/api/posts/' + id, postData)
  .subscribe(respose => {
    this.router.navigate(['/']);
  });
 }

 deletePost(postId) {
  return this.http.delete('http://localhost:3000/api/posts/' + postId);
}

}
