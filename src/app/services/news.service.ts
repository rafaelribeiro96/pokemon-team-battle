import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) {}

  getAllNews(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.apiUrl, { params });
  }

  getFeaturedNews(limit: number = 5): Observable<any> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/featured`, { params });
  }

  getNewsById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  searchNews(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  createNews(newsData: any): Observable<any> {
    return this.http.post(this.apiUrl, newsData);
  }

  createNewsWithImage(
    title: string,
    content: string,
    image: File,
    isFeatured: boolean = false,
    categories: any[] = []
  ): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('is_featured', isFeatured.toString());

    if (image) {
      formData.append('image', image);
    }

    if (categories.length > 0) {
      formData.append('categories', JSON.stringify(categories));
    }

    return this.http.post(`${this.apiUrl}/with-image`, formData);
  }

  updateNews(id: number, newsData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, newsData);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }

  addComment(newsId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${newsId}/comments`, { content });
  }

  deleteComment(newsId: number, commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${newsId}/comments/${commentId}`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }
}
