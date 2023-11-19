import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { InputAreaComponent } from './input-area/input-area.component';
import { LevelSelectionComponent } from './level-selection/level-selection.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { TheIdeaComponent } from './the-idea/the-idea.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ImpressumComponent } from './impressum/impressum.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameUiComponent,
    InputAreaComponent,
    LevelSelectionComponent,
    HowToPlayComponent,
    TheIdeaComponent,
    AboutUsComponent,
    ImpressumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
