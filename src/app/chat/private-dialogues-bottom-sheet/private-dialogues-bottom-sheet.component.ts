import { Component, Inject } from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {LocalStorageService} from 'angular-2-local-storage';
import _ from 'lodash';


@Component({
  selector: 'app-private-dialogues-bottom-sheet',
  templateUrl: './private-dialogues-bottom-sheet.component.html'
})
export class PrivateDialoguesBottomSheetComponent {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<PrivateDialoguesBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private localStorage: LocalStorageService) {}

  public openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

}
