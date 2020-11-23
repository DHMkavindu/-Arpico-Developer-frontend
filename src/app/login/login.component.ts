import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthLoginInfo } from '../auth/login-info';
import { jobService } from '../services/job.service';
import { jobs } from '../model/jobmodel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  info: any;

  pendingJobcount: number;
  competeJobCount: number;

  jobArrays: jobs[] = new Array();
  imageObject = [{
    image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/how_to_become_a_software_engineer.jpg',
    thumbImage: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/how_to_become_a_software_engineer.jpg',
    title: 'Simplilearn How to Become a Software Engineer'
  }, {
    image: 'https://www.theladders.com/wp-content/uploads/coder_190517-1000x563.jpg',
    thumbImage: 'https://www.theladders.com/wp-content/uploads/coder_190517-1000x563.jpg'
  }, {
    image: 'https://www.bairesdev.com/wp-content/uploads/2020/02/How-to-Become-a-Software-Engineer-and-Not-Die-Trying-1024x683.png',
    thumbImage: 'https://www.bairesdev.com/wp-content/uploads/2020/02/How-to-Become-a-Software-Engineer-and-Not-Die-Trying-1024x683.png',
    title: 'How to Become a Software Engineer (and Thrive in The Process)'
  }, {
    image: 'https://www.ziprecruiter.com/blog/zrs-0005/blog/wp-content/uploads/2017/08/1050572700_Software-Engineer-628x419.jpg',
    thumbImage: 'https://www.ziprecruiter.com/blog/zrs-0005/blog/wp-content/uploads/2017/08/1050572700_Software-Engineer-628x419.jpg',
    title: 'Software Engineer have Duties and Responsibilities'
  }, {
    image: 'https://blog.galvanize.com/wp-content/uploads/2018/12/bigstock-222124441-710x530.jpg',
    thumbImage: 'https://blog.galvanize.com/wp-content/uploads/2018/12/bigstock-222124441-710x530.jpg'
  }, {
    image: 'https://www.mediavillage.com/media/articles/women_by_computer_screen_14202195290_4ac1d5a92b_b.jpg.1440x1000_q85_box-7%2C0%2C990%2C683_crop_detail.jpg',
    thumbImage: 'https://www.mediavillage.com/media/articles/women_by_computer_screen_14202195290_4ac1d5a92b_b.jpg.1440x1000_q85_box-7%2C0%2C990%2C683_crop_detail.jpg',
    title: 'one day women will change the software feild'
  }];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private jobService: jobService) { }

  ngOnInit() {
    this.getEndAllJob();
    this.getCompleteAllJob();
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }


    this.info = {
      token: this.tokenStorage.getToken(),
      username: this.tokenStorage.getUsername(),
      authorities: this.tokenStorage.getAuthorities()

      
    };
  }

  onSubmit() {
    console.log(this.form);

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);



    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        console.log(data.accessToken);
        console.log(data.username);
        console.log(data.authorities);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }


  getEndAllJob() {
    this.jobService.getPendingJobCount(this.tokenStorage.getUsername()).subscribe((data: any) => {

      if (!!data.length) {
        this.pendingJobcount = data.length;
      }
    });
  }

  getCompleteAllJob() {
    this.jobService.getCompleteJobCount(this.tokenStorage.getUsername()).subscribe((datacomplete: any) => {

      if (!!datacomplete.length) {
        this.competeJobCount = datacomplete.length;
        console.log(this.competeJobCount)
      }
    });
  }
}


