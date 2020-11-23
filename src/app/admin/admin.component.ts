import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../auth/token-storage.service';
import { jobs } from '../model/jobmodel';
import { User } from '../model/usermodel';
import { jobService } from '../services/job.service';
import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';
import { isNull } from 'util';
import { developerSbu } from '../model/developerSbu';
import { developerLocations } from '../model/developerLocations';
import { sbuService } from '../services/sbu.service';
import { UserComponent } from '../user/user.component';





export class CityObj {
  dist: string;
  city: any[];


}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  myDate = Date.now();    //date 
  board: string;
  errorMessage: string;
  info: any;

  createjob: boolean = true;
  finalizejob: boolean = false;

  @ViewChild('sbu') sbu: ElementRef;
  @ViewChild('department') department: ElementRef;

  @ViewChild('useNamePdf') useNamePdf: ElementRef;
  @ViewChild('date') date: ElementRef;

  alertSucess: boolean = false;

  // district: any[] = environment.district;
  distlbl: String = '';
  citylbl_1: any[] = new Array();
  citylbl_2: CityObj;

  jobObj: jobs;

  descri: string = "";





  jobArrays: jobs[] = new Array();
  jobArrays2: jobs[] = new Array();

  userNameArray: User[] = new Array();


  objSbu: developerSbu;
  objDepartment: developerLocations;

  public developerSbu: developerSbu[];
  public developerDepartment: developerLocations[];


  userForm = new FormGroup({
    sbu: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    divDate: new FormControl('', Validators.required)
  });

  pdfForm = new FormGroup({
    useNamePdf: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  });


  get Sbu() {
    return this.userForm.get('sbu');
  }
  get Description() {
    return this.userForm.get('description');
  }
  get Department() {
    return this.userForm.get('department');
  }

  get Date() {
    return this.userForm.get('date');
  }
  get Time() {
    return this.userForm.get('time');
  }

  get UserName() {
    return this.userForm.get('username');
  }

  get UserNamePdf() {
    return this.userForm.get('usernamePdf');
  }

  get divDate() {
    return this.userForm.get('divDate');
  }

  registerForm: FormGroup;

  dtOptions: DataTables.Settings = {};

  today: Date;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private AdminService: AdminService, private token: TokenStorageService, private jobService: jobService, private sbuService: sbuService) {
    this.today = new Date();
  }


  onChange(evt) {
    this.citylbl_1 = new Array();
    this.sbuService.getDepartment(evt).subscribe(res => {
      this.developerDepartment = res;
      console.log(res);

      this.developerDepartment.forEach(e => {
        this.citylbl_1.push(e);
        console.log(e);
      });

    });



  }


  ngOnInit() {
    this.getAllJobs();
    this.getEndAllJob();
    this.getAllUserNames();
    this.userService.getUserBoard().subscribe(
      data => {
        this.board = data;
      },
      error => {
        this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
      }
    );

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };

    this.registerForm = this.formBuilder.group({
      description: ['', []],
      date: ['', []],
      div_date: ['', []],
      time: ['', []],

    });
    // this.onChange('830 - Head Office');

    this.getSbu();
  }

  getSbu() {
    this.objSbu = new developerSbu;
    this.objDepartment = new developerLocations;
    this.sbuService.getSbu().subscribe(res => {

      this.developerSbu = res
      console.log(res);
      this.onChange(res);

    });
  }






  save() {
    var _submitFlg: boolean = true;
    var _submitErrorMsg: string = "";

    if (this.registerForm.get('description').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "Description is empty"
    }
    if (this.registerForm.get('date').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "Date is empty"
    }
    if (this.registerForm.get('time').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "Time period is empty"
    }

    if (this.registerForm.get('username').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "username is empty"
    }

    if (this.registerForm.get('divDate').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "Div Date is Empty..!";
    }

    if (_submitFlg && confirm("Sure you want to pickup this job....?")) {

      this.jobObj = new jobs;

      this.jobObj.decription = this.registerForm.get('description').value;
      this.jobObj.cre_dt = this.registerForm.get('date').value;
      this.jobObj.time_period = this.registerForm.get('time').value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.sbu.nativeElement.value;
      console.log(this.sbu.nativeElement.value);
      this.jobObj.department = this.department.nativeElement.value;
      this.jobObj.mod_by = this.registerForm.get('username').value;
      this.jobObj.div_date = this.registerForm.get('div_date').value;
      console.log(this.registerForm.get('div_date').value)

      this.jobService.sendJobByAdmin(this.jobObj).subscribe(Response => {
        this.descri = Response.decription;
        if (this.descri != "") {
          alert("Sucess..!");
          this.alertSucess = true;
          this.registerForm.reset();
        }
      });
    } else if (!_submitFlg) {
      alert(_submitErrorMsg);
      _submitFlg = true;
      _submitErrorMsg = "";
    }
  }

  getAllUserNames() {
    this.AdminService.getAllUserName().subscribe(response => {
      this.userNameArray = new Array();
      console.log(response)
      response.forEach(users => {
        let userModel: User = new User();

        userModel.name = users.name;

        this.userNameArray.push(userModel);


      });
    });
  }

  clear() {
    this.Department.reset();
    this.Description.reset();
    this.Sbu.reset();
    this.Time.reset();
    this.UserName.reset();
  }


  getAllJobs() {

    this.AdminService.getAllPendingJobs().subscribe(response => {

      this.jobArrays = new Array();
      console.log(response)
      response.forEach(job => {
        let jobModel: jobs = new jobs();

        jobModel.decription = job.decription;
        jobModel.cre_dt = job.cre_dt;
        jobModel.time_period = job.time_period;
        jobModel.cre_by = job.cre_by;
        jobModel.job_id = job.id;
        jobModel.sbu = job.sbu;
        jobModel.department = job.department;
        jobModel.div_date = job.div_date;
        this.jobArrays.push(jobModel);

      });

    });
  }

  getEndAllJob() {
    this.AdminService.getAllEndJobs().subscribe(response => {

      this.jobArrays2 = new Array();
      console.log(response)
      response.forEach(job => {
        let jobModel: jobs = new jobs();

        jobModel.decription = job.decription;
        jobModel.cre_dt = job.cre_dt;
        jobModel.time_period = job.time_period;
        jobModel.cre_by = job.cre_by;
        jobModel.job_id = job.id;
        jobModel.sbu = job.sbu;
        jobModel.department = job.department;
        jobModel.div_date = job.div_date;
        this.jobArrays2.push(jobModel);

      });

    });
  }

  genPdf() {
    console.log(this.pdfForm.get('useNamePdf').value);
    console.log(this.pdfForm.get('date').value);
    this.AdminService._genPdf(this.pdfForm.get('useNamePdf').value, this.pdfForm.get('date').value).subscribe((data: Blob) => {
      if (isNull(data)) {
        // this.msgErrorEmpty();
      } else {
        var file = new Blob([data], { type: 'application/pdf' })
        var fileURL = URL.createObjectURL(file);

        // if you want to open PDF in new tab
        window.open(fileURL);
        var a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = 'DailyReport.pdf';
        document.body.appendChild(a);
        a.click();
      }

    },
      (error) => {
        console.log('getPDF error: ', error);
      }
    );
  }



  saveUserJob() {

    if (this.userForm.valid) {
      this.jobObj = new jobs;
      this.jobObj.decription = this.Description.value;
      this.jobObj.cre_dt = this.Date.value;
      this.jobObj.time_period = this.Time.value;
      this.jobObj.div_date = this.divDate.value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.Sbu.value;
      this.jobObj.department = this.Department.value;
      this.jobObj.mod_by = this.UserName.value;

      console.log(this.jobObj);

      this.jobService.sendJobByAdmin(this.jobObj).subscribe(Response => {
        this.descri = Response.decription;
        if (this.descri != "") {
          this.msgSucssAlert();
          this.Department.reset();
          this.Description.reset();
          this.Sbu.reset();
          this.Time.reset();
          this.UserName.reset();
          this.getAllJobs();

          // this.userComponent.getAllJobs();

        } else {
          this.msgErrorAlert();
        }
      });
    } else {
      this.msgErrorValidAlert();
    }
  }
  selectJob(job: jobs) {
    console.log(job);
    this.createjob = false;
    this.finalizejob = true;
    this.Sbu.setValue(job.sbu);
    this.Department.setValue(job.department);
    this.Description.setValue(job.decription);
    this.Date.setValue(job.cre_dt);
    this.Time.setValue(job.time_period);


  }

  msgErrorValidAlert() {
    Swal.fire({
      // icon: 'error',
      title: 'Oops...',
      text: 'Sorry Fail Validation!',
    })

  }

  msgErrorAlert() {
    Swal.fire({
      // icon: 'error',
      title: 'Oops...',
      text: 'Sorry this Job Not Save!',
    });
  }

  msgErrorEmpty() {
    Swal.fire({
      // icon: 'error',
      title: 'Oops...',
      text: 'Havent job this period!',
    });
  }

  msgSucssAlert() {
    Swal.fire({
      title: 'Sure you want to assign this job....?',
      text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.dismiss) {
        Swal.fire(
          'Saved!',
          'Your file has been save.',
          'success'
        )
      }
    })
  }

}
