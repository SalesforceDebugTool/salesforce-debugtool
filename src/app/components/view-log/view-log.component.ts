import { Component, OnInit, Input,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-view-log',
  templateUrl: './view-log.component.html',
  styleUrls: ['./view-log.component.css'],
  template: 'passed in {{ data.textFile }}',
})
export class ViewLogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
