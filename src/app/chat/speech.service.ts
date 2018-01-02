import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class SpeechService {
  speechRecognition: any;
  utterance: any;
  constructor(private zone: NgZone) { }
  // recording speech
  record(): Observable<string> {

    return Observable.create(observer => {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 1;
      this.speechRecognition.onresult = speech => {
        let term: string = '';
        if (speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log('Unrecognized result - Please try again');
            } else {
              term = _.trim(transcript);
              console.log('Did you said? -> ' + term + ' , If not then say something else...');
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
      console.log('Say something - We are listening !!!');
    });
  }

  // text to speech conversion
  synthVoice(botText) {
    const textToSpeech = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.rate = 2.5;
    this.utterance.text = botText;
    textToSpeech.speak(this.utterance);
  }
  // destroyiong speech object
  destroySpeechObject() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }

}

