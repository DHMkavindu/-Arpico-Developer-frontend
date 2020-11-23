import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jobs } from '../model/jobmodel';



@Injectable({
    providedIn: 'root'
})

export class AdminService {
    
    // private _getPending: string = "http://localhost:8080/api/job/getPendingAll";
    private _getPending: string = "http://192.168.1.211:8080/ticket/api/job/getPendingAll";

    // private _getEnd: string = "http://localhost:8080/api/job/getEndAll";
    private _getEnd: string = "http://192.168.1.211:8080/ticket/api/job/getEndAll";

    // private _getUser: string = "http://localhost:8080/api/user/getUsers";
    private _getUser: string = "http://192.168.1.211:8080/ticket/api/user/getUsers";

    // private _getPdf: string = "http://localhost:8080/api/job/report/product/";
    private _getPdf: string = "http://192.168.1.211:8080/ticket/api/job/report/product/";

    constructor(private _http: HttpClient) { }

    getAllPendingJobs(): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._getPending, { headers });

    }

    getAllEndJobs(): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._getEnd, { headers });

    }

    getAllUserName(): Observable<any> {
        const headers = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        return this._http.get<any>(this._getUser, { headers });
    }


    _genPdf(user_name: string, date: string): Observable<Blob> {
        var authorization = 'Bearer ' + sessionStorage.getItem("access_token");

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            "Authorization": authorization, responseType: 'blob',
            'Access-Control-Allow-Origin': '*'
        });

        return this._http.get<Blob>(this._getPdf + user_name + "/" + date, {
            headers: headers, responseType:
                'blob' as 'json'
        });
    }
}