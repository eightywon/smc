import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { WallComponent } from "./pages/wall/wall.component";
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: 'wall', component: WallComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: IndexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
