import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TagData } from '../models/tag-data';
import { TagDataExtended } from '../models/tag-data-extended';

type TagDataRaw = [number, number, string, number];
type TagDataExtendedRaw = [number, number, string, number, number, number, number];

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  constructor (private _httpClient: HttpClient) { }

  httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) }

  handleError (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error ('An error occurred:', error.error.message);
    }
    return throwError ('Error retrieving data from server.');
  };

  tagDataRawToObj (data: TagDataRaw[]): TagData[] {
    return data.map ((d: TagDataRaw) => { return { id: d[0], time: d[1], epc: d[2], bib: d[3] }});
  }

  tagDataExtendedRawToObj (data: TagDataExtendedRaw[]): TagDataExtended[] {
    return data.map ((d: TagDataExtendedRaw) => { return { id: d[0], time: d[1], epc: d[2], antenna: d[3], frequency: d[4], rssi: d[5] }});
  }

  getData(): Observable<TagData[]> {
    const dataURL = environment.server;
    return this._httpClient.get<TagDataRaw[]> (dataURL, this.httpOptions).pipe (retry (2), catchError (this.handleError), map (this.tagDataRawToObj));
  }

  getDataSince (rowid: number): Observable<TagData[]> {
    const dataURL = environment.server + '/since/' + rowid;
    return this._httpClient.get<TagDataRaw[]> (dataURL, this.httpOptions).pipe (catchError (this.handleError), map (this.tagDataRawToObj));
  }

  getDataFor (epc: string): Observable<TagDataExtended[]> {
    const dataURL = environment.server + '/epc/' + epc;
    return this._httpClient.get<TagDataExtendedRaw[]> (dataURL, this.httpOptions).pipe (retry (2), catchError (this.handleError), map (this.tagDataExtendedRawToObj));
  }
}
