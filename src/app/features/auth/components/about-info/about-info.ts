import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-about-info',
  imports: [AvatarModule, AnimateOnScrollModule],
  templateUrl: './about-info.html',
  styleUrls: ['./about-info.css'],
})
export class AboutInfo {}
