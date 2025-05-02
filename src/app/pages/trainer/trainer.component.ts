import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="under-construction">
      <h1>Perfil de Treinador</h1>
      <p>O perfil de treinador estará disponível em breve!</p>
      <img src="/assets/images/pikachu-loading.gif" alt="Em construção" />
      <a routerLink="/" class="back-button">Voltar para o início</a>
    </div>
  `,
  styles: [
    `
      .under-construction {
        text-align: center;
        padding: 50px 20px;
        max-width: 600px;
        margin: 0 auto;

        h1 {
          color: var(--pokemon-red);
          margin-bottom: 20px;
        }

        p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 30px;
        }

        img {
          max-width: 200px;
          margin-bottom: 30px;
        }

        .back-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: var(--pokemon-blue);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;

          &:hover {
            background-color: darken(#3b4cca, 10%);
            transform: translateY(-3px);
          }
        }
      }
    `,
  ],
})
export class TrainerComponent {}
