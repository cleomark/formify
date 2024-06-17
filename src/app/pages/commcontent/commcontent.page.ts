import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-commcontent',
  templateUrl: './commcontent.page.html',
  styleUrls: ['./commcontent.page.scss'],
})
export class CommcontentPage implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messageToSend: string = '';
  messages:any = [];
  isMessageVisible: boolean = false;
  chat:any;
  idKo:string = this.API.getUserData().id;
  constructor(private API:ApiService, private router :Router) {}

  ngOnInit() {
    if(this.API.chat==null){
      this.router.navigate(['/tabs/communication']);
      return;
    }
    this.chat = this.API.chat;
    this.getMessages();
    this.API.socket!.onmessage = (message) => {
      var data = new TextDecoder('utf-8').decode(message.data);
      const parsedMessage = JSON.parse(data);
      if(parsedMessage.app == 'formify'){
        if(parsedMessage.type == 'newmessage'){
          if(parsedMessage.to == this.API.getUserData().id){
            this.pushNewMessage(parsedMessage);
          }
        }
      }
    };
  }

  pushNewMessage(message:any){
    this.messages.push({
      id:message.id,
      senderid: message.senderid,
      recipientID: message.to,
      message:message.message,
      sent:true,
    });

  }

  getMessages(){
    this.API.getMessages(this.chat).subscribe(data=>{
      if(data.success){
        for(let message of data.output){
          message.sent = true;
          this.messages.push(message);
          if(message.seen=='f' && message.recipientid==this.API.getUserData().id){
            this.API.markSeen(message.id)
          }
        }
      }else{
        this.API.failedSnackbar('Problem loading messages..');
      }
    })
  }

  openSettings() {
    console.log('Clicked');
  }

  sendMessageKo() {
    if (this.messageToSend.trim() !== '') {
      const id = this.API.createID32();
      this.API.socketSend({
        id:id,
        app:'formify',
        type : 'newmessage',
        from : this.API.getUserData().username,
        senderid: this.API.getUserData().id,
        message:this.messageToSend,
        to: this.chat.id,
      })
      this.messages.push({
        id:id,
        senderid:this.idKo,
        recipientID: this.chat.id,
        message:this.messageToSend,
        sent:true,
      });

      this.API.sendMessage(this.messageToSend, this.chat.id).subscribe(data=>{

      });
      
      this.messageToSend = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  goBack(){

    this.router.navigate(['tabs/communication' ,{v:this.API.createID32()}]);
  }

  showMyMessage() {
    this.isMessageVisible = !this.isMessageVisible;
  }
}
