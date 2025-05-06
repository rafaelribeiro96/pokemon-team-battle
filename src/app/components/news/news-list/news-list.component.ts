import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {
  newsList: any[] = [];
  featuredNews: any | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isAdmin = false;

  constructor(
    private newsService: NewsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNews();
    this.isAdmin = this.authService.isAdmin();
  }

  loadNews(): void {
    this.isLoading = true;
    this.newsService.getAllNews().subscribe({
      next: (news) => {
        this.isLoading = false;
        // Separar notícias em destaque e normais
        this.featuredNews = news.find((item: any) => item.is_featured);
        this.newsList = news.filter((item: any) => !item.is_featured);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Erro ao carregar notícias';
      },
    });
  }

  deleteNews(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          this.loadNews(); // Recarregar a lista após excluir
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Erro ao excluir notícia';
        },
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
