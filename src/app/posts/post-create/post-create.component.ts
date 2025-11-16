import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../post-interface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-post-create',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
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
export class PostCreateComponent {
  enteredTitle: string = '';
  enteredContent: string = '';
  @Output() postCreated = new EventEmitter<Post>();

  OnAddPost(form: NgForm) {
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };
    this.postCreated.emit(post);
    this.enteredTitle = '';
    this.enteredContent = '';
  }
}
