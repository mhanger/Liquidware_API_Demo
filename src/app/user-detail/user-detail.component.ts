import { Component, ViewEncapsulation, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from './../data.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular'
import { ActivatedRoute, Router, Params } from '@angular/router';

import * as _ from 'underscore';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @ViewChild('myTable') table: any;

  public url:string = 'https://demo.liquidware.com/lwl/api?json=';
  public dataLoaded = false;
  public chartLoading: boolean = false;
  public searchType:number = 0;
  public userSelected:string;
  public submittedSearch:boolean = false;
  public reportDate:string;
  public rows: Observable<any[]>;
  public dataService;
  public userId: number;
  public chart: AmChart;

  private timeFrame: string;

  params = {
    "inspector":"0",
    "basis":"users",
    "date":"yesterday",
    "limit":"0",
    "columns":"user_id,record_count,cpu_used_mhz,rank_score,memory_used_mb,page_used_mb,total_io_bps,total_iops,net_total_bps,cpu_context_switching_avg,swap_page_faults,page_faults,node_count,user_count,cid_seconds",
    "sort_col":"rank_score",
    "sort_order":"2"
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  	public dataService1: DataService,
    public AmCharts: AmChartsService,
	) {
      this.dataService = dataService1;
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.userId= params['user_id'];
        this.timeFrame= params['timeFrame'];
      });
    this.onTimeSearched(this.timeFrame);
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  resetToAll(e) {
    e.preventDefault();
    this.router.navigate(['workload', this.timeFrame, 'users']);
  }

// Time frame functions
  onTimeSearched(timeFrame) {
    this.reportDate = this.getSearchDate(timeFrame);
    this.destroyChart();
    this.destroyData();
    this.searchType = timeFrame;
    this.submittedSearch = true;
    this.getDetailChart();
  }

  getSearchDate(timeFrame) {
    let dateAdj = 1;
    switch(timeFrame) {
      case "1d":
          dateAdj = 1;
          this.params.date = "yesterday"
          break;
      default:
          dateAdj = 1;
          this.params.date = "yesterday"
    }
    return this.getFormattedDate(( d => new Date(d.setDate(d.getDate()-dateAdj)) )(new Date))
  }

  getFormattedDate(dateIn) {
    let month = dateIn.getMonth() + 1;
    let day =  dateIn.getDate();
    let year = dateIn.getFullYear();
    return month + "/" + day + "/" + year;
  }

// chart functions
  buildChart(dataArray, xAxis, yAxis, yTitle) {
    return {
      "type": "serial",
      "theme": "light",
      "responsive": {
        "enabled": true
      },
      "marginRight": 70,
      "dataProvider": this.getChartData(dataArray, xAxis, yAxis),
      "valueAxes": [{
        "axisAlpha": 0,
        "titleColor": "#636466",
        "titleFontSize": "14",
        "position": "left",
        "title": yTitle,
      }],
      "startDuration": 1,
      "graphs": [{
        "balloonText": "<b>[[category]]: [[value]]</b>",
        "fillColors": "#8eb9da",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": yAxis
      }],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": xAxis,
      "categoryAxis": {
        "gridPosition": "start",
        "fontSize": "12"
      }
    }
  }

  getChartData(dataArray, xAxis, yAxis) {
    let dataProvider = [];
    for (let i = 0; i < dataArray.length; i++){
      let item = {};
      item[xAxis] = dataArray[i][xAxis];
      item[yAxis] = parseInt(dataArray[i][yAxis]);
      item['color'] = '#ccc';
      dataProvider.push(item);
    }
    return dataProvider;
  }

  getDetailChart(){
    this.chartLoading = true;
    this.submittedSearch = true;
    let copy = {...this.params};
    let searchParam = 'user_name';
      copy['user_id'] = this.userId;
      copy['resolution'] = 'hourly';
      copy['sort_col'] = 'end_date';
      copy['sort_order'] = "1";
      searchParam = 'end_date';

    this.chartLoading = true;
    this.dataService.getData(this.url + JSON.stringify(copy)).subscribe((data) => {
    this.rows = data['table'];
    this.destroyChart();
    this.chart = this.AmCharts.makeChart('chartdiv', this.buildChart(data['table'], searchParam, 'rank_score', 'Workload Ranking'))
    this.dataLoaded = true;
    this.chartLoading = false;
    });
  }

  //destroy functions

  destroyData() {
    this.rows = undefined;
  }

  destroyChart() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
