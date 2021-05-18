import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //window.location.replace('https://test.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9W4cDaFe_AanyCnLpRoUX9F4eEd5Uv7MEkfClluPLgy6uiSkzf4FJO_Cr.2IPzRFMchEMnwIXM059NTmk&redirect_uri='+window.location.origin+'&state=mystate');
    //window.location.replace('https://test.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9W4cDaFe_AanyCnLpRoUX9Om_wpDKyCqwJC4avrtj.Ag.prm.oJFm8voek6AAQX9lqbANpM6kmzVEUSa7&redirect_uri=https://test.salesforce.com/services/oauth2/success&state=mystate');
  }

  PRDLogin():void{
    window.location.replace('https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9W4cDaFe_AanyCnLpRoUX9F4eEd5Uv7MEkfClluPLgy6uiSkzf4FJO_Cr.2IPzRFMchEMnwIXM059NTmk&redirect_uri='+window.location.origin+'&state=mystate');
  }

  SBLogin():void{
    window.location.replace('https://test.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9W4cDaFe_AanyCnLpRoUX9F4eEd5Uv7MEkfClluPLgy6uiSkzf4FJO_Cr.2IPzRFMchEMnwIXM059NTmk&redirect_uri='+window.location.origin+'&state=mystate');
  }

}
