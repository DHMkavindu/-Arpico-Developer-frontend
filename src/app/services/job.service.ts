import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jobs } from '../model/jobmodel';



@Injectable({
    providedIn: 'root'
})

export class jobService {


    // private _url: string = "http://localhost:8080/api/job/save";
    private _url: string = "http://192.168.1.211:8080/ticket/api/job/save";

    // private _url_update: string = "http://localhost:8080/api/job/jobStarts/";
    private _url_update: string = "http://192.168.1.211:8080/ticket/api/job/jobStarts/";
    
    // private _url_update_final: string = "http://localhost:8080/api/job/jobStart/";
    private _url_update_final: string = "http://192.168.1.211:8080/ticket/api/job/jobStart/";

    
    // private _urlAdmin: string = "http://localhost:8080/api/job/saveByAdmin"
    private _urlAdmin: string = "http://192.168.1.211:8080/ticket/api/job/saveByAdmin"


    // private _get: string = "http://localhost:8080/api/job/getJobPending/";
    private _get: string = "http://192.168.1.211:8080/ticket/api/job/getJobPending/";

    // private _getEnd: string = "http://localhost:8080/api/job/getEndAllWithUserId/";
    private _getEnd: string = "http://192.168.1.211:8080/ticket/api/job/getEndAllWithUserId/";

    // private _getPendingJobCount: string = "http://localhost:8080/api/job/getJobPending/";
    private _getPendingJobCount: string = "http://192.168.1.211:8080/ticket/api/job/getJobPending/";

    // private _getCompleteJobCount: string = "http://localhost:8080/api/job/getCompleteJobCount/";
    private _getCompleteJobCount: string = "http://192.168.1.211:8080/ticket/api/job/getCompleteJobCount/";



    constructor(private _http: HttpClient) { }


    sendJob(job: jobs): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        return this._http.post(this._url, job, { headers });
    }

    updateJob(user_id: String, job: jobs): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        return this._http.put(this._url_update + user_id, job, { headers });
    }

    updateJobFianl(user_id: String, job: jobs): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        return this._http.put(this._url_update_final + user_id, job, { headers });
    }

    sendJobByAdmin(job: jobs): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        return this._http.post(this._urlAdmin, job, { headers });
    }


    getAllJobs(user_id: String): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._get + user_id, { headers });

    }


    getAllEndJobs(user_id: string): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._getEnd + user_id, { headers });

    }

    getPendingJobCount(user_id: string): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._getPendingJobCount + user_id, { headers });

    }

    getCompleteJobCount(user_id: string): Observable<any> {
        const headers = {

            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        return this._http.get<any>(this._getCompleteJobCount + user_id, { headers });

    }
}