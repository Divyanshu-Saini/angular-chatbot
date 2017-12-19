import { Component, OnInit, OnDestroy } from '@angular/core';
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

export class ChatDialogComponent implements OnInit, OnDestroy {
  showSearchButton: boolean;
  speechData: string;
  messages: Observable<Message[]>;
  formValue: string;
  you: "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";
  me: "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";


  constructor(public chat: ChatService, private speechService: SpeechService) {
    this.showSearchButton = true;
    this.speechData = '';
  }

  ngOnInit() {
    $(".mytext").on("keyup", function (e) {
      if (e.which == 13) {
        var text = $(this).val();
        if (text !== "") {
          this.insertChat("me", text);
          $(this).val('');
        }
      }
    });
    this.resetChat();

    //-- Print Messages
    this.insertChat("me", "Hello Tom...", 0);
    this.insertChat("you", "Hi, Pablo", 1500);
    this.insertChat("me", "What would you like to talk about today?", 3500);
    this.insertChat("you", "Tell me a joke", 7000);
    this.insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
    this.insertChat("you", "LOL", 12000);
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .scan(((acc, val) => acc.concat(val)));
  }

  ngOnDestroy() {
    this.speechService.DestroySpeechObject();
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    console.log(this.formValue);
    this.formValue = '';
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
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  insertChat(who, text, time = 0) {
    var control = "";
    var date = this.formatAMPM(new Date());

    if (who == "me") {

      control = '<li style="width:100%">' +
        '<div class="msj macro">' +
        '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + this.me + '" /></div>' +
        '<div class="text text-l">' +
        '<p>' + text + '</p>' +
        '<p><small>' + date + '</small></p>' +
        '</div>' +
        '</div>' +
        '</li>';
    } else {
      control = '<li style="width:100%;">' +
        '<div class="msj-rta macro">' +
        '<div class="text text-r">' +
        '<p>' + text + '</p>' +
        '<p><small>' + date + '</small></p>' +
        '</div>' +
        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + this.you + '" /></div>' +
        '</li>';
    }
    setTimeout(
      function () {
        $("ul").append(control);

      }, time);

  }

  resetChat() {
    $("ul").empty();
  }

}
