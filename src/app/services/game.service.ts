import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Game} from "../models/game.model";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game/';

  constructor(private http: HttpClient) { }

  getGameByLevelFromDatabase(level: string): Observable<Game> {
    const formattedLevel = GameService.formatLevel(level);
    const url = `${this.apiUrl}?level=${formattedLevel}`;
    return this.http.get<Game[]>(url).pipe(
      map(games => {
        if (games && games.length > 0) {
          const matchingGame = games.find(game => game.level === formattedLevel);
          if (matchingGame) {
            return matchingGame;
          } else {
            console.error('Kein passender Eintrag für Level gefunden:', formattedLevel);
            return new Game();
          }
        } else {
          console.error('Keine Spiele gefunden.');
          return new Game();
        }
      }),
      catchError(error => {
        console.error('Error loading game:', error);
        return of(new Game());
      })
    );
  }

  private static formatLevel(level: string): string {
    const match = level.match(/level-(\d+)/i);
    console.log(match)
    if (match) {
      const levelNumber = parseInt(match[1]);
      return 'Level ' + levelNumber;
    } else {
      return '';
    }
  }
}
