// Import Angular core and RxJS functionalities
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Map } from "../models/map.model";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root' // Service available globally
})
export class MapService {
  private apiUrl = 'http://localhost:3000/api/map/'; // API endpoint

  constructor(private http: HttpClient) {} // Inject HttpClient for HTTP operations

  // Fetch map data by level, return Observable<Map>
  getMapByLevel(level: string): Observable<Map> {
    const formattedLevel = MapService.formatLevel(level); // Format level string
    const url = `${this.apiUrl}?level=${formattedLevel}`; // Construct API request URL
    return this.http.get<Map[]>(url).pipe(
      map(maps => maps && maps.length > 0 ? maps.find(map => map.level === formattedLevel) || new Map() : new Map()), // Extract matching map or default
      catchError(error => { // Handle request errors
        console.error('Error loading map:', error);
        return of(new Map()); // Return default Map on error
      })
    );
  }

  // Helper method to format the level string for API query
  private static formatLevel(level: string): string {
    const match = level.match(/level-(\d+)/i); // Extract level number from string
    return match ? 'Level ' + parseInt(match[1]) : ''; // Format or default to empty string
  }
}
