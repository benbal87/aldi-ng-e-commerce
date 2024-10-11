import { Component } from '@angular/core'
import { MockBuilder, MockRender } from 'ng-mocks'
import { BadgeDirective } from './badge.directive'

@Component({
  template: `
    <div [appBadge]="appBadge">
      content
    </div>
  `
})
class TestComponent {
  appBadge: string | number | null = 'initialValue'
}

describe('BadgeDirective', () => {

  beforeEach(() => MockBuilder(BadgeDirective))

  it(
    'should create an instance of the directive and append the BadgeComponent',
    () => {
      const fixture = MockRender(
        `
        <div appBadge="9hKibH2E">
          content
        </div>
    `,
        {
          value: false
        }
      )

      expect(fixture.nativeElement.innerHTML).toContain('9hKibH2E')

      expect(fixture.nativeElement.innerHTML).toContain(
        'style="position: relative;"'
      )
    }
  )

  it('should update the BadgeComponent when the appBadge input changes', () => {
    const fixture = MockRender(TestComponent)
    const componentInstance = fixture.point.componentInstance

    expect(fixture.nativeElement.innerHTML).toContain('initialValue')

    componentInstance.appBadge = 'updatedValue'
    fixture.detectChanges()

    expect(fixture.nativeElement.innerHTML).toContain('updatedValue')
  })

  it(
    'should not contain the BadgeComponent when the appBadge input changes to null',
    () => {
      const fixture = MockRender(TestComponent)
      const componentInstance = fixture.point.componentInstance

      expect(fixture.nativeElement.innerHTML).toContain('badge-content')

      componentInstance.appBadge = null
      fixture.detectChanges()

      expect(fixture.nativeElement.innerHTML).not.toContain('badge-content')
    }
  )
})
