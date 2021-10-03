import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WallComponent } from './pages/wall/wall.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';

@NgModule({
  declarations: [
    AppComponent,
    WallComponent,
    RegisterComponent,
    IndexComponent,
    UpdateUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
