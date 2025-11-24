import { Injectable, signal } from '@angular/core';
import { Post } from './post-interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts = signal<Post[]>([]);
  // Expose as readonly to components
  posts = this._posts.asReadonly();

  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  fetchPosts() {
    return this.http
      .get<{ message: string; posts: Post[] }>(this.apiUrl)
      .pipe(tap((res) => this._posts.set(res.posts)));
  }

  addPost(title: string, content: string) {
    const post = {
      id: Math.random().toString(36).substring(2, 9), // temporary ID
      title,
      content,
    };
    return this.http
      .post<{ message: string }>(this.apiUrl, post)
      .pipe(tap(() => this._posts.update((prev) => [...prev, post])));
  }

  /**
   * Return readonly signal for local use
   */
  getPosts() {
    return this.posts;
  }
}
