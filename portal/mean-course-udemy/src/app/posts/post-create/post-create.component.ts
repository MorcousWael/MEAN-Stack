import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
    ReactiveFormsModule,
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
export class PostCreateComponent implements OnInit {
  form!: FormGroup;
  post: Post | null = null;
  isEditMode = false;
  postId: string | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  //injections
  private postsService = inject(PostsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // initialize empty form (works for create mode)
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
      }),
      // image: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });

    // detect edit mode
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isEditMode = true;
        this.postId = paramMap.get('postId')!;
        this.post = this.postsService.getPost(this.postId)!;

        // patch values in edit mode
        this.form.patchValue({
          title: this.post.title,
          content: this.post.content,
          imagePath: this.post.imagePath,
        });
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) return;

    if (!this.isEditMode) {
      this.postsService
        .addPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
        .subscribe(() => this.form.reset());
    } else {
      this.postsService
        .updatePost(
          this.postId!,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
        .subscribe(() => console.log('Post updated'));
    }

    this.router.navigate(['/']);
  }
  onImagePick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }
    this.form.patchValue({
      image: file,
    });
    this.form.get('image')?.updateValueAndValidity();
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.isUploading = false;
      this.cdr.markForCheck(); // <-- tells Angular to update the view
      console.log(this.isUploading, 'upload finished');
    };
    reader.readAsDataURL(file);
  }
}
