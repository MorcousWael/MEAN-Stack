import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { PostsService } from '../posts.service';
import { Post } from '../post-interface';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatProgressSpinner,
    MatPaginatorModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: Signal<readonly Post[]>;
  private router = inject(Router);
  isLoading: boolean = false;
  totalPosts!: Signal<number>;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.posts = this.postsService.posts;
    this.totalPosts = this.postsService.totalPosts;
    this.postsService
      .fetchPosts(this.postsPerPage, this.currentPage)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;

    this.postsService.deletePost(postId).subscribe(() => {
      // If current page is empty and we are not on the first page
      if (this.posts().length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }

      // Refetch posts for current page
      this.postsService
        .fetchPosts(this.postsPerPage, this.currentPage)
        .subscribe(() => {
          this.isLoading = false;
        });
    });
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }
  onChangePage(pagedData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pagedData.pageIndex + 1;
    this.postsPerPage = pagedData.pageSize;
    this.postsService
      .fetchPosts(this.postsPerPage, this.currentPage)
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
