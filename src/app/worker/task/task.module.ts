import { SingleTaskEditorComponent } from './components/single-task-editor/single-task-editor.component';
import { UserSwiperComponent } from './components/user-swiper/user-swiper.component';
import { SncodesSwiperComponent } from './components/sncodes-swiper/sncodes-swiper.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';

import { TaskCreatorComponent } from './components/task-creator/task-creator.component';
import { ProductSwiperComponent } from './components/product-swiper/product-swiper.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';


@NgModule({
  declarations: [ TaskCreatorComponent, ProductSwiperComponent, SncodesSwiperComponent, UserSwiperComponent, NoteEditorComponent,
                   SingleTaskEditorComponent ],
  imports: [
    SharedModule
  ]
})
export class TaskModule { }
