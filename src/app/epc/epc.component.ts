import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { HttpDataService } from '../services/httpdata.service';
import { TagDataExtended } from '../models/tag-data-extended';

@Component({
  templateUrl: './epc.component.html',
  styleUrls: ['./epc.component.css']
})
export class EpcComponent implements OnInit {
  displayedColumns: string[] = ['id', 'time', 'antenna', 'rssi'];
  dataSource: TagDataExtended[] = [];
  isLoadingResults: boolean = true;
  bib: number | null = null;

  constructor (private httpDataService: HttpDataService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.httpDataService.getDataFor (this.data.epc).subscribe (data => {
      this.bib = this.data.bib;
      this.dataSource = data.reverse();
      this.isLoadingResults = false;
    });
  }
}

