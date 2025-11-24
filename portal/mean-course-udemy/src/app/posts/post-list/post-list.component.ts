import { Component, OnInit, Signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { PostsService } from '../posts.service';
import { Post } from '../post-interface';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, MatButtonModule, NgIf, NgFor], // <-- added NgFor
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: Signal<readonly Post[]>;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsService.fetchPosts();
  }

  onDelete(postId: string) {
    // implement later
  }

  onEdit(postId: string) {
    // implement later
  }
}
