import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {
  public firstUse: boolean = true;

  constructor(private router: Router,  private route: ActivatedRoute) { }

  ngOnInit() {}

  onSearchTime(nameInput) {
    this.firstUse = false;
    this.router.navigate(['workload',nameInput.value+'d','users']);
  }

}
