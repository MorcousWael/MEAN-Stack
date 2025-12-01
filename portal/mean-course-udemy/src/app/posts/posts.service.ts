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

  /**
   * Return readonly signal for local use
   */
  getPosts() {
    return this.posts;
  }
  getPost(postId: string) {
    const post = this._posts().find((p) => p.id === postId);
    return post ? { ...post } : undefined;
  }

  fetchPosts() {
    return this.http.get<{ message: string; posts: any[] }>(this.apiUrl).pipe(
      tap((res) => {
        const mappedPosts = res.posts.map((post) => ({
          id: post._id,
          title: post.title,
          content: post.content,
        }));
        this._posts.set(mappedPosts);
      })
    );
  }

  addPost(title: string, content: string) {
    return this.http
      .post<{ message: string; post: any }>(this.apiUrl, { title, content })
      .pipe(
        tap((res) => {
          const postWithId = {
            id: res.post._id, // map backend _id to frontend id
            title: res.post.title,
            content: res.post.content,
          };
          this._posts.update((prev) => [...prev, postWithId]);
        })
      );
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = {
      id: postId,
      title: title,
      content: content,
    };
    return this.http.put(`${this.apiUrl}/${postId}`, post);
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.apiUrl}/${postId}`).pipe(
      tap(() => {
        this._posts.update((prev) => prev.filter((post) => post.id !== postId));
      })
    );
  }
}
