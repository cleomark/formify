import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  audio:HTMLAudioElement;
  
  constructor(private API:ApiService) { 
    this.audio = new Audio();
    this.audio.src = '../../../assets/sounds/notif.mp3'
    this.audio.load();
  }

  activeTabTitle: string = '';

  ngOnInit(): void {
    this.API.socket.onopen = () => {
      this.API.socket!.onmessage = (message) => {
        var data = new TextDecoder('utf-8').decode(message.data);
        const parsedMessage = JSON.parse(data);
        if(parsedMessage.app == 'formify'){
          if(parsedMessage.type == 'newmessage'){
            if(parsedMessage.to == this.API.getUserData().id){
              this.API.justSnackbar(parsedMessage.from +' messaged you.');
             
            }
          }
        }
      };
    };
  }

  updateActiveTab(event: any) {
    const selectedTab = event.tab;
    this.activeTabTitle = this.getTabTitle(selectedTab);
  }

  getTabTitle(tab: string): string {
    const tabTitleMap: { [key: string]: string } = {
      Home: 'Home',
      communication: 'Communication',
    };

    return tabTitleMap[tab] || '';
  }
}
