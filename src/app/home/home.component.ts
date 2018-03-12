import { Component, ViewEncapsulation, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from './../data.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { BarComponent } from '../bar/bar.component';
import { Router } from '@angular/router';

import * as _ from 'underscore';

@Component({
  selector: 'row-details-demo',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {}



}

