import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WallComponent } from './pages/wall/wall.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService} from './token-interceptor.service';
import { LoginComponent } from './pages/login/login.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ImageCropperModule } from 'ngx-image-cropper';
import { EventsComponent } from './pages/events/events.component';
import { MainComponent } from './pages/main/main.component';
import { EventsSummaryComponent } from './pages/events-summary/events-summary.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddEventComponent } from './pages/add-event/add-event.component';
import { ConfirmRegistrationComponent } from './pages/confirm-registration/confirm-registration.component';

const config: SocketIoConfig = { url: 'https://smokingmonkey.club:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    WallComponent,
    RegisterComponent,
    IndexComponent,
    UpdateUserComponent,
    LoginComponent,
    EventsComponent,
    MainComponent,
    EventsSummaryComponent,
    ProfileComponent,
    AddEventComponent,
    ConfirmRegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    ImageCropperModule
  ],
  providers: [AuthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }