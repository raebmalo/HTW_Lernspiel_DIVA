import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { InputAreaComponent } from './input-area/input-area.component';
import { LevelSelectionComponent } from './level-selection/level-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameUiComponent,
    InputAreaComponent,
    LevelSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
