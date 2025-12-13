import { computed, Injectable, signal } from '@angular/core';
import { Post } from './post-interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts = signal<Post[]>([]);
  private _totalPosts = signal<number>(0);

  // Expose as readonly to components
  posts = this._posts.asReadonly();
  totalPosts = this._totalPosts.asReadonly();

  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  /**
   * Return readonly signal for local use
   */

  getPost(postId: string) {
    const post = this._posts().find((p) => p.id === postId);
    return post ? { ...post } : undefined;
  }

  fetchPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any[]; totalPosts: number }>(
        this.apiUrl + queryParams
      )
      .pipe(
        tap((res) => {
          const mappedPosts = res.posts.map((post) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          }));
          this._posts.set(mappedPosts);
          this._totalPosts.set(res.totalPosts);
        })
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, image.name);
    return this.http
      .post<{ message: string; post: Post }>(this.apiUrl, postData)
      .pipe(
        tap((res) => {
          const postWithId = {
            id: res.post.id,
            title: res.post.title,
            content: res.post.content,
            imagePath: res.post.imagePath,
          };
          this._posts.update((prev) => [...prev, postWithId]);
          this._totalPosts.update((count) => count + 1);
        })
      );
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (image instanceof File) {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, image.name);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    return this.http
      .put<{ message: string; post: any }>(`${this.apiUrl}/${postId}`, postData)
      .pipe(
        tap((res) => {
          // update the local _posts signal
          this._posts.update((prev) => {
            const updatedPosts = prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    title,
                    content,
                    imagePath: res.post.imagePath, // ensure backend returns the new path
                  }
                : post
            );
            return updatedPosts;
          });
        })
      );
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.apiUrl}/${postId}`).pipe(
      tap(() => {
        this._posts.update((prev) => prev.filter((post) => post.id !== postId));
        this._totalPosts.update((count) => count - 1);
      })
    );
  }
}
