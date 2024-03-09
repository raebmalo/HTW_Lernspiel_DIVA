import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Map} from "../models/map.model";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiUrl = 'http://localhost:3000/api/map/';

  constructor(private http: HttpClient) { }

  getMapByLevel(level: string): Observable<Map> {
    const formattedLevel = MapService.formatLevel(level);
    const url = `${this.apiUrl}?level=${formattedLevel}`;
    return this.http.get<Map[]>(url).pipe(
      map(maps => {
        if (maps && maps.length > 0) {
          const matchingMap = maps.find(map => map.level === formattedLevel);
          if (matchingMap) {
            return matchingMap;
          } else {
            console.error('Kein passender Eintrag für Level gefunden:', formattedLevel);
            return new Map();
          }
        } else {
          console.error('Keine Spiele gefunden.');
          return new Map();
        }
      }),
      catchError(error => {
        console.error('Error loading map:', error);
        return of(new Map());
      })
    );
  }

  private static formatLevel(level: string): string {
    const match = level.match(/level-(\d+)/i);
    if (match) {
      const levelNumber = parseInt(match[1]);
      return 'Level ' + levelNumber;
    } else {
      return '';
    }
  }
}
