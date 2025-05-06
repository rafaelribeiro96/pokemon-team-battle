import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {
  teams: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isLoggedIn = false;

  constructor(
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadTeams();
  }

  loadTeams(): void {
    this.isLoading = true;
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.isLoading = false;
        this.teams = teams;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Erro ao carregar times';
      },
    });
  }

  deleteTeam(id: number): void {
    if (confirm('Tem certeza que deseja excluir este time?')) {
      this.teamService.deleteTeam(id).subscribe({
        next: () => {
          this.loadTeams(); // Recarregar a lista após excluir
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Erro ao excluir time';
        },
      });
    }
  }

  isTeamOwner(team: any): boolean {
    if (!this.isLoggedIn) return false;

    const currentUser = this.authService.getCurrentUser();
    return currentUser ? team.user_id === currentUser.id : false;
  }
}
