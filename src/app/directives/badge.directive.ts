import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core'
import { BadgeComponent } from '../components/badge/badge.component'

@Directive({
  selector: '[appBadge]',
  standalone: true
})
export class BadgeDirective implements OnInit, OnDestroy, OnChanges {

  @Input({ required: true })
  appBadge: number | string | null = null

  private componentRef?: ComponentRef<BadgeComponent>

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private environmentInjector: EnvironmentInjector,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadBadgeComponent()
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy()
    }
  }

  ngOnChanges() {
    this.loadBadgeComponent()
  }

  private loadBadgeComponent(): void {
    this.viewContainerRef.clear()

    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative')

    this.componentRef =
      this.viewContainerRef.createComponent(
        BadgeComponent,
        {
          injector: this.viewContainerRef.injector,
          environmentInjector: this.environmentInjector
        }
      )
    this.renderer.appendChild(
      this.el.nativeElement,
      this.componentRef.location.nativeElement
    )

    if (this.componentRef) {
      this.componentRef.instance.content = this.appBadge
      this.cdr.detectChanges()
    }
  }

}
