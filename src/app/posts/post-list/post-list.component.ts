import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf } from '@angular/common';
import { Post } from 'app/posts/post-interface';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, NgIf],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  // @Input
  // Posts = [
  //   { title: '1st Post', content: 'this is first post text' },
  //   { title: '2nd Post', content: 'this is sec post text' },
  //   { title: '3rd Post', content: 'this is third post text' },
  // ];
  // readonly panelOpenState = signal(false);
  @Input() posts: Post[] = [];
}
