import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post-interface';

@Component({
  selector: 'app-post-create',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// in this part we covered the folowing:
// 1- 1 way binding events () and property binding
// 2- 2 way binding ngmodel
// outputing read data
// i alos tried to use view child which cna be replaced using template refrences or ngmodel in case of 2 way binding
export class PostCreateComponent implements OnInit {
  enteredTitle: string = '';
  enteredContent: string = '';
  post!: Post;
  isEditMode: boolean = false;
  private postId: string | null = null;
  // injections
  private postsService = inject(PostsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  constructor() {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isEditMode = true;
        this.postId = paramMap.get('postId')!;
        this.post = this.postsService.getPost(this.postId)!;
        console.log(this.post);
      } else {
        this.isEditMode = false;
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (!this.isEditMode) {
      this.postsService
        .addPost(form.value.title, form.value.content)
        .subscribe(() => form.resetForm());
    } else {
      this.postsService
        .updatePost(this.postId!, form.value.title, form.value.content)
        .subscribe(() => {
          console.log('Post updated');
        });
    }
    this.router.navigate(['/']);
  }
}
