import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  protected user: string;
  protected messages = new Array<any>();
  protected message: string;

constructor(private route: ActivatedRoute, private socket: Socket, private toastController: ToastController) {}

ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.user = queryParams['user'];
      console.log('user:' + this.user);
    });

    this.socket.connect();
    console.log('user depois do connect:' + this.user);
    this.socket.emit('user-connected', this.user);

    this.getData('users-changed').subscribe((data: any) => {
      this.presentToast('Usuário ' + data.event + ': ' + data.user);
    });

    this.getData('message').subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  getData(event: string){
    let observable = new Observable(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });

    return observable;
  }

  async presentToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    return await toast.present();
  }

  sendMessage(){
    this.socket.emit('message', { user: this.user, message: this.message, date: new Date() });
    this.message = null;
  }

  ionViewWillUnload(){
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }
}
