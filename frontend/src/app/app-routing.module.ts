import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { WallComponent } from "./pages/wall/wall.component";
import { IndexComponent } from './pages/index/index.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent} from './pages/login/login.component';
import { MainComponent } from "./pages/main/main.component";
import { EventsComponent } from './pages/events/events.component';

const routes: Routes = [
  //{ path: 'events', component: EventsComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {
        path: "wall",
        component: WallComponent, canActivate: [AuthGuard]
      },
      {
        path: "events",
        component: EventsComponent, canActivate: [AuthGuard]
      }
    ]
  },
  //{ path: 'wall', component: WallComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: IndexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
