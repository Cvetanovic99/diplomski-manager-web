import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'projekti',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectModule)
  },
  {
    path: '',
    loadChildren: () => import('./tools/tools.module').then( m => m.ToolsModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerRoutingModule { }
