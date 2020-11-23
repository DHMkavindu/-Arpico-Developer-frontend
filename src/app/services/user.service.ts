import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private userUrl = 'http://localhost:8080/api/test/user';
  private userUrl = 'http://192.168.1.211:8080/ticket/api/test/user';

  // private pmUrl = 'http://localhost:8080/api/test/pm';
  private pmUrl = 'http://192.168.1.211:8080/ticket/api/test/mod';

  // private adminUrl = 'http://localhost:8080/api/test/admin';
  private adminUrl = 'http://192.168.1.211:8080/ticket/api/test/admin';

  constructor(private http: HttpClient) { }

  getUserBoard(): Observable<string> {
    return this.http.get(this.userUrl, { responseType: 'text' });
  }

  getPMBoard(): Observable<string> {
    return this.http.get(this.pmUrl, { responseType: 'text' });
  }

  getAdminBoard(): Observable<string> {
    return this.http.get(this.adminUrl, { responseType: 'text' });
  }
}
