import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  showMenu = false;

  constructor(public auth: Auth) {}

  toggleMenu() {
    console.log('click avatar');
    this.showMenu = !this.showMenu;
    console.log('showMenu:', this.showMenu);
  }


  get user() {
    return this.auth.getUser();
  }
}
