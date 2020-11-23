import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';

import { TokenStorageService } from '../auth/token-storage.service';
import { jobs } from '../model/jobmodel';
import { jobService } from '../services/job.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Location } from '@angular/common';
import { developerSbu } from '../model/developerSbu';
import { developerLocations } from '../model/developerLocations';
import { sbuService } from '../services/sbu.service';

export class CityObj {
  dist: string;
  city: any[];


}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DatePipe]
})

export class UserComponent implements OnInit {
  myDate = Date.now();    //date 
  board: string;
  errorMessage: string;
  info: any;

  createjob: boolean = true;
  finalizejob: boolean = false;
  getJob: boolean = false;

  @ViewChild('sbu') sbu: ElementRef;
  @ViewChild('department') department: ElementRef;

  alertSucess: boolean = false;

  distlbl: String = '';
  citylbl_1: any[] = new Array();
  citylbl_2: CityObj;

  jobObj: jobs;

  jobId: string;

  descri: string = "";

  objSbu: developerSbu;
  objDepartment: developerLocations;

  public developerSbu: developerSbu[];
  public developerDepartment: developerLocations[];



  jobArrays: jobs[] = new Array();
  jobArraysComplete: jobs[] = new Array();
  jobArrays2: jobs[] = new Array();

  editable: boolean = true;

