import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {
  public firstUse: boolean = true;

  constructor(private router: Router,  private route: ActivatedRoute) { }

  ngOnInit() {}

  onSearchTime(form: NgForm) {
    this.firstUse = false;
    let timeSelected = form.value.timeFrame + 'd';
    this.router.navigate(['workload', timeSelected,'users']);
  }

}
