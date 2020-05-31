import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedMapPage } from './shared-map.page';

describe('SharedMapPage', () => {
  let component: SharedMapPage;
  let fixture: ComponentFixture<SharedMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
