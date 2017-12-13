import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// importing forms module
import { FormsModule } from '@angular/forms';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { ChatService } from './chat.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ChatDialogComponent],
  // exporting chatdialogcomponent
  exports: [ChatDialogComponent],
  providers: [ChatService]
})
export class ChatModule { }
