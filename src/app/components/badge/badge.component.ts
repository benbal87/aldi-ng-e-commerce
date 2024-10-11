import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  template: `
    @if (content) {
      <span class="badge-content">
        {{ content }}
      </span>
    }
  `,
  styles: `
    :host {
      display: contents;

      @keyframes bounce-in {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.3);
          opacity: 1;
        }
        100% {
          transform: scale(1);
        }
      }

      span {
        animation: bounce-in 0.5s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        background-color: blue;
        border-radius: 50%;
        padding: 0.2rem;
        color: white;
        font-size: xx-small;
        position: absolute;
        bottom: -1rem;
        left: -1rem;
      }
    }
  `
})
export class BadgeComponent {

  @Input({ required: true })
  content: string | number | null = null

}
