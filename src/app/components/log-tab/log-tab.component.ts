
import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy ,Input,AfterViewInit,ElementRef,AfterViewChecked} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import { HostListener } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { Debug } from '../../models/Debug';
import {MatIconModule} from '@angular/material/icon'
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
@Component({
  selector: 'app-log-tab',
  templateUrl: './log-tab.component.html',
  styleUrls: ['./log-tab.component.css']
})
export class LogTabComponent implements OnInit {
  blurTable='';
  tableScrollTop;
  lastScrollTop = 0;
  lastTableScrollTop = 0;
  thisWindow;
  filterBy = 'All'
  panelOpenState = false;

  scrollScript : SafeHtml;
  tableFontSize='initial';
  @Input() Debug:Debug;

  insideGoDown = false;
  setscrol = false;
  debugOnly : boolean;
  searchText;
  wrapLinesAmount =0;
  doc;
  public lines:any[];
  public lines2display:any[];
  public partialLines2display:any[];
  public SearchValues:any[];
  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;
  constructor(private clipboard: Clipboard,private _sanitizer: DomSanitizer,public dialog: MatDialog,private elementRef:ElementRef){
    this.SearchValues = [''];
    }

    
    ngAfterViewChecked(){
    if(!this.setscrol ){
      try{
        this.doc = document;//this.elementRef.nativeElement.querySelector('#setscrol').parentNode.parentNode.parentNode.parentNode;
        this.doc.addEventListener('scroll',this.onWindowScroll.bind(this));
        this.thisWindow = this.doc.defaultView;
        
        this.setscrol = true;
        
        
      }catch(err){

      }
      
    
    }
        
    }
    ngOnInit(){
      this.lines =[];
      this.lines2display =[];
      //console.log('Debug',this.Debug.textFile);
      

    }

    ngAfterViewInit(){
      this.lines = this.getLineObjList(this.Debug.textFile.split("\n"));
      //this.lines2display = this.lines;
      this.lines2display = this.lines;
      this.doPartial();
      console.log('lines',this.lines);
      
      //this.elementRef.nativeElement.querySelector('#test').parentNode.parentNode.parentNode.parentNode.addEventListener('scroll', this.onWindowScroll.bind(this));
      
     
    }
    
    searchInLog(){
      console.log('this.SearchValues',this.SearchValues);
      var values = this.SearchValues.filter(val => (val != undefined && val != null && !(val.match(/^ *$/) !== null)) );
      this.lines.forEach(line => {line.selected = ''});
      //console.log('searchInLog',searchText);
      //this.searchText = searchText;
      var lines2filter = this.lines;
      if(this.debugOnly){
        
        lines2filter = this.lines.filter(line => line.isDebug);
        this.lines2display = lines2filter;
      }
      //var isSearchTextEmpty = searchText== undefined || searchText === null || searchText.match(/^ *$/) !== null;
      var isSearchTextEmpty = values.length == 0;
      if(isSearchTextEmpty && !this.debugOnly){
        this.lines2display =  this.lines;
        this.doPartial();
        return;
      }
      if(!isSearchTextEmpty){
        if(values.length>1){
          if(this.filterBy == 'All'){
            
            this.lines2display = lines2filter.filter(line => this.isContainsAll(values,line));
          }else{
            this.lines2display = lines2filter.filter(line => this.isContainsAny(values,line));
          }
        }else{
          this.lines2display = lines2filter.filter(line => line.text.toLowerCase().indexOf(values[0].toLowerCase()) >= 0);
        }
      }
        
      var  lines2displayIndexs = this.lines2display.map(line => line.index);
      console.log('wrapLinesAmount',this.wrapLinesAmount);
      console.log('lines2displayIndexs',lines2displayIndexs);
      if(this.wrapLinesAmount>0){
        var numSet = new Set();
        console.log('numSet',numSet);
        console.log('this.lines2display',this.lines2display);
        this.lines2display.forEach(element => {
          element['selected']='selected';
          var cIndex = parseInt(element['index']);
          console.log('cIndex',cIndex);
          var minIndex = cIndex -this.wrapLinesAmount;
          var maxIndex = (cIndex +this.wrapLinesAmount);
          console.log('minIndex',minIndex);
          console.log('maxIndex',maxIndex);
          for (var i = minIndex; i <= maxIndex ; i++) {
            if(i!=cIndex && !lines2displayIndexs.includes(i))
              numSet.add(i);
          }
        });
        console.log('numSet',numSet);
        var wrapLines = this.lines.filter(line => numSet.has(line.index));
        console.log('wrapLines',wrapLines);
        this.lines2display = this.lines2display.concat(wrapLines) ;
        
        this.lines2display = this.lines2display.sort((a, b) => (a.index > b.index) ? 1 : -1)
        
      }
      this.doPartial();
    }
    getLineObjList(lines){
      var LineObjList =[];
      lines.forEach(function (text, i) {
        LineObjList.push({'index':i,'text':text,'isDebug':text.toLowerCase().indexOf('user_debug')>-1});

      });
      return LineObjList;
    }
    onSearchWraplinesChange(wrapLinesAmount){
      console.log('wrapLinesAmount',wrapLinesAmount);
      this.wrapLinesAmount = parseInt(wrapLinesAmount);
      this.searchInLog();
    }

