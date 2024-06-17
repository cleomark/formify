import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage{

  inbox:any = [];

  people:any = [];

  audio:HTMLAudioElement;
  search:string ;
  constructor(private router: Router , private API:ApiService) {
    this.search = '';
    this.audio = new Audio();
    this.audio.src = '../../../assets/sounds/notif.mp3'
    this.audio.load();
  }


  updateSearch(event:any){
    this.search = event.target.value;
  }


  ngOnInit() {
    this.API.socket!.onmessage = (message) => {
      var data = new TextDecoder('utf-8').decode(message.data);
      const parsedMessage = JSON.parse(data);
      if(parsedMessage.app == 'formify'){
        if(parsedMessage.type == 'newmessage'){
          if(parsedMessage.to == this.API.getUserData().id){
            this.loadPeople();
            this.API.justSnackbar(parsedMessage.from +' messaged you.');
            this.audio.play();
          }
        }
      }
    };
    this.loadPeople();
  }

  loadPeople(){
    this.people = [];
    this.API.loadAdmins().subscribe(data=>{
      if(data.success){
        for(let admin of data.output){
          if(admin.id != this.API.getUserData().id){
            admin.type = 'admin';

            this.API.getMessages({
              id:admin.id,
              account:'admin'
            }).subscribe(data=>{
              admin.lastmessage = data.output[data.output.length-1]
            })

            this.people.push(admin);
          }
        }
      }else{
        this.API.failedSnackbar('Failed loading agents');
      }
    })
    this.API.loadAgents().subscribe(data=>{
      if(data.success){
        for(let agent of data.output){
          if(agent.id != this.API.getUserData().id){
            agent.type = 'agent';
            this.API.getMessages({
              id:agent.id,
            }).subscribe(data=>{
              agent.lastmessage = data.output[data.output.length-1]
            })
            this.people.push(agent);
          }
        }
      }else{
        this.API.failedSnackbar('Failed loading agents');
      }
    });
  }
  parseTime(timestamp:string){
    const time = new Date(timestamp);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
     }); 
  }

  openMessages(id:string, username:string,type:string){
    this.API.openChat(id,username, type);
    this.router.navigate(['/commcontent']);
  }
}
