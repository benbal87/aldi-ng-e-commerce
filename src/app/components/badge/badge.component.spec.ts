import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BadgeComponent } from './badge.component'

describe('NavigationCartBadgeComponent', () => {
  let component: BadgeComponent
  let fixture: ComponentFixture<BadgeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [BadgeComponent]
      })
      .compileComponents()

    fixture = TestBed.createComponent(BadgeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display the content if provided', () => {
    component.content = 'Test Badge'
    fixture.detectChanges()
    const spanElement = fixture.nativeElement.querySelector('.badge-content')
    expect(spanElement).toBeTruthy()
    expect(spanElement.textContent).toContain('Test Badge')
  })

  it('should not display anything if content is null', () => {
    component.content = null
    fixture.detectChanges()
    const spanElement = fixture.nativeElement.querySelector('.badge-content')
    expect(spanElement).toBeNull()
  })

  it('should display numerical content correctly', () => {
    component.content = 123
    fixture.detectChanges()
    const spanElement = fixture.nativeElement.querySelector('.badge-content')
    expect(spanElement).toBeTruthy()
    expect(spanElement.textContent).toContain('123')
  })

  it('should have the correct styles for the badge', () => {
    component.content = 'Styled'
    fixture.detectChanges()
    const spanElement = fixture.nativeElement.querySelector('.badge-content')
    expect(spanElement).toBeTruthy()
    expect(getComputedStyle(spanElement).backgroundColor).toBe('rgb(0, 0, 255)')
    expect(getComputedStyle(spanElement).color).toBe('rgb(255, 255, 255)')
    expect(getComputedStyle(spanElement).borderRadius).toBe('50%')
  })

  it('should have bounce-in animation applied', () => {
    component.content = 'Animation'
    fixture.detectChanges()
    const spanElement = fixture.nativeElement.querySelector('.badge-content')
    expect(spanElement).toBeTruthy()
    const animationName = getComputedStyle(spanElement).animationName.replace(
      /_ngcontent-[^_]+_/g,
      ''
    )
    expect(animationName).toBe('bounce-in')
  })
})
