import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCommentsPage } from './modal';
// import { ModalCommentsPage } from './modales/modalComments';

@NgModule({
  declarations: [
    ModalCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCommentsPage),
  ],
})
export class ModalPageModule {}
