import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { CommentService } from 'src/app/comment/comment.service';
import { Modals } from 'src/app/modals';
import { PostModel } from 'src/app/post/post-model';
import { PostService } from 'src/app/post/service/post.service';
import { ReportType } from 'src/app/report/report-type';
import { ReportService } from 'src/app/report/report.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
})
export class ViewPostComponent implements OnInit {
  post: PostModel;
  commentForm: FormGroup;
  postOwnedByLoggedUser: boolean = false;

  constructor(
    private postService: PostService,
    private activateRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private reportService: ReportService,
    private modals: Modals
  ) {
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });

    this.post = {
      id: 0,
      title: '',
      content: '',
      likes: 0,
      dislikes: 0,
      userName: '',
      topicName: '',
      commentCount: 0,
      duration: '',
      liked: false,
      disliked: false,
      usernameDislikes: [],
      usernameLikes: [],
    };
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((routeParams) => {
      (this.post.id = routeParams['id']),
        this.postService.getPost(this.post.id).subscribe({
          next: (data) => {
            this.post = data;
            this.postOwnedByLoggedUser =
              this.authService.getUserName() == data.userName;
          },
          error: (error) => throwError(() => error),
        })
    });
  }

  getPostById() {
    this.postService.getPost(this.post.id).subscribe({
      next: (data) => (this.post = data),
      error: (error) => throwError(() => error),
    });
  }

  deletePost() {
    this.postService.deletePost(this.post.id).subscribe({
      next: (data) => this.router.navigateByUrl('/'),
    });
  }

  goToEditPost() {
    this.router.navigateByUrl('update-post/' + this.post.id);
  }
}
