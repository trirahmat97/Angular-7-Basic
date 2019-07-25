import {Component, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  inputTitle = '';
  inputContent = '';

  constructor(public postsService: PostsService){}

  savePost(form: NgForm){
    if(form.invalid){
      return false;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
