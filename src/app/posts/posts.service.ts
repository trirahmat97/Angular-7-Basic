import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService{
 private posts: Post[] = [];
 private postsUpdate = new Subject<Post[]>();

 getPosts(){
   return [...this.posts];
 }

 getPostsUpdateListener(){
   return this.postsUpdate.asObservable();
 }

 addPost(title: string, content: string){
   const post: Post = {title, content}
   this.posts.push(post);
   this.postsUpdate.next([...this.posts]);
 }
}
