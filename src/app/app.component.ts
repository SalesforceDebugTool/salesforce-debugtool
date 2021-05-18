import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { SFAPIService } from './services/sf-api.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fronDorLink:string;
  User:Object;
  Org:Object;
  GMToffSet :number;
  token:string;
  credentials:Object;
  constructor(private titleService: Title ,private SFAPIService:SFAPIService) {
    var that = this;
  
   

    this.titleService.setTitle( 'Debbug Tool' );
    this.credentials = {}; 
    var url = new URL(window.location.href.replace('#', '?'));
    this.credentials['access_token'] =  this.token = url.searchParams.get("access_token");
    if(location.hostname !== "localhost")
      window.history.pushState({}, document.title,"");
    var instance_url = this.credentials['instance_url'] =  url.searchParams.get("instance_url");
    if(instance_url){
      this.credentials['org']  = instance_url.substring(
        instance_url.lastIndexOf("/") + 1, 
        instance_url.indexOf(".")
      );
      this.fronDorLink = instance_url+"/secur/frontdoor.jsp?sid="+this.credentials['access_token'];
      this.SFAPIService.getUserDetatils(this.credentials).subscribe(user => {
        console.log('user res',user);
        that.User = user;

        this.SFAPIService.modifiedUserCountry(this.credentials,that.User).subscribe(res => {
          var datebeforeUpdate = new Date();
          this.SFAPIService.getUserDetatilsById(this.credentials,that.User['id']).subscribe(ModifiedUser => {
            
            this.GMToffSet = this.SFAPIService.getGmtOffset(datebeforeUpdate, ModifiedUser.LastModifiedDate) ;
            console.log('GMToffSet',this.GMToffSet);
          });
        });
        //this.Debugs = logs.records;
      });
      this.SFAPIService.getOrgDetatils(this.credentials).subscribe(org => {
        console.log(' org info',org);
        that.Org = org.records[0];
        //this.Debugs = logs.records;
      });
      
      /*this.SFAPIService.getGMT().subscribe(gmt => {
      
        this.GMToffSet = this.SFAPIService.getGmtOffset(new Date(), gmt.currentDateTime) ;
        console.log('GMToffSet',this.GMToffSet);
      });*/
      //this.GMToffSet = new Date().getTimezoneOffset() ;
      //console.log("@@@ GMToffSet",this.GMToffSet);
    }
    
    console.log('token',this.token);
  }

}
