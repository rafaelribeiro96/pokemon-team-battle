import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-3d-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pokemon-3d-container">
      <div class="model-container" *ngIf="modelUrl">
        <model-viewer
          [src]="modelUrl"
          alt="Modelo 3D do Pokémon"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="1"
          shadow-softness="0.7"
          environment-image="neutral"
          ar
          ar-modes="webxr scene-viewer quick-look"
        ></model-viewer>
      </div>
      <div class="fallback" *ngIf="!modelUrl">
        <div class="rotating-sprite">
          <img [src]="spriteUrl" [alt]="pokemonName" class="sprite-image" />
        </div>
        <p class="fallback-text">
          Visualização 3D não disponível para este Pokémon
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .pokemon-3d-container {
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
        border-radius: 10px;
        overflow: hidden;
        margin: 20px 0;
      }

      .model-container {
        width: 100%;
        height: 100%;
      }

      model-viewer {
        width: 100%;
        height: 100%;
        --poster-color: transparent;
      }

      .fallback {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .rotating-sprite {
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: float 3s ease-in-out infinite;
      }

      .sprite-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .fallback-text {
        margin-top: 15px;
        font-size: 14px;
        color: #666;
      }

      @keyframes float {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(5deg);
        }
        100% {
          transform: translateY(0) rotate(0deg);
        }
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Pokemon3DViewerComponent implements OnChanges {
  @Input() pokemonId: number = 0;
  @Input() pokemonName: string = '';
  @Input() spriteUrl: string = '';

  modelUrl: string | null = null;

  // Lista de Pokémon com modelos 3D disponíveis (exemplo)
  private availableModels: number[] = [1, 4, 7, 25, 133, 150];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemonId']) {
      this.checkModelAvailability();
    }
  }

  private checkModelAvailability(): void {
    // Verificar se temos um modelo 3D para este Pokémon
    if (this.availableModels.includes(this.pokemonId)) {
      // URL para o modelo 3D (exemplo)
      this.modelUrl = `/assets/models/pokemon-${this.pokemonId}.glb`;
    } else {
      this.modelUrl = null;
    }
  }
}
