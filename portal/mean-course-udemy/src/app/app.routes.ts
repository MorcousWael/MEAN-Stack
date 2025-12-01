import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Posts List',
    component: PostListComponent,
  },
  {
    path: 'create-post',
    title: 'create post',
    component: PostCreateComponent,
  },
  {
    path: 'edit/:postId',
    title: 'edit post',
    component: PostCreateComponent,
  },
];
