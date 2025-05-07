/* team.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getAllPublicTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/public`);
  }

  getUserTeams(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTeam(teamData: any): Observable<any> {
    return this.http.post(this.apiUrl, teamData);
  }

  updateTeam(id: number, teamData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, teamData);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
