import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HowToPlayComponent} from "./how-to-play/how-to-play.component";
import {TheIdeaComponent} from "./the-idea/the-idea.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ImpressumComponent} from "./impressum/impressum.component";
import { GameAreaComponent } from './game-area/game-area.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/play-the-game/level-1',
    pathMatch: 'full'
  },
  {
    path: 'play-the-game',
    redirectTo: '/play-the-game/level-1',
    pathMatch: 'full'
  },
  {
    path: 'play-the-game/:level',
    component: GameAreaComponent
  },
  {
    path: 'how-to-play',
    component: HowToPlayComponent,
  },
  {
    path: 'the-idea',
    component: TheIdeaComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
