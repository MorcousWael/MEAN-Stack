import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { PostsService } from '../posts.service';
import { Post } from '../post-interface';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-list',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatProgressSpinner,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: Signal<readonly Post[]>;
  private router = inject(Router);
  isLoading: boolean = false;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.posts = this.postsService.getPosts();
    this.postsService.fetchPosts().subscribe();
    this.isLoading = false;
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe();
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }
}
