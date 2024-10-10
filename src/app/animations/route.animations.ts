import {
  animate,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger
} from '@angular/animations'

export const routeAnimations: AnimationTriggerMetadata =
  trigger(
    'routeAnimations',
    [
      transition(
        '* <=> *',
        [
          style({ opacity: 0 }),
          animate('1s', style({ opacity: 1 }))
        ]
      )
    ]
  )
