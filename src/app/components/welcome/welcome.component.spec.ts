import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { WelcomeComponent } from './welcome.component'

describe('WelcomeComponent', () => {
  let component: WelcomeComponent
  let fixture: ComponentFixture<WelcomeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(WelcomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the card title as "Welcome!"', () => {
    const cardTitleElement = fixture
      .debugElement
      .query(By.css('mat-card-title'))
      ?.nativeElement
    expect(cardTitleElement.textContent).toContain('Welcome!')
  })

  it('should render the first paragraph of card content', () => {
    const paragraphElements = fixture
      .debugElement
      .queryAll(By.css('mat-card-content p'))
    expect(paragraphElements[0].nativeElement.textContent)
      .toContain(
        'Welcome to this technical assessment task!')
  })

  it('should render the second paragraph of card content', () => {
    const paragraphElements = fixture
      .debugElement
      .queryAll(By.css('mat-card-content p'))
    expect(paragraphElements[1].nativeElement.textContent)
      .toContain(
        'The purpose of this project is to demonstrate the implementation of various features using Angular and Angular Material.'
      )
  })

  it('should render the third paragraph of card content', () => {
    const paragraphElements = fixture
      .debugElement
      .queryAll(By.css('mat-card-content p'))
    expect(paragraphElements[2].nativeElement.textContent)
      .toContain(
        'Thank you for taking the time to review this task. Your feedback is greatly appreciated.'
      )
  })
})
