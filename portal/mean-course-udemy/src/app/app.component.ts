import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mean-course-udemy';
  // storedPosts: Post[] = [];

  // onPostAdded(post: Post) {
  //   this.storedPosts.push(post);
  //   console.log(this.storedPosts);
  // }
}
