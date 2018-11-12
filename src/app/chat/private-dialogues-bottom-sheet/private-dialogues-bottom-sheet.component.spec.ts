import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateDialoguesBottomSheetComponent } from './private-dialogues-bottom-sheet.component';

describe('PrivateDialoguesBottomSheetComponent', () => {
  let component: PrivateDialoguesBottomSheetComponent;
  let fixture: ComponentFixture<PrivateDialoguesBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateDialoguesBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateDialoguesBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
