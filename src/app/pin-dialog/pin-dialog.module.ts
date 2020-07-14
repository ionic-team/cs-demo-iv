import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PinDialogComponent } from './pin-dialog.component';

@NgModule({
  declarations: [PinDialogComponent],
  exports: [PinDialogComponent],
  entryComponents: [PinDialogComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PinDialogComponentModule {}
