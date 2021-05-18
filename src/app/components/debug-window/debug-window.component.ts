
import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy ,Input,AfterViewInit,ElementRef,AfterViewChecked} from '@angular/core';
import { HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { Debug } from '../../models/Debug';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-debug-window',
  templateUrl: './debug-window.component.html',
  styleUrls: ['./debug-window.component.css']

})
export class DebugWindowComponent implements OnInit {
  tableScrollTop;
  lastScrollTop = 0;
  thisWindow;
  filterBy = 'All'
  myStyle: SafeHtml;
  scrollScript : SafeHtml;
  @Input() Debug:Debug;


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
  constructor(private _sanitizer: DomSanitizer,public dialog: MatDialog,private elementRef:ElementRef){
    this.SearchValues = [''];
    }

    
    ngAfterViewChecked(){
    if(!this.setscrol ){
      try{
        this.doc =this.elementRef.nativeElement.querySelector('#setscrol').parentNode.parentNode.parentNode.parentNode;
        this.doc.addEventListener('scroll',this.onWindowScroll.bind(this));
        this.thisWindow = this.doc.defaultView;
        
        this.setscrol = true;
        this.tableScrollTop =  this.doc.getElementById('myTable').getBoundingClientRect().y;
      }catch(err){

      }
      
    
    }
        
    }
    ngOnInit(){
      this.lines =[];
      this.lines2display =[];
      //console.log('Debug',this.Debug.textFile);
      
      this.myStyle =
      this._sanitizer.bypassSecurityTrustHtml(
        `<style>
        #resetFilters{
          color: white;
          background: firebrick;
          border: solid brown 1px;
          border-radius: 5px;
          padding: 5px 20px;
          font-size: 17px;
        }
        #plus{
          font-size: 50px !important;
          color: green;
        }
        #minus{
          font-size: 50px !important;
          color: red;
        }
        #arrows{
          position: fixed;
          right: 10px;
          top: 40%;
          font-size: 100px;
          cursor: pointer;
        }
        .arrow {
          cursor: pointer;
          color:royalblue;
          text-shadow: 3px 1px lightskyblue;
          cursor: pointer;
          /*width: 50px;
          height: 50px;
          border: 18px solid royalblue;
          border-left: 0;
          border-top: 0;
          box-shadow: 2px 2px lightskyblue;
          border-radius: 17px;
          cursor: pointer;*/

        }
        //.arrow-up { transform: rotate(225deg); }
        //.arrow-down { transform: rotate(45deg); }
        .logTableContainer{
          margin: 20px;
        }
        .logTable{
          border: solid 1px blue;
          background: #1abc9c;
          color: white;
        }
        .logTable td{
          border: none;
          font-size: 23px;
        }
        .SearchBoxCon{
          margin-bottom: 20px;
        }
        .SearchBox{
          
          width: 100%;
          height: 39px;
          border-radius: 15px;
          border: darksalmon solid;
        }
        #myInput {
        background-image: url('/css/searchicon.png'); /* Add a search icon to input */
        background-position: 10px 12px; /* Position the search icon */
        background-repeat: no-repeat; /* Do not repeat the icon image */
        width: 100%; /* Full-width */
        font-size: 16px; /* Increase font-size */
        padding: 12px 20px 12px 40px; /* Add some padding */
        border: 1px solid #8ecc68; /* Add a grey border */
        margin-bottom: 12px; /* Add some space below the input */
      }
      
      #myTable {
        //margin: 20px;
        width: 97%;
        
        border-collapse: collapse; /* Collapse borders */
       
        border: 1px solid #8ecc68;
        font-size: 18px; /* Increase font-size */
      }
      
      #myTable th, #myTable td {
        text-align: left; /* Left-align text */
        padding: 12px; /* Add padding */
      }
      
      #myTable tr {
        /* Add a bottom border to all table rows */
        border-bottom: 1px solid #8ecc68;
      }
      
      #myTable tr.header, #myTable tr:hover {
        /* Add a grey background color to the table header and on hover */
        background-color: #f1f1f1;
      }
      #myTable td, #myTable th {
        border: 1px solid #8ecc68;
        
      }
      .isDebugtrue{
        background: pink;;
      }
      .selected{
        background: aquamarine;
      }
      </style>`);
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
      this.wrapLinesAmount = parseInt(wrapLinesAmount);
      this.searchInLog();
    }

    debugOnlyChanged(){
      //this.debugOnly = ev.checked;
      console.log('debugOnly',this.debugOnly);
      this.searchInLog();
    }
    onWindowScroll(event){
      var cScrollTop = this.doc.body.scrollTop;
      var clientHeight = this.doc.body.clientHeight;
      //console.log('onWindowScroll',event);
     
      //console.log('this.doc.defaultView',this.doc.defaultView);
      //console.log('this.doc.defaultView.scrollY',this.doc.defaultView.scrollY);  
      //console.log('scrollY',event.path[1].frames.scrollY);
      //console.log('this.doc.body.scrollTop',this.doc.body.scrollTop); 
      if(this.lastScrollTop < cScrollTop && cScrollTop >=  (this.doc.body.scrollHeight - this.doc.body.clientHeight)){
        this.loadMore();
      }
      if(this.lastScrollTop > this.tableScrollTop &&   cScrollTop <=this.tableScrollTop ){
        this.loadLess();
      }
      this.lastScrollTop = cScrollTop;
    }
    
    loadMore(){
      console.log('loadMore');
     
      
      var partialIndex = this.partialLines2display[this.partialLines2display.length-1].index;
      var FullIndex = this.lines2display.map(line => line.index).indexOf(partialIndex);
      console.log('FullIndex',FullIndex);
      var scrollTo = this.lines2display[FullIndex+5].index;
      var sliceFrom = FullIndex -100;
      sliceFrom = sliceFrom > 0 ?   sliceFrom : 0; 
      var sliceTo = FullIndex + 100;
      sliceTo = sliceTo < this.lines2display.length  ?   sliceTo : this.lines2display.length; 
      this.partialLines2display =  this.lines2display.slice(sliceFrom,sliceTo);
      
      //setTimeout(this.scrollToView, 1000,scrollTo);
    }
    loadLess(){
      if(this.partialLines2display[0].index == this.lines2display[0].index)
        return;
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
      
      setTimeout(this.scrollToView, 1,[this,scrollTo]);
    }
    goUp(){
      this.doPartial();
      setTimeout(this.thisWindow.scrollTo(0,0), 100);
    }
    goDown(){
      this.partialLines2display =  this.lines2display.slice(this.lines2display.length-200,this.lines2display.length -1);
       setTimeout(this.thisWindow.scrollTo(0,this.doc.body.scrollHeight), 1000);
    }  
    doPartial(){
      this.partialLines2display =  this.lines2display.slice(0,200);
      
    }
    scrollToView(arr){
      var elId = arr[1];
      var that = arr[0];
      console.log('scrollToView elId',elId);
      var elmnt = that.doc.getElementById(elId);
      elmnt.scrollIntoView();
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
   
}