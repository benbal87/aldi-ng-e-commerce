import { Component } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { routeAnimations } from '../../animations/route.animations'

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    MatCardModule
  ],
  template: `
    <mat-card class="centered-card">
      <mat-card-header>
        <mat-card-title>Welcome!</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Welcome to this technical assessment task!</p>
        <p>The purpose of this project is to demonstrate the implementation of
           various features using Angular and Angular Material.</p>
        <p>Thank you for taking the time to review this task. Your feedback is
           greatly appreciated.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .centered-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    mat-card-header {
      margin-bottom: 1rem;
    }
  `,
  animations: [routeAnimations]
})
export class WelcomeComponent {

}
