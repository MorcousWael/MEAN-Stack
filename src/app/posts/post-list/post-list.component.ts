import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, MatButtonModule, NgIf],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  onDelete() {
    throw new Error('Method not implemented.');
  }
  onEdit() {
    throw new Error('Method not implemented.');
  }
  constructor(public postsService: PostsService) {}
}
