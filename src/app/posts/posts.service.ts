import { Injectable, signal } from '@angular/core';
import { Post } from './post-interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts = signal<Post[]>([]);

  // expose as readonly (optional but good practice)
  posts = this._posts.asReadonly();

  getPosts() {
    return this.posts;
  }

  addPost(title: string, content: string) {
    const post = {
      title: title,
      content: content,
    };
    this._posts.update((prev) => [...prev, post]);
  }

  constructor() {}
}
