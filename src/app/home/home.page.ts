import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private user: string;

  constructor(private router: Router) {}

  openChat(){
    this.router.navigate(['chat'], {
      queryParams: { 'user': this.user } 
  });
  }
}
