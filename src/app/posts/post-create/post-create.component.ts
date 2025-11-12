import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.sass',
})
// in this part we covered the folowing:
// 1- 1 way binding events () and property binding
// 2- 2 way binding ngmodel
// outputing read data
// i alos tried to use view child which cna be replaced using template refrences or ngmodel in case of 2 way binding
export class PostCreateComponent {
  // @ViewChild('txtarea') txtarea!: ElementRef<HTMLTextAreaElement>;
  // @ViewChild('postData') pRef!: ElementRef<HTMLParagraphElement>;
  newPostData: String = '';
  enteredValue: String = '';

  OnAddPost() {
    // this.pRef.nativeElement.textContent = txtAreaVal;
    this.newPostData = this.enteredValue;
  }
}
