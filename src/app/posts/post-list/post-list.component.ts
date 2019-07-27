import {Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from './../post.model';
import { PostsService } from '../posts.service';

import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub: Subscription;
  constructor(public postsService: PostsService){}
  ngOnInit() {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostsUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    }, (err) => {
      console.log(err);
    });
  }

  onDelete(postId: string){
    console.log(postId);
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
