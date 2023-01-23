import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faComments,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Modals } from 'src/app/modals';
import { ReportType } from 'src/app/report/report-type';
import { ReportService } from 'src/app/report/report.service';
import { PostModel } from '../post-model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-topic-posts',
  templateUrl: './topic-posts.component.html',
  styleUrls: ['./topic-posts.component.css'],
})
export class TopicPostsComponent implements OnInit {
  posts: PostModel[] = [];
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faComments = faComments;
  topicName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private postService: PostService,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private modals: Modals
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.postService
        .getAllPostsForTopic(routeParams['topic-name'])
        .subscribe({
          next: (data) => (
            (this.posts = data), (this.topicName = routeParams['topic-name'])
          ),
          error: () =>
            this.modals.errorNotification('Cant load posts for this topic'),
        });
    });
  }

  goToPost(id: number) {
    this.router.navigateByUrl('/view-post/' + id);
  }

  isPostOwnedByLoggedUser(postUsername: string): boolean {
    return this.authService.getUserName() == postUsername;
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () =>
        this.postService
          .getAllPostsForUser(this.authService.getUserName())
          .subscribe({
            next: (data) => (this.posts = data),
            error: (error) => console.log(error),
          }),
      error: (error) => this.modals.errorNotification('Failed to delete post'),
    });
  }

  goToEditPost(id: number) {
    this.router.navigateByUrl('update-post/' + id);
  }
}