    debugOnlyChanged(){
      //this.debugOnly = ev.checked;
      console.log('debugOnly',this.debugOnly);
      this.searchInLog();
    }
    onWindowScroll(event){
      var cScrollTop = this.doc.documentElement.scrollTop;
      var clientHeight = this.doc.body.clientHeight;
      this.tableScrollTop =  (this.elementRef.nativeElement.querySelector('#myTable')).getBoundingClientRect().y;
     
      
      
      
     
      //console.log('this.doc.defaultView',this.doc.defaultView);
      //console.log('this.doc.defaultView.scrollY',this.doc.defaultView.scrollY);  
      //console.log('scrollY',event.path[1].frames.scrollY);
      //console.log('this.doc.body.scrollTop',this.doc.body.scrollTop); 
      if(this.lastScrollTop < cScrollTop && cScrollTop >=  (this.doc.body.scrollHeight - this.doc.body.clientHeight)){
        
        this.loadMore();
        console.log('lastScrollTop',this.lastScrollTop);
        console.log('cScrollTop',cScrollTop);
        console.log('clientHeight',clientHeight);
        console.log('scrollHeight',this.doc.body.scrollHeight);
        console.log('tableScrollTop',this.tableScrollTop);
      }
      if(this.tableScrollTop >= 0 && this.lastTableScrollTop < 0  ){
        this.loadLess();
      }
      this.lastScrollTop = cScrollTop;
      this.lastTableScrollTop = this.tableScrollTop;
    }
    
