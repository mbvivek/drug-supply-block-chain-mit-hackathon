import { Component, OnInit } from '@angular/core';
import kjua = require('kjua');
import { Router } from '@angular/router';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../../services/web3/web3.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  router: Router;
  uportService: UportService;
  uport: any;
  web3Service: Web3Service;
  web3: any;
  business: any;
  qr: any;
  isQRCScanned: boolean;
  isApplicationComplete: boolean;
  application: any;
  userService: UserService;
  organizationService: OrganizationService;
  localStorageService: LocalStorageService;

  constructor(
    router: Router,
    uportService: UportService,
    web3Service: Web3Service,
    userService: UserService,
    localStorageService: LocalStorageService,
    organizationService: OrganizationService
  ) {
    this.router = router;
    this.uportService = uportService;
    this.uport = uportService.getUport();
    this.web3Service = web3Service;
    this.web3 = web3Service.getWeb3();
    this.userService = userService;
    this.localStorageService = localStorageService;
    this.organizationService = organizationService;
    this.isQRCScanned = false;
    this.isApplicationComplete = false;
    this.application = {
      orgName: null,
      orgAddress: null,
      orgType: null,
      adminName: null,
      adminUportAddress: null,
      email: null,
      phone: null,
      date: null,
      status: null,
    };
  }

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    this.uportService.uport
      .requestCredentials(
        {
          requested: ['name', 'phone', 'email'],
          notifications: false,
        },
        uri => {
          this.qr = kjua({
            text: uri,
            fill: '#000000',
            size: 500,
            back: 'rgba(255,255,255,1)',
          });
        }
      )
      .then(credentials => {
        console.log(credentials);
        this.application.adminUportID = credentials.address;
        this.application.adminUportAddress = this.uportService.decode(
          credentials.address
        ).address;
        this.application.adminName = credentials.name;
        this.application.email = credentials.email;
        this.application.phone = credentials.phone;
        this.isQRCScanned = true;
      });
  }

  reloadQRC(event, form) {
    event.preventDefault();
    this.generateQRCode();
    this.isQRCScanned = false;
    form.reset();
  }

  onSubmit(event, form) {
    event.preventDefault();
    if (!form.valid) {
      alert('Invalid Data!');
      console.log(this.application);
      return;
    }
    this.application.date = new Date();
    this.application.status = 'Pending';
    this.localStorageService.saveApplication(this.application);
    console.log(this.application);
    this.isApplicationComplete = true;
  }
}
