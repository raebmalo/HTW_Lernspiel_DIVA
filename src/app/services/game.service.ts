// Import Angular and RxJS functionalities
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Game } from "../models/game.model";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root' // Make service globally available
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game/'; // API endpoint

  constructor(private http: HttpClient) {} // Inject HttpClient

  // Fetch game by level, return Observable<Game>
  getGameByLevelFromDatabase(level: string): Observable<Game> {
    const formattedLevel = GameService.formatLevel(level); // Format level query
    const url = `${this.apiUrl}?level=${formattedLevel}`; // Build request URL
    return this.http.get<Game[]>(url).pipe(
      map(games => games && games.length > 0 ? games.find(game => game.level === formattedLevel) || new Game() : new Game()), // Map response to Game or new Game
      catchError(error => { // Handle errors
        console.error('Error loading game:', error);
        return of(new Game()); // Return empty Game on error
      })
    );
  }

  // Format level string to match API requirements
  private static formatLevel(level: string): string {
    const match = level.match(/level-(\d+)/i);
    return match ? 'Level ' + parseInt(match[1]) : '';
  }
}
