import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { SpeechService } from '../speech.service';
declare const $: any;
// importing dependency

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})

export class ChatDialogComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  showSearchButton: boolean;
  speechData: string;
  messages: Observable<Message[]>;
  formValue: string;
  scroll: any;
  
  utterance: any;

  constructor(public chat: ChatService, private speechService: SpeechService) {
    this.showSearchButton = true;
    this.speechData = '';
    this.utterance = this.speechService.utterance;

  }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .scan(((acc, val) => acc.concat(val)));
    this.scrollToBottom();
    $(document).ready(function () {
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      $('.modal').modal();
    });

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    // this.flag = this.speechService.voiceFlag;
  }

  // auto scroll
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    this.speechService.destroySpeechObject();
  }

 

  sendMessage() {
    this.chat.converse(this.formValue);
    console.log(this.formValue);
    this.formValue = '';
    // this.checkflag();
  }

  activateSpeechSearch(): void {
    this.showSearchButton = false;
    this.speechService.record()
      .subscribe(
      // listener
      (value) => {
        this.speechData = value;
        this.formValue = this.speechData;
        this.sendMessage();
        console.log(value);
      },
      // errror
      (err) => {
        console.log(err);
        if (err.error === 'no-speech') {
          console.log('--restatring service--');
          this.activateSpeechSearch();
        }
      },
      // completion
      () => {
        this.showSearchButton = true;
        console.log('--complete--');
        // this.activateSpeechSearch();
      });
  }
  restart() {
    this.formValue = 'RESTART';
    this.sendMessage();
  }

  start() {
    this.formValue = 'START';
    this.sendMessage();
  }
  exit() {
    this.formValue = 'EXIT';
    this.sendMessage();
  }

  speak(text) {
    console.log(text);
    this.speechService.synthVoice(text);
  }
}
