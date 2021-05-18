import { Component, OnInit } from '@angular/core';
import { TraceFlag } from '../../models/TraceFlag';
@Component({
  selector: 'app-my-cmp',
  templateUrl: './my-cmp.component.html',
  styleUrls: ['./my-cmp.component.css']
})
export class MyCMPComponent implements OnInit {

  tracFlags:TraceFlag[];

  constructor() { }

  ngOnInit(): void {
    this.tracFlags = [
      {
        "Id" : "7tf3I0000000I70QAE",
        "StartDate" : ("2020-08-16T11:46:35.000+0000").split('+')[0],
        "TracedEntity" : {
          "Name" : "Tomer Ulman",
          "Id" : "0053I000000lbjSQAQ"
        },
  
        "ExpirationDate" : "2020-08-16T13:16:00.000",
        "DebugLevel" : {
          "Id" : "7dl1U000000DG9mQAG",
          "DeveloperName" : "SFDC_DevConsole"
        }
      }, {
      
        "Id" : "7tf3I0000000FtzQAE",
        "StartDate" : "2020-06-28T09:45:05.000+0000".split('+')[0],
        "TracedEntity" : {
          
          "Name" : "webForm_integration_user",
          "Id" : "0053I000000mwa7QAA"
        },
        "ExpirationDate" : "2020-06-28T10:15:05.000+0000".split('+')[0],
        "DebugLevel" : {
         
          "Id" : "7dl1U000000DG9mQAG",
          "DeveloperName" : "SFDC_DevConsole"
        }
      }, {
       
        "Id" : "7tf3I0000000FuJQAU",
        "StartDate" : "2020-08-28T23:26:01.000+0000".split('+')[0],
        "TracedEntity" : {
          
          "Name" : "Rahul Aggarwal",
          "Id" : "0051U000006oaQHQAY"
        },
        "ExpirationDate" : "2020-08-29T00:11:02.000+0000".split('+')[0],
        "DebugLevel" : {
          
          "Id" : "7dl1U000000DG9mQAG",
          "DeveloperName" : "SFDC_DevConsole"
        }
      }
    ];
  }

}
