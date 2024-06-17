
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {v4 as uuidv4} from 'uuid';
import * as Papa from 'papaparse';
import { CsvRowData } from 'src/app/form';
@Injectable({
  providedIn: 'root'
})

export class ApiService { 
  public socket:WebSocket;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router  ,
  ) { 
    this.socket = new WebSocket(environment.socket);
    this.socket.binaryType = 'arraybuffer';
  }

  private usedStorage = localStorage;//(this.isLocalStorage())? localStorage:sessionStorage;



  createID32(){
    return uuidv4().replaceAll('-','');
  }
  createID36(){
    return uuidv4();
  }



  parseDate(date:string){
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  }


  
  failedSnackbar(message:string,timer?:number){
    var time = 3000;
    if(timer != undefined){
      time = timer!;
    }
    this.snackBar.open( message, 'Dismiss', {
      duration: time,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'default-snackbar-error'
    })
  }

  successSnackbar(message:string,timer?:number){
    var time = 3000;
    if(timer != undefined){
      time = timer!;
    }
    this.snackBar.open( message, 'Dismiss', {
      duration: time,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'default-snackbar-success'
    })
  }

  justSnackbar(message:string, timer?:number){
    var time = 3000;
    if(timer != undefined){
      time = timer!;
    }
    this.snackBar.open( message, 'Dismiss', {
      duration: time,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'default-snackbar'
    })
  }

  post(method: string, body:{}){
    for (var [key, obj] of Object.entries<any>(body)) {
      if(key == 'values'){
        for (var [field, value] of Object.entries(obj)){
          obj[field]= value ?? '';
        }
      }
    }
    const headers = new HttpHeaders({  'X-Requested-With':'XMLHttpRequest', 'Content-Type':'application/json' });
    const salt = (new Date()).getTime();
    return this.http.post<any>(
      environment.api +"?"+ salt,
      JSON.stringify(
        Object.assign(
          {
            "API_KEY": environment.apiKey,
            "Method" : method
          },
          body
      )),
      { headers }
    )
  }

  socketSend(data:object){
    this.socket.send(JSON.stringify({'key': environment.socketKey, 'data': data}));
  }


  loginAgent(username:string, password:string){
    this.justSnackbar('Loggin in ... ', 9999999);
    return this.post('loginAgent', {
      "Username":  username,
      "Password": password,
    }).subscribe(data=>{
      if(data.success){
        const userdata = data.output;
        userdata.accountType = '1';
        this.usedStorage.setItem('logged_in', '1');
        this.usedStorage.setItem('user_info', JSON.stringify(userdata));
        this.successSnackbar('Log in successful!');
          this.router.navigate(['/tabs/Dashboard']);
  
      }else{
        this.failedSnackbar(data.output);
      }
    });  
  }

  loginAdmin(username:string, password:string){
    this.justSnackbar('logging in ... ', 9999999);
    
    return this.post('loginAdmin', {
      "Email":  username,
      "Password": password,
    }).subscribe(data=>{
      console.log(data);
      if(data.success){
           this.usedStorage.setItem('logged_in', '0');
           const userdata = data.output;
           userdata.accountType = '0';
          this.usedStorage.setItem('user_info', JSON.stringify(userdata));
          this.successSnackbar('Log in successful!')
          this.router.navigate(['/web/manage-form']);
  
      }else{
        this.failedSnackbar(data.output);
      }
    });  
  }


  noProfile(){
    return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
  }


  getURL(file:string){
    return environment.server +'/' + file;
  }

  sendVerification(details:any){
    return this.http.post<any>(environment.nodeserver+'/send-verification-email', 
      { 
        'key': environment.socketKey, 
        'host':details.host, 
        'email' : details.email, 
        'password': details.password,
        'firstname':details.firstname, 
        'lastname':details.lastname,
        'address':details.address,
        'nationality':details.nationality,
        'birthdate':details.birthdate,
        'gender':details.gender
      }
    )
  }

  sendSLA(){
  //   const email
  //   return this.http.post<any>(environment.nodeserver+'/send-verification-email', 
  //   { 
    
  //     'email' : details.email, 
  //   }
  // )
  }
  verifyEmail(token:string){
    return this.http.post<any>(environment.nodeserver+'/verify-email', 
      { 
        'key': environment.socketKey, 
        'token':token, 
      }
    )
  }

  register(details:any){
    const id = this.createID32();
    const postObject = {
      'tables':'students',
      'values':{
        'ID': id,
        'Email':details.email,
        '[hash]Password': details.password,
        'FirstName':details.firstname,
        'LastName':details.lastname,
        'Address':details.address,
        'Nationality':details.nationality,
        'BirthDate':details.birthdate,
        'Gender':details.gender
      },
    }
    return this.post('create_entry', {
      'data': JSON.stringify(postObject),
    });
  }

  checkEmailExists(email:string, domain:string){
    const postObject = {
      'selectors':[
        'ID',
        // 'COUNT(teachers.ID) as B',
        // 'COUNT(administrators.ID) as C',
      ],
      'tables':domain,
      'conditions':{
        // 'LEFT JOIN teachers': 'ON teachers.Email = "'+email+'"',
        // 'LEFT JOIN administrators': 'ON administrators.Email = "'+email+'"',
        'WHERE':{
          '[dot]Email': email
        },
  
      }
    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }




  convertToBase64(audioUrl:string) {
    this.http.get(audioUrl, { responseType: 'blob' })
      .subscribe(
        (blob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            var bbase64 = reader.result as string;
            console.log(bbase64);
          };
          reader.readAsDataURL(blob);
        },
        error => {
          console.error('Error fetching audio:', error);
        }
      );
  }


  uploadFile(file:File,filename:string){
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String =(reader.result as string).split(',')[1];
      this.http.post(environment.nodeserver+'/filehandler', 
      {'key': environment.socketKey,'method':'create_url', 'file_content' : base64String, 'search_key': 'files/'+filename}
      ).subscribe();
    }
    reader.readAsDataURL(file);
  }
  uploadImage(image:File, filename:string){
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String =(reader.result as string).split(',')[1];
      this.http.post(environment.nodeserver+'/filehandler', 
      {'key': environment.socketKey,'method':'create_url', 'file_content' : base64String, 'search_key': 'image_upload/'+filename}
      ).subscribe();
    }
    reader.readAsDataURL(image);
  }
  
  uploadBase64(file:string,name:string){
    const base64String =(file as string).split(',')[1];
    this.http.post(environment.nodeserver+'/filehandler', 
      {'key': environment.socketKey,'method':'create_url', 'file_content' : base64String, 'search_key': name}
      ).subscribe();
  }



  getUserData(){
    const userData = this.usedStorage.getItem('user_info');
    if(userData==null){
      return null;
    }
    return JSON.parse(userData!);
  }

  useLocalStorage(){
    localStorage.setItem('storage', 'local');
  }

  useSessionStorage(){
    localStorage.setItem('storage', 'session');
  }

  isLocalStorage(){
    const storage = localStorage.getItem('storage');
    return storage == 'local';
  }

  isLoggedIn(){
    let loggedIn = this.usedStorage.getItem('logged_in');
    return loggedIn != null;
  }

  getUserType(){
    let userType = this.usedStorage.getItem('logged_in');
    return userType? userType : undefined;
  }


  getMessages(convo:any, seen?:boolean){
    var limitSeen:any = {};
    if(seen!=undefined){
      limitSeen = {
        'f_messages.Seen': false 
      }
    }
    let id = this.getUserData().id;
    var postObject = {};
    if(convo.account =='admin'){
      postObject = {
        'selectors':[
          'f_messages.*',
          'f_admin.Username',
        ],
        'tables':'f_messages',
        'conditions':{
          'LEFT JOIN f_admin':
          `ON ((f_messages.SenderID = '`+convo.id+`' AND f_messages.RecipientID = '`+id+`')
          OR (f_messages.RecipientID = '`+convo.id+`' AND f_messages.SenderID = '`+id+`'))
          `,          
          'WHERE':Object.assign({
            'f_admin.ID' : convo.id
          }, limitSeen),
          'ORDER BY': 'f_messages.Timestamp ASC'
        }
      }
    }else{
      postObject = {
        'selectors':[
          'f_messages.*',
          'f_agents.Username',
        ],
        'tables':'f_messages',
        'conditions':{
          'LEFT JOIN f_agents':
          `ON ((f_messages.SenderID = '`+convo.id+`' AND f_messages.RecipientID = '`+id+`')
          OR (f_messages.RecipientID = '`+convo.id+`' AND f_messages.SenderID = '`+id+`'))
          `, 
          'WHERE':{
            'f_agents.ID' : convo.id
          },
          'ORDER BY': 'f_messages.Timestamp ASC'
        }
      }
    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }

  
  salt:string='';

  sendMessage(message:string, to:string){
    let id = this.getUserData().id;
    let uniqID = this.createID32();
    const postObject = {
      'tables':'f_messages',
      'values':{
        'ID': uniqID,
        'RecipientID': to,
        'SenderID': id,
        'Message': message,
      }
    }
    return this.post('create_entry', {
      'data': JSON.stringify(postObject),
    });
  }

  markSeen(id:string){
    const postObject = {
      'tables':'f_messages',
      'values':{
        'Seen': true,
      },
      'conditions':{
        'WHERE':{
          'ID': id
        },
      }
    }
    this.post('update_entry', {
      'data': JSON.stringify(postObject),
    }).subscribe(data=>{
      // console.log(data);
    });
  }


  returnSuccess(data:any, errorMsg:string){
    if(data.success){
      return data.output;
    }else{
      this.failedSnackbar(errorMsg);
      return new Array<any>;
    }
  }

  loadAgents(){
    let id = this.getUserData().id;
    const postObject = {
      'selectors':[
        'f_agents.ID',
        'Username',
        'Location',
        'Profile',
        'Email',
        'COUNT(f_messages.ID) as inbox',
      ],
      'tables':'f_agents',
      'conditions':{
        'LEFT JOIN f_messages': 
          `ON f_messages.SenderID = f_agents.ID AND f_messages.RecipientID = '`+id+`' AND NOT f_messages.Seen`,
        'GROUP BY': 'f_agents.ID',
      }

    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }

  loadUsers(){
    const postObject = {
      'selectors':[
        'f_agents.*',
    
      ],
      'tables':'f_agents',
    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }

  updateUser(id:string, userid:string, name:string, email:string, location:string,documents?:string){
    const postObject = {
      'tables':'f_agents',
      'values':{
        'Username' : userid,
        'Fullname':name,
        'Email':email,
        'Location':location
      },
      'conditions':{
        'WHERE':{
          'ID': id
        },
      }
    }
    this.post('update_entry', {
      'data': JSON.stringify(postObject),
    }).subscribe(data=>console.log(data));
  }

  createUser(id:string, userid:string, name:string, email:string, location:string,documents?:string){
    const postObject = {
      'tables':'f_agents',
      'values':{
        'ID':id,
        'Username' : userid,
        'Fullname':name,
        '[hash]Password': '1',
        'Email':email,
        'Location':location
      },
    }
    console.log(postObject);
    this.post('create_entry', {
      'data': JSON.stringify(postObject),
    }).subscribe(data=>console.log(data));
  }

  deleteUser(id:string){
    const postObject = {
      'tables':'f_agents',
      'conditions':{
        'WHERE':{
          'ID': id
        },
      }
    }
    this.post('delete_entry', {
      'data': JSON.stringify(postObject),
    }).subscribe();
  }

  loadAdmins(){
    let id = this.getUserData().id;
    const postObject = {
      'selectors':[
        'f_admin.ID',
        'Username',
        'Email',
        'COUNT(f_messages.ID) as inbox'
      ],
      'tables':'f_admin',
      'conditions':{
        'LEFT JOIN f_messages': 
          `ON f_messages.SenderID = f_admin.ID AND f_messages.RecipientID = '`+id+`' AND NOT f_messages.Seen`,
        'GROUP BY': 'f_admin.ID'
        
      }
   
    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }


  logout(){
    if(this.getUserType() =='1'){
      this.usedStorage.clear();
      this.router.navigate(['/login']);
    }else{
      this.usedStorage.clear();
      this.router.navigate(['/web/login']);
    }
  }

  chat:any = null;


  createForm(id:string, search:string){
    const postObject = {
      'tables':'f_forms',
      'values':{
        'ID':id,
        'File' : search,
      },
    }
    return this.post('create_entry', {
      'data': JSON.stringify(postObject),
    });
  }

  updateForm(id:string){
    const postObject = {
      'tables':'f_forms',
      'values':{
        'Timestamp':(new Date).toISOString().slice(0, 19).replace('T', ' '),
      },
      'WHERE':{
        'ID': id,
      }
    }
    return this.post('update_entry', {
      'data': JSON.stringify(postObject),
    });
  }

  deleteForm(id:string){
    const postObject = {
      'tables':'f_forms',
      'conditions':{
        'WHERE':{
          'ID': id,
        }
      }
    }
    return this.post('delete_entry', {
      'data': JSON.stringify(postObject),
    });
  }

  createEntry(type:string, label?:string ,options?:string){

    var _label = '';
    if(label != undefined){
      _label = label;
    }
    var option = {}
    if(options != undefined){
      option = {
        "Options" : options
      }
    }
    const postObject = {
      'tables':'f_formentry',
      'values':Object.assign({
        'Type':type,
        'Label':label,
      },option),
    }
    return this.post('create_entry', {
      'data': JSON.stringify(postObject),
    });
  }

 
  saveDictionary(word:string,dictionary:string){
    return this.post('save_dictionary',{
      'search_key': word,
      'dictionary_json': dictionary
    }).subscribe(data=>{
      console.log(data);
    });
  }

  dictionary(word:string){
    return this.http.get<any>(environment.server+':84'+ "/"+word+".json",{});
  } 
  openChat(id:string,username:string, account:string){
    this.chat = {
      id:id,
      username:username,
      account: account
    };
  }

  getForms(){
    const postObject = {
      'selectors':[
        'f_forms.*',
      ],
      'tables':'f_forms',
    }
    return this.post('get_entries', {
      'data': JSON.stringify(postObject),
    });
  }

  escapeHtml(input:string){
    return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  }
  csvData: any[] = [];
 



  postToDatabase(data: any): Promise<any> {
    const postObject = {
      'tables': 'j_forms',
      'values': data,
    };
  
    console.log("Posting to database:", postObject);
  
    return this.post('create_entry', {
      'data': JSON.stringify(postObject),
    }).toPromise()
    .then(response => {
      console.log("Response from server:", response);
      return response;
    })
    .catch(error => {
      console.error("Error posting to database:", error);

      throw error; 
    });
  }

  parseCsv(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, 
        complete: async (result) => {
          const rows = result.data as CsvRowData[]; 
          const insertPromises = [];
  
          for (let rowData of rows) {
            const data = {
              Task_Number: rowData.Task_Number,
              Service_Group: rowData.Service_Group,
              Service_Type: rowData.Service_Type,
              Task_Priority: rowData.Task_Priority,
              Task_Status: rowData.Task_Status,
              Assignee: rowData.Assignee,
              ppir_assignmentid: rowData.ppir_assignmentid,
              ppir_insuranceid: rowData.ppir_insuranceid,
              ppir_farmername: rowData.ppir_farmername,
              ppir_address: rowData.ppir_address,
              ppir_farmertype: rowData.ppir_farmertype,
              ppir_mobileno: rowData.ppir_mobileno,
              ppir_groupname: rowData.ppir_groupname,
              ppir_groupaddress: rowData.ppir_groupaddress,
              ppir_lendername: rowData.ppir_lendername,
              ppir_lenderaddress: rowData.ppir_lenderaddress,
              ppir_cicno: rowData.ppir_farmloc,
              ppir_farmloc: rowData.ppir_farmloc,
              ppir_north: rowData.ppir_north,
              ppir_south: rowData.ppir_south,
              ppir_east: rowData.ppir_east,
              ppir_west: rowData.ppir_west,
              ppir_att_1: rowData.ppir_att_1,
              ppir_att_2: rowData.ppir_att_2,
              ppir_att_3: rowData.ppir_att_3,
              ppir_att_4: rowData.ppir_att_4,
              ppir_area_aci: rowData.ppir_area_aci,
              ppir_area_act: rowData.ppir_area_act,
              ppir_dopds_aci: rowData.ppir_dopds_aci,
              ppir_dopds_act: rowData.ppir_dopds_act,
              ppir_doptp_aci: rowData.ppir_dopds_aci,
              ppir_doptp_act: rowData.ppir_doptp_act,
              ppir_svp_aci: rowData.ppir_svp_aci,
              ppir_svp_act: rowData.ppir_svp_act,
              ppir_variety: rowData.ppir_variety,
              ppir_stagecrop: rowData.ppir_stagecrop,
              ppir_remarks: rowData.ppir_remarks,
              ppir_name_insured: rowData.ppir_name_insured,
              ppir_name_iuia: rowData.ppir_name_iuia,
              ppir_sig_insured: rowData.ppir_sig_insured,
              ppir_sig_iuia: rowData.ppir_sig_iuia
            };
  
            insertPromises.push(this.postToDatabase(data));
          }
  
          try {
            await Promise.all(insertPromises);
            resolve('Data inserted successfully');
          } catch (error) {
            console.error("Error inserting data:", error);
            reject(error);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          reject(error);
        }
      });
    });
  }
  
  

  /* 
  API TEMPLATE
  
        CREATE TABLE f_admin (
          ID varchar(32) NOT NULL,
          Username varchar(255) NOT NULL,
          Email varchar(100) NOT NULL,
          Password varchar(255) NOT NULL,
          PRIMARY KEY (ID)
        );

  - Refer to this table above

*/


/* I will add a new admin user  */  

createEntryTemplate(){
  // self study what is an object in angular, pero arog kaine format
  // igwa tulo main keys tables, values and conditions.
  /*
    tables - reference kan table na lalagan mo.
    values - pairs kan mga fields na kakagan mo: Field : Value
    conditions - later, wara man sa create entry
  */

  const username = 'lapit';
  const email = 'lapit@gmail.com';
  const password = '123';
  // naka depende ineng id, igwa mga table na incremental lang. If varchar(32) need mo i plug ineng createID32
  const id = this.createID32();

  // kada pair kan object naka separate by comma
  const postObject = {
    'tables':'f_admin', // specify the table name
    'values':{
      'ID' : id,
      'Username':username,
      'Email': email, 
      '[hash]Password': password, // special string ko ang [hash] if need naka hash su value, nagagana lang siya sa pag set ki value, sa inutan ikakaag kan field name
    },
  }

   // Returns an observable check sa exampleRun() kung pano gamiton
  return this.post('create_entry', { // dapat naka laag 'create_entry' if magibo ka entry
    'data': JSON.stringify(postObject),
  });
}

updateEntryTemplate(){
  const username = 'lapitko';
  const email = 'lapit@gmail.com';
  const password = '123';
  const id = this.createID32();
  
  // halos same procedure sa create entry except may conditions na

  /*
    conditions - may shortcut na WHERE
    WHERE - pairs man arog kan value, naka default na FIELD = VALUE
  */
  const postObject = {
    'tables':'f_admin',
    'values':{
      'ID' : id,
      'Username':username,
      'Email': email, 
      '[hash]Password': password,
    },
    'conditions':{
      'WHERE':{
        'ID': id, // meaning kaine ID is equal to <id>
        }
    }
  }
   // Returns an observable check sa exampleRun() kung pano gamiton
  return this.post('update_entry', { // update entry
    'data': JSON.stringify(postObject),
  });
}

getEntriesTemplate(){
  const email = 'pcic324@gmail.com';
  
  // sa get entry wara na 'values' mapalit 'selectors'

  /*
    selectors = mga fields na muya mo i get su values
    conditions = other than WHERE, pwede ka pa mag laag ki other sql conditions such as LIMIT.
  */
  const postObject = {
    'selectors':['f_admin.Username','f_admin.Email', 'f_admin.ID'],
    /*
    pwede mo i default to '*' which means all fields
    'selectors' :['*'],
    */
    'tables':'f_admin', // pwede digdi magdagdag tables separated by comma: tigagamit pag madugtong tables (learn sql)
    'conditions':{
      'WHERE':{
        '[dot]Email': email, // another special string ang [dot] , tigagamit siya if may period ang input such as email, sa conditions lang
        // special character kaya ang dot sa WHERE
        /*
        example:

        'f_admin.Email' : 'f_admin.Username', // tigagamit siya pag duwa na table
 
        */ 

        },
      'LIMIT' : '1', // optional/aditional conditions 
       /*
       pwede maski ano na conditions digdi, ika na bahala kung pano hation 

       'LIMIT 1' : 'ORDER BY f_admin.ID'

       basta naga dugtong lang ine sa sql tas left and right is separated by space (conditions only)

       */

    }
  }
   // Returns an observable check sa exampleRun() kung pano gamiton
  return this.post('get_entries', { // get entry
    'data': JSON.stringify(postObject),
  });
}

deleteEntryTemplate (){
  const email = 'daenagaexisst';

  // same man lang siya before except wara na selectors tas values
  const postObject = {
    'tables':'f_admin',
    'conditions':{
    'WHERE':{
      '[dot]Email': email,
      },
    }
  }

  // Returns an observable check sa exampleRun() kung pano gamiton
  return this.post('delete_entry', { // delete entry
    'data': JSON.stringify(postObject),
  });
}


// ALL THESE ARE RETURNING AN OBSERVABLE

exampleRun(){
  // since observable siya need ka mag subscribe, laag mo sa to close para wara data leak

  // ine lang sa create, update, delete
  const toCloseLang$ = this.createEntryTemplate().subscribe(()=> {toCloseLang$.unsubscribe()});
  
  // ine sa get entries
  const toClose$ =  this.getEntriesTemplate().subscribe(data=>{
    // data is yung response sa API ko
    console.log(data);
    // naka object man siya, na duwa ang output, status tas output
    // saro is data.success, true or false, pero dae na kan success ta dae man reliable

    // output nalng
    console.log(data.output);

    // su output pirmi array so need mo i check if may laog
    if(data.output.length > 0){
      // you have data from database
      
      // pwede ka mag for loop
      for(let entry of data.output){
        console.log(entry);
        // object giraray ineng entry, kaya pwede mo ma access su fields, all small letters dapat ang field
        console.log(entry.username);
      }

      // if saro lang talga pwede ine, since array
      const user = data.output[0];
      console.log(user.username);

    }
    

    // sa pinaka last close mo su subscription

    toClose$.unsubscribe();

  })

}













}
