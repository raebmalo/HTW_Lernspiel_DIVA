import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { TheIdeaComponent } from './the-idea/the-idea.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { GameAreaComponent } from './game-area/game-area.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HowToPlayComponent,
    TheIdeaComponent,
    AboutUsComponent,
    ImpressumComponent,
    GameAreaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // Fügen Sie BrowserAnimationsModule hinzu
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