  userForm = new FormGroup({
    sbu: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
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


  registerForm: FormGroup;

  dtOptions: DataTables.Settings = {};

  today: Date;


  constructor(private formBuilder: FormBuilder, private userService: UserService, private token: TokenStorageService, private jobService: jobService, private location: Location, private sbuService: sbuService) {
    this.today = new Date();
    this.getAllJobs();
  }

  pageRefresh() {
    location.reload();
  }


  // onChange(deviceValue) {
  //   this.distlbl = deviceValue;

  //   this.citylbl_1 = new Array();
  //   this.district.filter(val => val.dist == this.distlbl).forEach(e => e.city.forEach(e1 => this.citylbl_1.push(e1)));



  // }

  onChange(evt) {
    this.citylbl_1 = new Array();
    this.sbuService.getDepartment(evt).subscribe(res => {
      this.developerDepartment = res;
      console.log(res);

      this.developerDepartment.forEach(e => {
        this.citylbl_1.push(e);
        console.log(e);
      });
      // "let di of distric" value="{{di.locname}}

      // this.district.filter(val => val.dist == this.distlbl).forEach(e => e.city.forEach(e1 => this.citylbl_1.push(e1)));
      // this.district.forEach(e => e.locname.forEach(e1 => this.citylbl_1.push(e1)));
    });



  }


  ngOnInit() {
    this.getAllJobs();
    this.getEndAllJob();
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
      // firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      description: ['', []],
      date: ['', Validators.required, Validators.pattern("^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$")],
      div_date: ['', []],
      time: ['', []],

    });
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

  get f() { return this.registerForm.controls; }


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
    if (this.registerForm.get('time').value.trim().length <= 0) {
      _submitFlg = false;
      _submitErrorMsg = "Time period is empty"
    }

    // if (this.registerForm.get('divDate').value.trim().length <= 0) {
    //   _submitFlg = false;
    //   _submitErrorMsg = "Div Date is Empty..!";
    // }

    if (_submitFlg && confirm("Sure you want to pickup this job....?")) {

      this.jobObj = new jobs;

      this.jobObj.decription = this.registerForm.get('description').value;
      this.jobObj.cre_dt = this.registerForm.get('date').value;
      this.jobObj.time_period = this.registerForm.get('time').value;
      // this.jobObj.div_date = this.registerForm.get('div_date').value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.sbu.nativeElement.value;
      console.log(this.sbu.nativeElement.value);
      this.jobObj.department = this.department.nativeElement.value;

      this.jobService.sendJob(this.jobObj).subscribe(Response => {
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


  getAllJobs() {

    this.jobService.getAllJobs(this.token.getUsername()).subscribe(response => {

      this.jobArrays = new Array();
      console.log(response)
      response.forEach(job => {
        let jobModel: jobs = new jobs();

        console.log(job.job_id)

        jobModel.decription = job.decription;
        jobModel.cre_dt = job.cre_dt;
        jobModel.time_period = job.time_period;
        jobModel.cre_by = job.cre_by;
        jobModel.job_id = job.job_id;
        jobModel.sbu = job.sbu;
        jobModel.div_date = job.div_date;
        jobModel.department = job.department;
        this.jobArrays.push(jobModel);

      });

    });
  }

  getEndAllJob() {
    this.jobService.getAllEndJobs(this.token.getUsername()).subscribe(response => {

      this.jobArrays2 = new Array();
      this.jobArraysComplete = new Array();
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
        this.jobArraysComplete.push(jobModel);

      });

    });
  }


  saveUserJob() {

    if (this.userForm.valid) {
      this.jobObj = new jobs;
      this.jobObj.decription = this.Description.value;
      this.jobObj.cre_dt = this.Date.value;
      this.jobObj.time_period = this.Time.value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.Sbu.value;
      this.jobObj.department = this.Department.value;

      console.log(this.jobObj);

      this.jobService.sendJob(this.jobObj).subscribe(Response => {
        this.descri = Response.decription;
        if (this.descri != "") {
          this.msgSucssAlert();
          this.Sbu.reset();
          this.Time.reset();
          this.Description.reset();
          this.Department.reset();
          this.getAllJobs();
          this.getEndAllJob();
        } else {
          this.msgErrorAlert();
        }
      });
    } else {
      this.msgErrorValidAlert();
    }
  }

  updateTodayDo() {

    this.editable = false;

    console.log(this.editable)

    if (this.userForm.valid) {
      this.jobObj = new jobs;
      this.jobObj.decription = this.Description.value;
      this.jobObj.cre_dt = this.Date.value;
      this.jobObj.time_period = this.Time.value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.Sbu.value;
      this.jobObj.department = this.Department.value;



      this.jobService.updateJob(this.jobId, this.jobObj).subscribe(Response => {
        this.descri = Response.decription;
        if (this.descri != "") {
          this.msgSucssAlert();
          this.userForm.reset();
          this.getAllJobs();
          this.getEndAllJob();
          this.createjob = true;
          this.finalizejob = false;
          this.getJob = false;

        } else {
          this.msgErrorAlert();
        }
      });
    } else {
      this.msgErrorValidAlert();
    }
  }
  updateFinalize() {



    if (this.userForm.valid) {
      this.jobObj = new jobs;
      this.jobObj.decription = this.Description.value;
      this.jobObj.cre_dt = this.Date.value;
      this.jobObj.time_period = this.Time.value;
      this.jobObj.cre_by = this.token.getUsername();
      this.jobObj.job_id = this.token.getUsername();
      this.jobObj.sbu = this.Sbu.value;
      this.jobObj.department = this.Department.value;


      this.jobService.updateJobFianl(this.jobId, this.jobObj).subscribe(Response => {
        this.descri = Response.decription;
        if (this.descri != "") {
          this.msgSucssAlert();
          this.userForm.reset();
          this.getAllJobs();
          this.getEndAllJob();

          this.createjob = true;
          this.finalizejob = false;
          this.getJob = false;

        } else {
          this.msgErrorAlert();
        }
      });
    } else {
      this.msgErrorValidAlert();
    }
  }

  clear() {
    this.Sbu.reset();
    this.Time.reset();
    this.Description.reset();
    this.Department.reset();
  }

  selectJob(job: jobs) {
    this.editable = false;
    this.createjob = false;
    this.getJob = true;
    this.Sbu.setValue(job.sbu);
    this.Department.setValue(job.department);
    this.Description.setValue(job.decription);
    this.Date.setValue(job.cre_dt);
    this.Time.setValue(job.time_period);
    this.jobId = job.job_id;
    console.log(this.editable)
  }

  selectJobs(job: jobs) {
    this.editable = false;
    this.createjob = false;
    this.finalizejob = true;
    this.Sbu.setValue(job.sbu);
    this.Department.setValue(job.department);
    this.Description.setValue(job.decription);
    this.Date.setValue(job.cre_dt);
    this.Time.setValue(job.time_period);
    this.jobId = job.job_id;
    console.log(this.editable)
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


