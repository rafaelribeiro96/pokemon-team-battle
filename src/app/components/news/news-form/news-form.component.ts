import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent implements OnInit {
  newsForm: FormGroup;
  categories: any[] = [];
  selectedCategories: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  newsId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      is_featured: [false],
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // Verificar se estamos no modo de edição
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.newsId = +params['id'];
        this.isEditMode = true;
        this.loadNewsDetails(this.newsId);
      }
    });
  }

  loadCategories(): void {
    this.newsService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        this.errorMessage =
          error.error.message || 'Erro ao carregar categorias';
      },
    });
  }

  loadNewsDetails(id: number): void {
    this.isLoading = true;

    this.newsService.getNewsById(id).subscribe({
      next: (news) => {
        this.newsForm.patchValue({
          title: news.title,
          content: news.content,
          is_featured: news.is_featured,
        });

        this.selectedCategories = news.categories || [];

        if (news.image_url) {
          this.previewUrl = news.image_url;
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Erro ao carregar notícia';
      },
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;

    // Criar preview da imagem
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  toggleCategory(category: any): void {
    const index = this.selectedCategories.findIndex(
      (c) => c.id === category.id
    );

    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  isCategorySelected(category: any): boolean {
    return this.selectedCategories.some((c) => c.id === category.id);
  }

  onSubmit(): void {
    if (this.newsForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const { title, content, is_featured } = this.newsForm.value;

    if (this.isEditMode && this.newsId) {
      // Modo de edição
      const newsData = {
        title,
        content,
        is_featured,
        categories: this.selectedCategories,
      };

      this.newsService.updateNews(this.newsId, newsData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/news']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage =
            error.error.message || 'Erro ao atualizar notícia';
        },
      });
    } else {
      // Modo de criação
      if (this.selectedFile) {
        // Com imagem
        this.newsService
          .createNewsWithImage(
            title,
            content,
            this.selectedFile,
            is_featured,
            this.selectedCategories
          )
          .subscribe({
            next: () => {
              this.isSaving = false;
              this.router.navigate(['/news']);
            },
            error: (error) => {
              this.isSaving = false;
              this.errorMessage =
                error.error.message || 'Erro ao criar notícia';
            },
          });
      } else {
        // Sem imagem
        const newsData = {
          title,
          content,
          is_featured,
          categories: this.selectedCategories,
        };

        this.newsService.createNews(newsData).subscribe({
          next: () => {
            this.isSaving = false;
            this.router.navigate(['/news']);
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = error.error.message || 'Erro ao criar notícia';
          },
        });
      }
    }
  }
}
