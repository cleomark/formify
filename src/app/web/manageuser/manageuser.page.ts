// manageuser.page.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoAdduserComponent } from 'src/app/components/geo-adduser/geo-adduser.component';
import { GeolocateComponent } from 'src/app/components/geolocate/geolocate.component';
import { ApiService } from 'src/app/services/api/api.service';
import * as Papa from 'papaparse';
@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.page.html',
  styleUrls: ['./manageuser.page.scss'],
})
export class ManageuserPage implements OnInit {
  constructor(private modalCtrl: ModalController, private cdr: ChangeDetectorRef, private API:ApiService) {}

  sortField: string = 'id';
  sortOrder: string = 'asc';


  csvData: any[] = [];
 objectKeys = Object.keys;

 onFileChange(event: any) {
  const file = event.target.files[0];
  this.API.parseCsv(file).then(data => {
    this.csvData = data;
    console.log('Parsed:', data);
  }).catch(error => console.error('Error parsing CSV:', error));
}




  addUserHandler(user: any) {
    user.documents = user.file ? user.file.name : 'No documents';
    user.ref = this.API.createID32();
    this.users.push(user);
    this.filteredUsers = [...this.users];
    this.cdr.detectChanges();
    this.API.createUser(user.ref,user.id,user.fullname,user.email, user.location);
    
  }

  editUserHandler(updatedUser: any) {
    const index = this.users.findIndex((user:any) => user.id === updatedUser.id);

    if (index !== -1) {
      this.users[index] = updatedUser;
      this.filteredUsers = [...this.users];
      this.cdr.detectChanges();
    
    }
  }

  async openAdduser() {
    const modal = await this.modalCtrl.create({
      component: GeoAdduserComponent,
    });

    modal.onWillDismiss().then((result) => {
      if (result.data) {
        this.addUserHandler(result.data);
      }
    });

    modal.present();
  }

  async openEditUserModal(user: any) {
    const modal = await this.modalCtrl.create({
      component: GeoAdduserComponent,
      componentProps: {
        userData: user,
      },
    });

    modal.onWillDismiss().then((result) => {
      if (result.data) {
        const updatedUser = result.data
        const index = this.users.findIndex((u:any) => u.id === user.id);
        
        const ref = this.users[index].ref;
        this.users[index] = result.data;
        this.users[index].documents = this.users[index].file ? this.users[index].file.name : 'No Documents';
        this.API.updateUser(ref,updatedUser.id,updatedUser.fullname,updatedUser.email, updatedUser.location);
        this.filteredUsers = [...this.users];
        this.cdr.detectChanges();
      }
    });

    modal.present();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: GeolocateComponent,
    });
    modal.present();
  }

  users:any = [
    // { id: '9812', fullname: 'Agent hejwbe', email: 'user@example.com', location: 'City, Country', documents: 'Document 1, Document 2' },
    // { id: '1389', fullname: 'wgverg jeheh', email: 'user@example.com', location: 'City, Country', documents: 'Document 1, Document 2' },
    // { id: '3913', fullname: 'kwekd hejwe', email: 'user@example.com', location: 'City, Country', documents: 'Document 1, Document 2' },
  ];

  filteredUsers: any[] = [];

  ngOnInit() {
    this.API.loadUsers().subscribe(data=>{
      for(let user of data.output){
        this.users.push({
          ref:user.id,
          id: user.username,
          fullname: user.fullname,
          email: user.email,
          location: user.location,
          documents: user.documents
        })
      }
      this.filteredUsers = [...this.users];
    })
  }

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers = searchTerm
      ? this.users.filter((user:any) => user.fullname.toLowerCase().includes(searchTerm))
      : this.users;
  }

  loadModalContent() {
    // Load modal content logic here
  }

  deleteUser(user: any) {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.filteredUsers = [...this.users];
      this.API.deleteUser(user.ref);
      this.cdr.detectChanges();
    }
  }

  // Updated sorting method
  sortUsers() {
    this.filteredUsers.sort((a, b) => {
      const valueA = this.getValue(a);
      const valueB = this.getValue(b);

      if (this.sortOrder === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }

  // Helper function to get the value for sorting
  private getValue(user: any): any {
    return this.sortField === 'id' ? parseInt(user[this.sortField], 10) : user[this.sortField].toLowerCase();
  }
}
