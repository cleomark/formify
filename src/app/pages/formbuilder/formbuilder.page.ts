import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalComponent } from '../modals/modal/modal.component';
import { ApiService } from 'src/app/services/api/api.service';
import { last, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';

interface toolbarItem{
  name: string;
  icon:string;
  function: Function;
}

interface element {
  id:string;
  order:number;
  parent:string;
  content?:string;
  fields?:number;
  options?:Map<string,any>;
  settings?:Array<string>;
}

@Component({
  selector: 'app-formbuilder',
  templateUrl: './formbuilder.page.html',
  styleUrls: ['./formbuilder.page.scss'],
})
export class FormbuilderPage implements OnInit{
  currentSelector:string = 'page1';

  counters: any = {
    text: 0,
    textfield:0,
    checkbox:0,
    farmtable:0,
    farmtableentry:0,
    imagefield:0,
    signaturefield:0,
    group:0,
    row:0,
    column:0,
    divider:0,

  }
  tab:number = 0;
  contentField:string = '';

  elements:Map<string,element> = new Map();

  styles = ['font-bold', 'italic', 'underline'];
  alignments = ['justify-start','justify-center', 'justify-end'];
  formats =['flex-row','flex-col-reverse'];
  formats2 = ['horizontal-options', 'vertical-options']

  loaded:boolean = false;
  form:any;
  id:any;
  newform:boolean = true;

  ngOnInit(): void {
    this.gridEnabled = true;
    this.form =  this.route.snapshot.paramMap.get('f');
    this.id =  this.route.snapshot.paramMap.get('u');
    if(this.form!=null){
      this.newform = false;
      this.API.dictionary(this.route.snapshot.paramMap.get('f')!).subscribe(data=>{
        var elements:any = new Map(Object.entries(data));
        elements.forEach((value:any,key:any)=>{
          if(value.options!=null){
            elements.get(key).options = new Map(Object.entries(value.options));
          }
        })
        console.log(elements);
  
        this.elements = new Map(elements);
        this.loadElements(elements);
        this.currentSelector='page1';
        this.loaded = true;
      })
    }else{
      // if(localStorage.getItem('form') !=null){
      //   var elements:any = new Map(Object.entries(JSON.parse(localStorage.getItem('form')!)));
      //   localStorage.removeItem('form');
      //   elements.forEach((value:any,key:any)=>{
      //     if(value.options!=null){
      //       elements.get(key).options = new Map(Object.entries(value.options));
      //     }
      //   })
      //   console.log(elements);
  
      //   this.elements = new Map(elements);
      //   this.loadElements(elements);
      //   this.currentSelector='page1';
      // }
      this.loaded = true;
    }

    
  }

  loadElements(elements:Map<string, any>){
    elements.forEach((value,key)=>{
      switch(this.getKey(key)){
        case 'text':
          if(this.counters.text <  Number(key.split('-')[1])) this.counters.text =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createText(value.parent, value.id,value.content,value.settings)
            elements.delete(key);
          }
          break;
        case 'textfield':
          if(this.counters.textfield <  Number(key.split('-')[1])) this.counters.textfield =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createTextField(value.parent, value.id,value.content,value.settings)
            elements.delete(key);
          }
          break;
        case 'checkbox':
          if(this.counters.checkbox <  Number(key.split('-')[1])) this.counters.checkbox =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createCheckbox(value.parent, value.id,value.content,value.options,value.settings)
            elements.delete(key);
          }
          break;
        case 'farmtable':
          if(!this.isChild(key)){
            if(this.counters.farmtable <  Number(key.split('-')[1])) this.counters.farmtable =  Number(key.split('-')[1]);
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.createFarmTable(value.parent, value.id,value.fields,value.settings)
              elements.delete(key);
            }
          }else{
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.addEntry(value.parent, value.id,value.content, value.settings)
              elements.delete(key);
            }
          }
          break;

        case 'imagefield':
          if(this.counters.imagefield <  Number(key.split('-')[1])) this.counters.imagefield =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createImageField(value.parent, value.id,value.settings)
            elements.delete(key);
          }
        break;

        case 'signaturefield':
          if(this.counters.signaturefield <  Number(key.split('-')[1])) this.counters.signaturefield =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createSignatureField(value.parent, value.id,value.content,value.settings)
            elements.delete(key);
          }
        break;

        case 'group':
          if(this.counters.group <  Number(key.split('-')[1])) this.counters.group =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createGroup(value.parent, value.id,value.settings)
            elements.delete(key);
          }
        break;

        case 'column':
          if(!this.isChild(key)){
            if(this.counters.column <  Number(key.split('-')[1])) this.counters.column =  Number(key.split('-')[1]);
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.createColumn(value.parent, value.id,value.fields,value.settings)
              elements.delete(key);
            }
          }else{
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.addField(value.parent, value.id, value.settings)
                elements.delete(key);
            }
          }
        break;

        case 'row':
          if(!this.isChild(key)){
            if(this.counters.row <  Number(key.split('-')[1])) this.counters.row =  Number(key.split('-')[1]);
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.createRow(value.parent, value.id,value.fields,value.settings)
              elements.delete(key);
            }
          }else{
            if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
              this.addField(value.parent, value.id, value.settings)
                elements.delete(key);
            }
          }
          
        break;

        case 'divider':
          if(this.counters.divider <  Number(key.split('-')[1])) this.counters.divider =  Number(key.split('-')[1]);
          if(this.el.nativeElement.querySelector('#'+value.parent)!=null){
            this.createDivider(value.parent, value.id,value.settings)
            elements.delete(key);
          }
        break;
      }
    })
    if(elements.size > 0){
      this.loadElements(elements);
    }
  }

  createText(parent:string, id:string, value?:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const div = this.createFieldElement(id);
    this.addClass(div, 'label');
   
    this.addClass(div, 'text-wrap');
    this.setValue(div, 'Test Header');
    if(value!=undefined){
      this.setValue(div,value);
    }
    const targetElement = this.el.nativeElement.querySelector('#' + parent) as HTMLElement;
    this.insert(targetElement, div);

    this.currentSelector = id;
    
    this.styles.forEach(style=>{
      if(_settings.includes(style)){
        this.toggleStyle(style, 'no-push' )
      }
    })

    for(let i = 0 ; i< this.alignments.length; i++){
      if(_settings.includes(this.alignments[i])){
        this.selectStyle(this.alignments,i);
      }
    }
    return [targetElement,div];
  }

  createTextField(parent:string, id:string, value?:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    const label = this.createElement('label whitespace-nowrap');
    this.setValue(label, 'Label: ');
    if(value!=undefined){
      this.setValue(label,value);
    }
    const container = this.createElement('w-full min-h-6 px-2');
    const line = this.createElement('w-full mt-5 border-b-solid border-b-[1px]  border-black');
    
    this.insert(field, label);
    this.insert(container, line);
    this.insert(field, container);
    
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);

    this.currentSelector = id;
    
    this.styles.forEach(style=>{
      if(_settings.includes(style)){
        this.toggleStyle(style,'nopush')
      }
    })

    for(let i = 0 ; i< this.formats.length; i++){
      if(_settings.includes(this.formats[i])){
        this.selectStyle(this.formats,i);
      }
    }
    return [targetElement,field,label];
  }

  createCheckbox(parent:string, id:string, value?:string, options?:Map<string, any>, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.removeClass(field,'items-center');
    // this.addClass(field, 'mt-2')
    const label = this.createElement('label mt-1 whitespace-nowrap mr-2 pointer-events-none');
    this.setValue(label, 'Label:');
    if(value !=undefined){
      this.setValue(label, value)
    }
    const container = this.createElement('options w-full h-full px-2 flex justify-between pointer-events-none  flex-wrap');
    this.insert(field, label);
    var _options:Map<string, string> = new Map();
    if(options == undefined){
      var count = 2;
      for(let i = 0; i < count; i++){
        const single = this.createElement('flex flex-1 mt-0.5 items-center align-center')
        const box = this.createElement('w-6 h-6 border-solid border-[1px] border-black');
        const option = this.createElement('option ml-2 whitespace-nowrap mr-2');
        this.setValue(option, 'Option ' + (i+1).toString());
        this.renderer.setAttribute(option,'id',id+'-opt-'+i.toString())
        
        _options.set(option.id , option.innerHTML);
        
        this.insert(single, box);
        this.insert(single, option);
        this.insert(container, single);
      }
    }else{
      _options = options
      options.forEach((value,key)=>{
        const single = this.createElement('flex flex-1 mt-0.5 items-center align-center')
        const box = this.createElement('w-6 h-6 border-solid border-[1px] border-black');
        const option = this.createElement('option ml-2 whitespace-nowrap mr-2');
        this.setValue(option, value);
        this.renderer.setAttribute(option,'id',key)
        
        this.insert(single, box);
        this.insert(single, option);
        this.insert(container, single);
      })  
    }
    this.insert(field, container);
    const targetElement = this.el.nativeElement.querySelector('#' +parent);
    this.insert(targetElement, field);

    this.currentSelector = id;
    
    this.styles.forEach(style=>{
      if(_settings.includes(style)){
        this.toggleStyle(style,'nopush')
      }
    })

    for(let i = 0 ; i< this.formats2.length; i++){
      if(_settings.includes(this.formats2[i])){
        this.selectStyle(this.formats2,i);
      }
    }
    return [targetElement,field,label, _options];
  }

  createFarmTable(parent:string, id:string,fields?:number, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    const table = this.createFieldTable(id);
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    var row = null;
    const body = table.querySelector('tbody');
    if(fields ==undefined){
      row = this.createFieldRow(['','','','']) as HTMLElement;
      row.querySelector('td div')?.classList.remove('justify-evenly')
      row.querySelector('td div')?.classList.add('pl-5')
      this.renderer.setAttribute(row, 'id', id+'-0');
      this.insert(body,row);
    }

    this.insert(field,table);
    
    this.insert(targetElement, field);

    this.currentSelector = id;
    
    this.styles.forEach(style=>{
      if(_settings.includes(style)){
        this.toggleStyle(style,'nopush')
      }
    })

    for(let i = 0 ; i< this.alignments.length; i++){
      if(_settings.includes(this.alignments[i])){
        this.selectStyle(this.alignments,i);
      }
    }
    return [targetElement,field,row,table,body];
  }

  createImageField(parent:string, id:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.addClass(field, 'justify-center');
    this.addClass(field, 'items-center');
    this.addClass(field, 'flex-col');
    const container = this.createElement('mt-2 w-36 h-36 border-solid border-[1px] flex flex-col justify-center items-center p-5  border-black');
    const text = this.createElement('!leading-4 text-center');
    this.setValue(text, 'ID picture taken within the last  6 months');
    this.insert(container,text);
    const text2 = this.createElement('!leading-4 text-center');
    this.setValue(text2, '( 2 X 2 )');
    this.insert(container,text2);
    const label = this.createElement('mt-2 whitespace-nowrap');
    this.setValue(label, 'PHOTO');
    this.insert(field, container);
    this.insert(field, label);
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);

    return [targetElement,field];
  }

  createSignatureField(parent:string, id:string, value?:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.addClass(field, 'justify-center');
    this.addClass(field, 'pb-2');
    this.addClass(field, 'items-center');
    this.addClass(field, 'flex-col');
    const container = this.createElement('w-full h-8 border-b-solid border-b-[1px] flex flex-col justify-center items-center border-black');
    this.insert(field, container);
    const label = this.createElement('mt-2 whitespace-nowrap');
    this.setValue(label, 'Signature Over Printed Name');
    this.insert(field, label);
    const subject = this.createElement('label whitespace-nowrap');
    this.setValue(subject, "Signatory's Title");
    if(value!=undefined){
      this.setValue(subject, value);
    }
    this.insert(field, subject);
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);

    return [targetElement,field];
  }

  createGroup(parent:string, id:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.addClass(field,'container');
    this.addClass(field,'py-1');
    const container = this.createElement('border-[1px] border-solid w-full border-black min-h-12 p-3');
    this.renderer.removeClass(container,'pointer-events-none');
    this.insert(field, container)
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);

    return [targetElement,field];
  }

  createColumn(parent:string, id:string,fields?:number, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.removeClass(field, 'items-center');
    if(fields == undefined){
      const count = 2;
      for(let i = 0; i < count; i++){
        const container = this.createFieldElement(id+'-'+i.toString());
        this.removeClass(container, 'justify-center');
        this.addClass(container,'container');
        this.addClass(container,'flex-col');
        this.addClass(container,'!py-0');
        this.insert(field, container);
        this.elements.set(container.id, {
          id:container.id,
          order: field.children.length - 1,
          parent:field.id,
          settings : ['justify-start'],
        })
      }
    }
    
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);


    return [targetElement,field];
  }

  createRow(parent:string, id:string,fields?:number, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.addClass(field, 'flex-col');
    if(fields == undefined){
      const count = 2;
      for(let i = 0; i < count; i++){
        const container = this.createFieldElement(id+'-'+i.toString());
        this.addClass(container,'container');
        this.addClass(container,'flex-col');
        this.addClass(container,'!py-0');
        this.insert(field, container);
        this.elements.set(container.id, {
          id:container.id,
          order: field.children.length - 1,
          parent:field.id,
          settings : [],
        })
      }
      
    }
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);


    return [targetElement,field];
  }

  createDivider(parent:string, id:string, settings?:Array<string>){
    var _settings:string[] = [];
    if(settings != undefined){
      _settings = settings;
    }
    const field = this.createFieldElement(id);
    this.addClass(field, 'mt-1')
    this.addClass(field, 'mb-1')
    this.renderer.removeClass(field, 'min-h-6');
    const line = this.createElement('w-full h-[1px] bg-black');
    this.insert(field,line)
    const targetElement = this.el.nativeElement.querySelector('#' + parent);
    this.insert(targetElement, field);


    return [targetElement,field];
  }
  
  
  
  toolbarItems: Array<toolbarItem> = [
    {
      name: 'Text',
      icon: 'bx bx-list-minus',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.text += 1 ;
        const id= 'text-'+this.counters.text.toString()
        const parent = this.currentSelector;
        const [targetElement,div] = this.createText(this.currentSelector, id);
        this.select(div);

        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          content: div.innerHTML,
          parent:parent,
          settings : ['justify-center'],
        })
        this.save();
      }
    },
    {
      name: 'Text Field',
      icon: 'bx bx-notepad',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.textfield += 1 ;
        const id= 'textfield-'+this.counters.textfield.toString()
        const parent = this.currentSelector;
        const [targetElement,field,label] = this.createTextField(this.currentSelector,id)

        this.select(field);

        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          content: label.innerHTML,
          parent: parent,
          settings : ['flex-row'],
        })
        this.save();
      }
    },
    {
      name: 'Checkbox',
      icon: 'bx bxs-check-square',
      function: ()=>{
        // const vertical = true;
        const count = 2;
        if(!this.isContainer()) return;
        this.counters.checkbox += 1 ;
        const id= 'checkbox-'+this.counters.checkbox.toString()
        const parent = this.currentSelector;
        const [targetElement,field,label,options] = this.createCheckbox(this.currentSelector, id);

        this.select(field);

        this.elements.set(id, {
          id:id,
          content: label.innerHTML,
          order: targetElement.children.length - 1,
          parent:parent,
          options: options,
          settings : ['horizontal-options'],
        })
        this.save();
      }
    },
    {
      name: 'Farm Table',
      icon: 'bx bx-table',
      function: ()=>{
        if(!this.isContainer()) return;
       
        this.counters.farmtable += 1 ;
        const id= 'farmtable-'+this.counters.farmtable.toString();
        const parent = this.currentSelector;
        const [targetElement,field,row, table,body] = this.createFarmTable(this.currentSelector, id);

        this.insert(field,table);
        
        this.insert(targetElement, field);

        this.select(field);

        this.elements.set(row.id, {
          id:row.id,
          content:'',
          order: body.children.length - 1,
          parent:field.id,
          settings : [],
        })

        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          fields:1,
          settings : [],
        })
        this.save();
      }
    },
    {
      name: 'Image Field',
      icon: 'bx bx-image-alt',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.imagefield += 1 ;
        const parent = this.currentSelector;
        const id= 'imagefield-'+this.counters.imagefield.toString()
        const [targetElement,field] = this.createImageField(this.currentSelector, id);

        this.select(field);

        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          settings : [],
        })
        this.save();
      }
    },
    {
      name: 'Signature Field',
      icon: 'bx bxs-pen',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.signaturefield += 1 ;
        const parent = this.currentSelector;
        const id= 'signaturefield-'+this.counters.signaturefield.toString()
        const [targetElement,field] = this.createSignatureField(this.currentSelector, id);

        this.select(field);

        this.elements.set(id, {
          id:id,
          content: "Signatory's Title",
          order: targetElement.children.length - 1,
          parent:parent,
          settings : [],
        })
        this.save();
      }
    },
    // DIVIDER
    {
      name:'',
      icon:'',
      function: ()=>{
        if(!this.isContainer()) return;
      }
    },
    // DIVIDER
    {
      name: 'Group',
      icon: 'bx bx-grid-alt',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.group += 1 ;
        const id= 'group-'+this.counters.group.toString()
        const parent = this.currentSelector;
        const [targetElement,field] = this.createGroup(this.currentSelector, id);

        this.select(field);
        
        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          settings : [],
        })
        this.save();
      }
    },
    {
      name: 'Column',
      icon: 'bx bx-dock-left',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.column += 1 
        const parent = this.currentSelector;
        const id= 'column-'+this.counters.column.toString()
        const [targetElement,field] = this.createColumn(this.currentSelector, id);
        this.select(field);
        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          fields: 2,
          settings : ['justify-start'],
        })
        this.save();
      }
    },
    {
      name: 'Row',
      icon: 'bx bx-dock-top',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.row += 1 ;
        const id= 'row-'+this.counters.row.toString()
        const parent = this.currentSelector;
        const [targetElement,field] = this.createRow(this.currentSelector, id);

        this.select(field);
        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          fields: 2,
          settings : [],
        })
        this.save();
      }
    },
    {
      name: 'Divider',
      icon: 'bx bx-minus',
      function: ()=>{
        if(!this.isContainer()) return;
        this.counters.divider += 1 ;
        const id= 'divider-'+this.counters.divider.toString()
        const parent = this.currentSelector;
        const [targetElement,field] = this.createDivider(this.currentSelector, id);

        this.select(field);

        this.elements.set(id, {
          id:id,
          order: targetElement.children.length - 1,
          parent:parent,
          settings : [],
        })
        this.save();
      }
    },
  ];

  drag(ev:any) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('holding');
  }
  

  drop(ev:any) {
    ev.preventDefault();
   if(this.getKey(this.getParent(ev.target).id) == 'farmtable'){
      this.getMainField(ev.target).classList.remove('drag-hover')
   }else{
      this.getParent(ev.target).classList.remove('drag-hover');
   }
    var data = ev.dataTransfer.getData("text");
    document.getElementById(data)!.classList.remove('holding');
    var main  = this.getParent(ev.target);
    // if(this.getKey(main.id) =='farmtable'){
    //   main = this.getMainField(main);
    // }
    if(!main.classList.contains('container')){
      var parent = ev.target.parentElement as HTMLElement;
      var sibling = ev.target;
      if(this.getKey(main.id) == 'farmtable'){
        parent = this.getMainField(sibling).parentElement as HTMLElement;
        sibling = this.getMainField(sibling);
      }
      
    // const children =Array.from(parent.children);
      parent.insertBefore(document.getElementById(data)!, sibling)

      if(this.elements.get(data)!.order +1 != this.elements.get(sibling.id)!.order ){
        // this.elements.get(data)!.order = this.elements.get(sibling.id)!.order;
        // update order of siblings
        for(let i = 0; i < parent.children.length; i++){
            this.elements.get(parent.children[i].id)!.order =  i;
        }
        this.save();
      }
     
      return;
    }else{
      switch(this.getKey(main.id)){
        case "group":
          if(this.getParent(ev.target).id == data) return;
          if(ev.target.id.trim() != ''){
            if(document.getElementById(data)!.querySelector('#' +ev.target.id) != null) return;
          }
          main.querySelector("div").appendChild(document.getElementById(data));
          this.elements.get(document.getElementById(data)!.id)!.parent = main.id;
          break;
        case 'row':
        case 'column':
          if(document.getElementById(data)!.querySelector('#'+ev.target.id) != null) return;
          ev.target.appendChild(document.getElementById(data));
          this.elements.get(document.getElementById(data)!.id)!.parent = ev.target.id;
          break;
        default:
          if(main.id.includes('page')){
            ev.target.appendChild(document.getElementById(data));
            this.elements.get(document.getElementById(data)!.id)!.parent = ev.target.id;
            
          }
          break;
      }
      // update order of siblings
      const parent =document.getElementById(data)!.parentElement!;
      for(let i = 0; i < parent.children.length; i++){
          this.elements.get(parent.children[i].id)!.order =  i;
      }
    
      this.save();
    }
   
  }

  allowDrop(ev:any){
    ev.preventDefault();
  }

  dragEnter(ev:any){
    const prev =  document.querySelector('.drag-hover');
    if(prev != null){
      prev.classList.remove('drag-hover');
    }
    var target = this.getParent(ev.target);
    if(this.getKey(target.id)=='farmtable'){
      target =  this.getMainField(target);
    }
    target.classList.add('drag-hover');
  }
  dragLeave(ev:any){
    // var target = ev.target;
    // if(this.getKey(target.id)=='farmtable' && this.isChild(target.id) || target.id == ''){
    //   return;
    // }
    
  }

  dragEnd(ev:any){
    ev.preventDefault();
    const prev =  document.querySelector('.drag-hover');
    if(prev != null){
      prev.classList.remove('drag-hover');
    }
    ev.target.classList.remove('holding');
  }
  

  createFieldElement(id:string){
    const div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'id', id);
    this.renderer.listen(div, 'drop', (event) => this.drop(event))
    this.renderer.listen(div, 'dragover', (event) => this.allowDrop(event));
    
    this.renderer.setProperty(div, 'innerText', '');
    this.renderer.setAttribute(div,'class', 'field selection will-change-transform min-h-6 select-none bg-white cursor-pointer w-full hover:bg-gray-50 py-0 border-dotted border-2 border-sky-200 hover:border-blue-600 flex rounded justify-center items-center text-black');
    
    if(this.isChild(id)){
      return div;
    }
    
    this.renderer.setAttribute(div, 'draggable', 'true');
    this.renderer.listen(div, 'dragstart', (event) =>  this.drag(event))
    this.renderer.listen(div, 'dragenter', (event) => this.dragEnter(event))
    this.renderer.listen(div, 'dragend', (event) => this.dragEnd(event))
  
    
    return div;
  }

  createFieldTable(id:string){
    const table = this.renderer.createElement('table');
    this.renderer.setAttribute(table, 'class','mt-1 w-full will-change-transform min-h-6 border-collapse border  table-fixed border-black border-1')
    const head = this.renderer.createElement('thead');
    const row1 = this.createFieldRow([
      '<b>Particulars</b>', 
      `
        <div class="mr-2">Farm I.D</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div class="mr-2">Lot 1</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div>ha.</div>
      `,
      `
        <div class="mr-2">Farm I.D</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div class="mr-2">Lot 1</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div>ha.</div>
      `,
      `
        <div class="mr-2">Farm I.D</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div class="mr-2">Lot 1</div><div class="border-b-[1px] flex-1 mt-3 border-solid border-black"></div>
        <div>ha.</div>
      `,]);
    this.insert(head,row1);
    const body = this.renderer.createElement('tbody');
    // const row2 = this.createFieldRow(['','','','']) as HTMLElement;
    // row2.querySelector('td div')?.classList.remove('justify-evenly')
    // row2.querySelector('td div')?.classList.add('pl-5')
    // this.renderer.setAttribute(row2, 'id', id+'-0');
    // this.insert(body,row2);
    this.insert(table, head);
    this.insert(table, body);
    return table;
  }
  createFieldRow(row:Array<any>){
    const tr = this.renderer.createElement('tr');
    this.renderer.setAttribute(tr, 'class', 'selection');
    for(let i = 0; i < row.length; i++){
      const td = this.renderer.createElement('td');
      this.renderer.setAttribute(td, 'class', 'p-0 px-2 border will-change-transform border-black border-1 break-words ');
      
      const div = this.renderer.createElement('div') as HTMLElement;
      div.insertAdjacentHTML('beforeend',row[i]);
      this.renderer.setAttribute(div, 'class','select-none pointer-events-none min-h-6  overflow-hidden will-change-transform flex items-center justify-evenly break-words text-wrap px-2');
      if(i==0){
        this.addClass(div, 'label');
        this.addClass(td, 'w-48');
      }
      this.insert(td, div);
      this.insert(tr, td);
    }
    return tr;
  }

  createElement(style:string){
    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div,'class','will-change-transform pointer-events-none ' + style );
    return div;
  }

  getKey(id:string){
    return id.split('-')[0];
  }
  
  currentHas(key:string){
    return (this.currentSelector.split('-')[0] ==key)  
    
  }

  currentIsChild(){
    return (this.currentSelector.split('-').length > 2)
  }
  isChild(id:string){
    return (id.split('-').length > 2)
  }

  isPage(){
    if(this.currentSelector.includes('page'))  return true;
    return false;
  }

  setValue(target:any,value:string){
    this.renderer.setProperty(target, 'innerText', value);
  }

  insert(target:any, src:any){
    if(this.elements.has(src.id)){
      const index = this.elements.get(src.id)!.order;

      var parent = target;
      if(target.id.includes('group') && target.querySelector('div') != null){
        parent = target.querySelector('div')
      }
      var children = parent.children;
      var lastchild = null;
      for(let i = 0; i < children.length; i++){
        if(this.elements.get(children[i].id)!.order >= index){
          lastchild = children[i];
          break;
        }
      }
      if(lastchild == null){
        this.renderer.appendChild(parent,src);
        return;
      }
      this.renderer.insertBefore(parent, src,lastchild)

    }else{
      if(target.id.includes('group') && target.querySelector('div') != null){
        this.renderer.appendChild(target.querySelector('div'),src);
      }else{
        this.renderer.appendChild(target,src);
      }
    }
    
  }

  addClass(target:any, cls:string){
    this.renderer.addClass(target,cls);
  }

  removeClass(target:any, cls:string){
    this.renderer.removeClass(target,cls);
  }
  isContainer(){
    if(this.el.nativeElement.querySelector('#' + this.currentSelector).classList.contains('container')) return true
    // alert('This field cannot contain another element.');
    return false;
  }

  toolkey(name:string){
    return name.replaceAll(" ", '').toLowerCase();
  }
  
  options:Map<string,any>=new Map();
  fieldCount: number = 0;
  select(target:any){
    const selected = this.el.nativeElement.querySelector('.selected');
    if(selected){
      selected.classList.remove('selected');
    }
    this.tagParent(target);
   

    var form_label =this.el.nativeElement.querySelector('#'+this.currentSelector);
    if(form_label.classList.contains('label')){
      this.contentField = form_label.innerHTML.replaceAll('&nbsp;', ' ');
    }else{
      form_label = form_label.querySelector('.label');
      if(form_label !=null){
        this.contentField = form_label.innerHTML.replaceAll('&nbsp;', ' ');
      }
    }
   

    if(this.currentSelector.includes('checkbox')){
      this.options.clear();
     
      this.el.nativeElement.querySelectorAll('#'+this.currentSelector +' .options  .option').forEach((option:HTMLElement)=>{
        this.options.set(option.id,{
          id: option.id,
          text: option.innerHTML
        })
      })      
    }

    if(this.currentSelector.includes('row') || this.currentSelector.includes('column')){
      this.fieldCount =  this.el.nativeElement.querySelectorAll('#'+this.currentSelector +' > div').length;
    }


    if(this.currentSelector.includes('farmtable')){
      this.fieldCount =  this.el.nativeElement.querySelectorAll('#'+this.currentSelector +' tbody > tr').length;
    }

    if(this.currentSelector.includes('page')) return;
    this.switchTab(1);
  }

  tagParent(target:any){
    if(target.id.trim() !=''){
      if(target.classList.contains('selection')) 
        target.classList.add('selected');
      this.currentSelector = target.id;
      return;
    }
    this.tagParent(target.parentElement);
   
  }

  getParent(target:any) : any{
    if(target.id.trim() !=''){
      return target;
    }
    return this.getParent(target.parentElement);
  }

  getMainField(target:any) : any{
    if(target.id.trim() !=''&& !this.isChild(target.id)){
      return target;
    }
    return this.getMainField(target.parentElement);
  }

  
  checkSettings(style:string){
    return this.elements.get(this.currentSelector)!.settings!.includes(style);
  }

  toggleStyle(style:string, mode?:string){
    var label = this.el.nativeElement.querySelector('#'+this.currentSelector);
    if(!label.classList.contains('label')){
      label = label.querySelector('.label');
    }  
    if(label.classList.contains(style)){
      label.classList.remove(style);
     if(mode==undefined){
      const index = this.elements.get(this.currentSelector)!.settings!.indexOf(style);
      if(index > -1){
        this.elements.get(this.currentSelector)!.settings!.splice(index,1);
      }
     }
    }else{
      label.classList.add(style);
      if(mode==undefined){
        this.elements.get(this.currentSelector)!.settings!.push(style);
      }
    }
    this.save();
  }

  selectStyle(list:Array<string>, style:number){
  
    var label = this.el.nativeElement.querySelector('#'+this.currentSelector);
    list.forEach(item=>{
      label.classList.remove(item);
      const index = this.elements.get(this.currentSelector)!.settings!.indexOf(item);
      if(index > -1){
        this.elements.get(this.currentSelector)!.settings!.splice(index,1);
      }
    })
    label.classList.add(list[style]);
    this.elements.get(this.currentSelector)!.settings!.push(list[style])
    this.save();
  }

  addOption(){
    const container = this.el.nativeElement.querySelector('#'+this.currentSelector +' .options') as HTMLElement;
    const single = this.createElement('flex flex-1 items-center align-center mt-0.5')
    const id = container.parentElement?.id; 
    const box = this.createElement('w-7 h-7 border-solid border-[1px] border-black');
    const option = this.createElement('option ml-2 whitespace-nowrap mr-2');
    var index = 0;
    if(container.children.length > 0){
      index = Number(container.children[container.children.length-1].querySelector('.option')!.id.replace(id+'-opt-','')) + 1;
    }
  
    this.setValue(option, 'Option ' + (index+1).toString());
    this.renderer.setAttribute(option,'id',id+'-opt-'+(index).toString())
    this.insert(single, box);
    this.insert(single, option);
    this.insert(container, single);
    this.options.set(option.id,{
      id: option.id,
      text:option.innerHTML,
    })
    this.elements.get(this.currentSelector)!.options!.set(option.id,option.innerHTML)
    this.save();
  }

  deleteOption(optionID:string){
    this.el.nativeElement.querySelector('#' + optionID).parentElement.remove();
    this.options.delete(optionID);
    this.elements.get(this.currentSelector)!.options!.delete(optionID)
    this.save();
  }

  switchTab(tab:number){
    this.tab = tab;
  }

  selectPage(){
   if(this.el.nativeElement.querySelector('#'+this.currentSelector) !=null){
     if(this.el.nativeElement.querySelector('#'+this.currentSelector).classList.contains('container')){return}
   }
    const pages = this.el.nativeElement.querySelectorAll('.page');
    this.select(pages[pages.length - 1]);
  }

  updateText(event:any){
    var  label = this.el.nativeElement.querySelector('.selected') as HTMLElement;
    if(label.classList.contains('label')){
      label.innerHTML = event.target.value.replaceAll(' ', '&nbsp;');
    }else{
      label = label.querySelector('.label') as HTMLInputElement;
      label.innerHTML = event.target.value.replaceAll(' ', '&nbsp;');
    }
    this.contentField = event.target.value;
    this.elements.get(this.currentSelector)!.content = event.target.value;
    this.save();
  }

  updateOption(id:string,event:any){
    var  label = this.el.nativeElement.querySelector('#'+id) as HTMLElement;
    label.innerHTML = event.target.value;
    this.options.get(id).text =event.target.value;
    this.elements.get(this.currentSelector)!.options!.set(id,event.target.value)
    this.save();
  }

  gridEnabled:boolean = true;
  
  toggleGrid(){
    this.gridEnabled = !this.gridEnabled;
    const pages =  this.el.nativeElement.querySelectorAll('.page');
    pages.forEach((page:any)=>{
      if(page.classList.contains('no-grid')){
        page.classList.remove('no-grid');
      
      }else{
        page.classList.add('no-grid');
      }
    })
  }
  delete(){
    this.el.nativeElement.querySelector('#' + this.currentSelector).remove();
    this.elements.delete(this.currentSelector);
    this.elements.forEach((value,key)=>{
      if(value.parent == this.currentSelector){
        this.elements.delete(key);
      }
    })
    this.switchTab(0);
    this.selectPage();
    this.save();
  }

  mapToObject(map: Map<string, any>): any {
    const result: any = {};
  
    map.forEach((value, key) => {
      var optObj= {
        id:value.id,
        order:value.order,
        parent:value.parent,
        content:value.content,
        fields:value.fields,
        options: value.options,
        settings: value.settings,
        
      };
      result[key] = optObj;
      if(result[key].options!=undefined){
        result[key].options = Object.fromEntries(result[key].options);
      }
      
    });
    return result;
  }

  formView(){
    
  }
  save(){
    if(!this.loaded) return;
    console.log(this.elements);
    localStorage.removeItem('form');
    const newMap:Map<string, element> = new Map(this.elements);
    localStorage.setItem('form', JSON.stringify(this.mapToObject(newMap)));
  }
  addField(parent?:string, id?:string, settings?:string[]){
    var _parent = this.currentSelector;
    if(parent != undefined){
      _parent = parent;
    }
    const field = this.el.nativeElement.querySelector('#' + _parent) as HTMLElement;
    var index = Number(field.lastElementChild?.id.replaceAll(field.id +'-',''))+1;
    var _id = field.id + '-' + index.toString();
    if(id!=undefined){
      _id = id;
    }
    const container = this.createFieldElement(_id);
    this.removeClass(container, 'justify-center');
    this.addClass(container,'container');
    this.addClass(container,'flex-col');
    this.addClass(container,'!py-0');
    this.insert(field, container);
    if(settings!=undefined){
      settings.forEach(setting=>{
        if(this.alignments.includes(setting)){
          this.currentSelector = id!;
          this.selectStyle(this.alignments, this.alignments.indexOf(setting));
        }
      })  
    }
    if(id==undefined){
      this.fieldCount +=1;
      this.elements.get(this.currentSelector)!.fields!+=1;
      
      this.elements.set(container.id, {
        id:container.id,
        order: field.children.length - 1,
        parent:this.currentSelector,
        settings : ['justify-start'],
      })
    }
    if(settings==undefined){
      this.save();
    }
  }
  removeField(){
    if(this.fieldCount <= 1) return;
    const id =  this.el.nativeElement.querySelector('#' + this.currentSelector).lastElementChild.id;
    this.elements.delete(id)
    this.elements.forEach((value,key)=>{
      if(value.parent == 'id'){
        this.elements.delete(key);
      }
    })
    this.el.nativeElement.querySelector('#' + this.currentSelector).lastElementChild.remove();
    this.fieldCount -=1;
    
    this.elements.get(this.currentSelector)!.fields!-=1;
    this.save();
  }

  addEntry(parent?:string, id?:string,value?:string, settings?:Array<string>){
    var _parent = this.currentSelector;
    if(parent != undefined){
      _parent = parent;
    }
    const field = this.el.nativeElement.querySelector('#' + _parent) as HTMLElement;
    const body = field.querySelector('tbody');
    var index = Number(body!.lastElementChild?.id.replaceAll(field.id +'-',''))+1;
    const row = this.createFieldRow([(value!=undefined)? value : '','','','']);
    row.querySelector('td div')?.classList.remove('justify-evenly')

    row.querySelector('td div')?.classList.add('pl-5')
    var _id = field.id+'-'+index;
    if(id!=undefined){
      _id = id;
    }
    this.renderer.setAttribute(row, 'id', _id);
    this.insert(body,row);
    if(settings != undefined){
      if(settings.includes('indented')){
        this.currentSelector = id!;
        this.toggleStyle('indented', 'nopush')
      }
    }
    if(id==undefined){
      this.fieldCount +=1;
      this.elements.get(this.currentSelector)!.fields!+=1;
      this.elements.set(row.id, {
        id:row.id,
        content:'',
        order: field.children.length - 1,
        parent:this.currentSelector,
        settings : [],
      })
    }
    if(settings==undefined){
      this.save();
    }
    
  }
  removeEntry(){
    if(this.fieldCount <= 1) return;
    const id =  this.el.nativeElement.querySelector('#' + this.currentSelector).lastElementChild.id;
    this.elements.delete(id)
    this.elements.forEach((value,key)=>{
      if(value.parent == 'id'){
        this.elements.delete(key);
      }
    })
    this.el.nativeElement.querySelector('#' + this.currentSelector+' tbody').lastElementChild.remove();
    this.fieldCount -=1;
    this.elements.delete(this.currentSelector)
    this.elements.get(this.currentSelector)!.fields!-=1;
    this.save();
  }

  publish(){

    var search = this.API.createID36();
    if(this.form != null){
      search = this.form;
      this.API.justSnackbar('Saving form....', 999999999);
    }else{
      this.API.justSnackbar('Publishing form....', 999999999);
    }
    const newMap:Map<string, element> = new Map(this.elements);
    this.API.saveDictionary(search, JSON.stringify(this.mapToObject(newMap)))

    if( this.form==null){
      const id = this.API.createID32();
      
      this.API.createForm(id, search).subscribe( async data =>{
            if(this.gridEnabled){
              this.toggleGrid();
            }
            this.printForm(search);
            this.router.navigate(['web/manage-form', {s: this.API.createID36()}])
      })
    }else{
      this.API.updateForm(this.id).subscribe( async data =>{
            if(this.gridEnabled){
              this.toggleGrid();
            }
            this.printForm(search);
            this.API.successSnackbar('Updated Form!');
            this.router.navigate(['web/manage-form', {s: this.API.createID36()}])
      })
    }
  }

  

  printForm(file:string) {
    // Select the element that you want to capture
    const captureElement =this.el.nativeElement.querySelector('#page1') as HTMLElement;
  
    // Call the html2canvas function and pass the element as an argument
    html2canvas(captureElement,{
      scale: 2,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      // Get the image data as a base64-encoded string
      const imageData = canvas.toDataURL("image/png");
      this.API.uploadBase64(imageData,'image_upload/'+ file + '.png');
      
    });
  }

  deleteForm(){
    this.API.deleteForm(this.id).subscribe(data=>{
      this.API.failedSnackbar('Deleted Form!')
      this.router.navigate(['web/manage-form', {s: this.API.createID36()}])
    })

  }

  constructor(private route:ActivatedRoute,private renderer:Renderer2, private API:ApiService,private el: ElementRef, private router:Router) { }

}


// 

