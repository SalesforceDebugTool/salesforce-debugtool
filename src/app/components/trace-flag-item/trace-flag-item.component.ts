import { Component, OnInit,Input,OnDestroy,EventEmitter,Output } from '@angular/core';
import { TraceFlag } from '../../models/TraceFlag';
import { SFAPIService } from '../../services/sf-api.service';
import { fail } from 'assert';
import {ToasterContainerComponent, ToasterService,ToasterModule,ToasterConfig} from 'angular2-toaster';
import {FormControl} from '@angular/forms';

@Component({
  selector: '[app-trace-flag-item]',
  templateUrl: './trace-flag-item.component.html',
  styleUrls: ['./trace-flag-item.component.css']
})

export class TraceFlagItemComponent implements OnInit ,OnDestroy{
  public selectedMoments;
  @Output() onDeleteOne = new EventEmitter<boolean>();
  @Output() needRefresh = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @Input() credentials:Object;
  @Input() traceFlag:TraceFlag;
  @Input() GMToffSet:number;
  @Input() logLevels : any[];
  logLevelForm = new FormControl();
  currentDate = new Date();
  isExpired: boolean = false;
  private toasterService: ToasterService;
  public config: ToasterConfig = 
        new ToasterConfig({
            showCloseButton: true, 
            tapToDismiss: false, 
            timeout: 3000,
            animation: 'fade',
            
  });

  constructor(private sfAPIService:SFAPIService,toasterService:ToasterService) { 
    this.toasterService = toasterService;
  }

  ngOnDestroy():void{
    this.traceFlag['display'] = false;
  } 

  ngOnInit(): void {
    this.traceFlag['display'] = true;
    //console.log('logLevels',this.logLevels)

    
    //console.log('StartDate',this.sfAPIService.RealGmtToLocal(this.GMToffSet,this.traceFlag['StartDate'])['toGMTString']());
    //console.log('ExpirationDate',this.sfAPIService.RealGmtToLocal(this.GMToffSet,this.traceFlag['ExpirationDate'])['toGMTString']());
    var StartDate = new Date(this.traceFlag['StartDate'] ? this.traceFlag['StartDate'].slice(0,-5) : null);
    var ExpirationDate = new Date(this.traceFlag['ExpirationDate'].slice(0,-5));
    this.traceFlag['StartDate2dispaly'] = this.traceFlag['StartDate'] ? this.sfAPIService.RealGmtToLocal(this.GMToffSet,this.traceFlag['StartDate']).toLocaleString() : undefined;
    this.traceFlag['ExpirationDate2dispaly'] = this.sfAPIService.RealGmtToLocal(this.GMToffSet,this.traceFlag['ExpirationDate']).toLocaleString();

    
    /*onsole.log('date now',new Date());
    console.log('StartDate',StartDate);
    console.log('ExpirationDate',ExpirationDate);*/
    this.selectedMoments = [
      new Date(this.traceFlag['StartDate2dispaly']),
      new Date(this.traceFlag['ExpirationDate2dispaly'])
    ];
    var dateNow = new Date(new Date(new Date().getTime() - this.GMToffSet).toISOString().slice(0,-1));
    //var dateNow = this.sfAPIService.getLocalDate(this.GMToffSet,new Date());
    //console.log('fixed date now',dateNow);
    //console.log('StartDate',StartDate);
    //console.log('ExpirationDate',ExpirationDate);
    if(ExpirationDate < dateNow){
      this.traceFlag['Status'] = 'Expired' ;
    } else if(ExpirationDate > dateNow && StartDate < dateNow ){
      this.traceFlag['Status'] = 'Live' ;
    }
    else{
      this.traceFlag['Status'] = 'Future' ;
    }
    
    
   // this.isExpired = this.currentDate > this.traceFlag.ExpirationDate;
  }

  deleteTraceFlag():void{
    
    this.sfAPIService.toolingApiDeleteOne(this.traceFlag.Id,this.credentials).subscribe(deletedRes => {
      console.log('deleted logs res',deletedRes);
      this.onDeleteOne.emit(true);
     
    });
  }
 
  updateTF(){
    console.log('this.selectedMoments',this.selectedMoments);
    var TF = {'Id':this.traceFlag.Id};
    TF['DebugLevelId'] = this.logLevels.filter(lv => lv['DeveloperName'] == this.traceFlag.DebugLevel.DeveloperName)[0].Id;
    
    //TF['LogType'] = 'USER_DEBUG';
    //var date = new Date(new Date().getTime() - this.GMToffSet);
    var str = this.sfAPIService.toRealGmt(this.GMToffSet,this.selectedMoments[0]);
    var exp = this.sfAPIService.toRealGmt(this.GMToffSet,this.selectedMoments[1]);
    console.log('str',str);
    console.log('str.toISOString()',str.toISOString());
    //str.setSeconds(str.getSeconds() + 10);
    TF['ExpirationDate'] = exp.toISOString(); 
    TF['StartDate'] =    str.toISOString();
    console.log(' TF 2update:',TF);
    this.sfAPIService.updateTF(this.credentials,TF).subscribe(updateTFres => {
      console.log('updateTF res',updateTFres);
      this.toasterService.pop('success', 'Traceflag update', 'succeeded!');
      this.needRefresh.emit(true);
      
     
    },
    error => {
      console.log('updateTF failed', error);
      var toast  = {
        type: 'error',
        title: 'Traceflag update failed',
        body: error.error.map(e=>e.message).join(' , '),
        timeout:10000,
        showCloseButton: true,
    };
      this.toasterService.pop(toast);
      
    },
    () => {
      // 'onCompleted' callback.
      // No errors, route to new page here
    });
  }
  TFextention(hours){

    var TF = {'Id':this.traceFlag.Id};
    TF['DebugLevelId'] = this.logLevels.filter(lv => lv['DeveloperName'] == this.traceFlag.DebugLevel.DeveloperName)[0].Id;
    var str = this.sfAPIService.toRealGmt(this.GMToffSet,new Date());
    var exp = this.sfAPIService.toRealGmt(this.GMToffSet,new Date());
    console.log('str',str);
    console.log('str.toISOString()',str.toISOString());
    //str.setSeconds(str.getSeconds() + 10);
    exp.setHours(str.getHours() + hours);
    TF['ExpirationDate'] = exp.toISOString(); 
    TF['StartDate'] =    str.toISOString();
    console.log(' TF 2update:',TF);
    this.sfAPIService.updateTF(this.credentials,TF).subscribe(updateTFres => {
      console.log('updateTF res',updateTFres);
      this.toasterService.pop('success', 'Traceflag extended', 'succeeded!');
      this.needRefresh.emit(true);
      
     
    },
    error => {
      console.log('updateTF failed', error);
      var toast  = {
        type: 'error',
        title: 'Traceflag update failed',
        body: error.error.map(e=>e.message).join(' , '),
        timeout:10000,
        showCloseButton: true,
    };
      this.toasterService.pop(toast);
      
    },
    () => {
      // 'onCompleted' callback.
      // No errors, route to new page here
    });
    
  }
  selectChanged(){
    this.onSelected.emit(true);
    
  }

}
