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
    component: GameAreaComponent,
    children: [
      {
        path:'level-1', component: GameAreaComponent
      },
      {
        path:'level-2', component: GameAreaComponent
      },
      {
        path:'level-3', component: GameAreaComponent
      },
      {
        path:'level-4', component: GameAreaComponent
      },
      {
        path:'level-5', component: GameAreaComponent
      },
      {
        path:'level-6', component: GameAreaComponent
      },
      {
        path:'level-7', component: GameAreaComponent
      },
      {
        path:'level-8', component: GameAreaComponent
      },
      {
        path:'level-9', component: GameAreaComponent
      },
      {
        path:'level-10', component: GameAreaComponent
      }
    ]
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