    loadMore(){
      console.log('loadMore insideGoDown:',this.insideGoDown);
      if(this.insideGoDown){
        
        return false;
      }
       
      console.log('loadMore');
      
      
      var partialIndex = this.partialLines2display[this.partialLines2display.length-1].index;
      var FullIndex = this.lines2display.map(line => line.index).indexOf(partialIndex);
      if(this.lines2display[this.lines2display.length-1].index ==  partialIndex)
        return false;
      this.disableScroll();
      console.log('FullIndex',FullIndex);
      if(this.lines2display.length>12)
        var scrollTo = this.lines2display[FullIndex-12].index;
      else 
        var scrollTo = this.lines2display[FullIndex-1].index; 
      var sliceFrom = FullIndex -100;
      sliceFrom = sliceFrom > 0 ?   sliceFrom : 0; 
      var sliceTo = FullIndex + 100;
      sliceTo = sliceTo < this.lines2display.length  ?   sliceTo : this.lines2display.length; 
      this.partialLines2display =  this.lines2display.slice(sliceFrom,sliceTo);
      setTimeout(this.scrollToView, 1,[this,scrollTo]);
      //setTimeout(this.scrollToView, 1000,scrollTo);
    }
    loadLess(){
      if(this.partialLines2display[0].index == this.lines2display[0].index)
        return false;
      this.disableScroll(); 
      console.log('loadLess');
      var partialIndex = this.partialLines2display[0].index;
      var FullIndex = this.lines2display.map(line => line.index).indexOf(partialIndex);
      console.log('FullIndex',FullIndex);
      var scrollTo = this.lines2display[FullIndex].index;
      if((FullIndex -100) >=0){
        var sliceFrom = FullIndex -100;
        sliceFrom = sliceFrom > 0 ?   sliceFrom : 0; 
        var sliceTo = FullIndex + 100;
        sliceTo = sliceTo < this.lines2display.length  ?   sliceTo : this.lines2display.length; 
        this.partialLines2display =  this.lines2display.slice(sliceFrom,sliceTo);
      }else{
        this.doPartial();
      }  
      //this.scrollToView([this,scrollTo]);
      setTimeout(this.scrollToView, 1,[this,scrollTo]);
    }
    goUp(){
      this.doPartial();
      setTimeout(this.thisWindow.scrollTo(0,0), 100);
    }
    goDown(){
      this.insideGoDown = true;
      console.log('goDown');
      this.disableScroll(); 
      this.partialLines2display =  this.lines2display.slice(this.lines2display.length-200,this.lines2display.length -1);
       //setTimeout(this.thisWindow.scrollTo(0,this.doc.body.scrollHeight), 1000);
       var scrollTo =  this.partialLines2display[ this.partialLines2display.length-1].index
       var that = this;
       console.log('goDown bf scrollTo',that.doc.body.scrollHeight);
       setTimeout(()=>{
        //this.scrollToView([this,scrollTo]);
        this.thisWindow.scrollTo(0,this.doc.body.scrollHeight);
        console.log('goDown bf scrollTo',that.doc.body.scrollHeight);
        this.enableScroll();
        setTimeout(()=>{this.insideGoDown = false; } ,300);
       },300);
       
    }  
    doPartial(){
      this.partialLines2display =  this.lines2display.slice(0,200);
      this.enableScroll();
      
    }
    scrollToView(arr){
      var elId = arr[1];
      var that = arr[0];
      console.log('scrollToView elId',elId);
      try {
        var elmnt = that.doc.getElementById(elId);
        elmnt.scrollIntoView();
      } catch (error) {
        
      }
      
      that.enableScroll();
    }
    addSearchBox(){
      this.SearchValues.push('');
    }
    removeSearchBox(){
      this.SearchValues.pop();
      this.searchInLog();
    }
    FilterBy(){
      
      console.log('FilterBy',this.filterBy);
      this.searchInLog();
    }
    isContainsAll(values,line){
      var ContainAll = true;
      for(let val of values){
          if( line.text.toLowerCase().indexOf(val.toLowerCase()) == -1){
            ContainAll = false;
            break;
          }  
        };
      return ContainAll;
    }
    isContainsAny(values,line){
      var ContainAny = false;
      for(let val of values) {
          if( line.text.toLowerCase().indexOf(val.toLowerCase()) >= 0){
            ContainAny = true;
            break;
          }  
        };
      return ContainAny;
    }
    ResetFilters(){
      this.SearchValues =[''];
      this.debugOnly = false;
      this.wrapLinesAmount = 0;
      this.filterBy = 'All';
      this.searchInLog();

    }
    
    getArrayFromLength(length){
      var arr = [];
      for(var i =0  ; i<length ; i++){
        arr.push('');
        
      }
      return arr;
    }

    async copy2Clipboard(){
      console.log('### copy2Clipboard');

      var text2copy = this.lines2display.map(line => line.text).join("\n");
      //this.clipboard.copy(text2copy);
      //navigator.clipboard.writeText(text2copy).then().catch(e => console.log(e));
      await navigator.clipboard.writeText(text2copy);
      /*const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = text2copy;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);*/
   
    }
    fontSizeChanged(){
      console.log(this.tableFontSize)
    }
    disableScroll(){
      this.blurTable = 'blurTable'; 
      this.doc.body.style.overflow = 'hidden';
      setTimeout(()=>{this.doc.body.style.overflow = 'inherit';}, 3000);
    }
    enableScroll(){
      this.blurTable = ''; 
      this.doc.body.style.overflow = 'inherit';
    }
   
}
