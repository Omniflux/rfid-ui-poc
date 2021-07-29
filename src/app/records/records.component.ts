import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Howl } from 'howler';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { speak } from 'rxjs-tts';

import { EpcComponent } from '../epc/epc.component';
import { HttpDataService } from '../services/httpdata.service';
import { TagData } from '../models/tag-data';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'bib', 'time'];
  dataSource: TagData[] = [];
  isLoadingResults: boolean = true;
  sound: Howl = new Howl ({ src: ['assets/notification.mp3'] });

  clock!: Observable<Date>;
  timerSubscription!: Subscription;

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor (
    public matDialog: MatDialog,
    private httpDataService: HttpDataService
  ) { }

  ngOnInit(): void {
    this.httpDataService.getData().subscribe (data => {
      this.clock = interval (1000).pipe (map(() => new Date()));
      this.dataSource = data.reverse();
      this.isLoadingResults = false;
      if (data.length)
      {
        this.sound.play();
      }

      this.getNewRows();
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  getNewRows(): void {
    this.timerSubscription = timer (1000).subscribe (() => {
      this.httpDataService.getDataSince (this.dataSource[0]?.id ?? 0).subscribe (data => {
        if (data.length) {
          this.dataSource.unshift (...data.reverse());
          this.table.renderRows();
          this.sound.play();

          var notification = data.map (x => { return x.bib }).join (', ');
          console.log ('Added bib' + (data.length > 1 ? 's' : '') + ': ' + notification);
          speak (notification).subscribe();
        }
        this.getNewRows();
      }, error => { this.getNewRows(); })
    })
  }

  showEpc (epc: string, bib: number): void {
    this.httpDataService.getDataFor (epc).subscribe (data => {
      this.matDialog.open (EpcComponent, { data: { epc, bib }})
    });
  }
}
