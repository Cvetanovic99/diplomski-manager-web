import { UserService } from './../../../admin/user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/_shared/models/Auth/User';
import { State } from '../../../_shared/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tools-detail',
  templateUrl: './tools-detail.page.html',
  styleUrls: ['./tools-detail.page.scss'],
})
export class ToolsDetailPage implements OnInit {

  constructor(private store: Store<State>,
              private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              ) { }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  user: User | null;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editorFormActive = false;

  editorForm: FormGroup;

  ngOnInit() {
    this.getUserFromStore();
  }



  getUserFromStore() {
    this.store
      .pipe(select(authUser))
      .subscribe(user => {
        if (!user) {
          this.router.navigate(['/prijava']);
        }
        this.fetchUser(user?.id);
      });
  }

  fetchUser(userId: number) {
    this.userService.show(userId).subscribe(
      result => {
        this.user = result;
        this.buildEditorForm(this.user);
      },
      error => {
        // TODO (handle-me)
      },
    );
  }

  buildEditorForm(user?: User) {
    this.editorForm = this.formBuilder.group({
      id: [user ? user.id : null],
      tools: [user ? user.tools : '']
    });

    this.editorFormActive = true;
  }

}
