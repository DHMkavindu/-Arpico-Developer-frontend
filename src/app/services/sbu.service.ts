import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jobs } from '../model/jobmodel';



@Injectable({
    providedIn: 'root'
})

export class sbuService {

    // private _uslgetSbu: string = "http://localhost:8080/api/sbu/";
    private _uslgetSbu: string = "http://192.168.1.211:8080/ticket/api/sbu/";

    // private _urlgetDepartment: string ="http://localhost:8080/api/location/";
    private _urlgetDepartment: string ="http://192.168.1.211:8080/ticket/api/location/";

    constructor(private _http: HttpClient) { }

    getSbu(): Observable<any> {
        const headers = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get(this._uslgetSbu, { headers });
    }

    getDepartment(sbu: String): Observable<any> {
        const headers = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get(this._urlgetDepartment + sbu, { headers });
    }
}