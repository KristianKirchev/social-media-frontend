import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faExclamation,
  faInbox,
  faLocation,
  faLocationDot,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/service/auth.service';
import { Location } from 'src/app/public-api/location';
import { StompService } from '../stomp-service';
import { NotificationService } from '../notification/notification.service';
import { NotificationModel } from '../notification/notification-model';
import { Frame } from '../chat/chat/websocket-mess';
import { ChatService } from '../chat/service/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  faUser = faUser;
  faInbox = faInbox;
  faBell = faBell;
  faExclamation = faExclamation;
  isLoggedIn: boolean;
  username: string;
  notifications: NotificationModel[] = [];
  notification_count: number = 0;
  message_count: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private stomp: StompService,
    private notificationService: NotificationService,
    private chatService: ChatService
  ) {
    this.username = '';
    this.isLoggedIn = this.authService.isLogged();
  }

  ngOnInit(): void {
    console.log('reinit header')
    this.authService.username.subscribe(
      (data: string) => (this.username = data)
    );

    this.isLoggedIn = this.authService.isLogged();
    this.username = this.authService.getUserName();
  }

  goToUserProfile() {
    this.router.navigateByUrl('/user-profile/' + this.username);
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.isLoggedIn = false;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToAdminPage() {
    this.router.navigateByUrl('admin');
  }
}
