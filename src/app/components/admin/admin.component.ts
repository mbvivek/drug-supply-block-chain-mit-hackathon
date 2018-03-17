import { Component, OnInit } from '@angular/core';
import kjua = require('kjua');
import { Router } from '@angular/router';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../../services/web3/web3.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { OrganizationService } from '../../services/organization/organization.service';

declare var $ :any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  userOrg: any;
  router: Router;
  uportService: UportService;
  uport: any;
  web3Service: Web3Service;
  web3: any;
  userService: UserService;
  organizationService: OrganizationService;
  localStorageService: LocalStorageService;
  applications: any;
  qr: any;
  selectedApplication: any;
  isReviewed: boolean;
  isApproved: boolean;
  isDeployed: boolean;
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
    this.selectedApplication = {};
    this.isReviewed = false;
    this.isApproved = false;
    this.isDeployed = false;
  }

  ngOnInit() {
    this.validateSession();
    this.loadApplications();
  }

  validateSession() {
    this.userOrg = this.localStorageService.getUserOrg();
    if (
      this.userOrg == null ||
      this.userOrg == 'undefined' ||
      this.userOrg == ''
    ) {
      alert('Session Invalid!');
      this.router.navigate(['login']);
    } else if (this.userOrg.orgType != 'ADMIN') {
      alert('Access Denied!');
      this.router.navigate(['login']);
    }
  }

  logout() {
    this.localStorageService.clearUserOrg();
    this.router.navigate(['login']);
  }

  loadApplications() {
    this.applications = [];
    let appls = this.localStorageService.getAllApplications();
    appls.forEach(appl => {
      if (appl.status != 'undefined' && appl.status == 'Pending') {
        this.applications.push(appl);
      }
    });
  }

  selectApplication(application) {
    this.selectedApplication = application;
  }

  approveApplication(event, form) {
    event.preventDefault();
    if (!form.valid) {
      alert('Invalid Data!');
      console.log(this.selectApplication);
      return;
    }
    if (this.selectedApplication.tokenValidity <= 0) {
      alert('Token Validity should be greater than 0');
      return;
    }
    this.localStorageService.changeApplicationStatus(
      this.selectedApplication,
      'Approved'
    );
    this.isApproved = true;
    let web3Address = this.web3Service.getWeb3Accounts()[
      this.localStorageService.getNoOfRegisteredUsers()
    ];
    let args = [
      this.selectedApplication['orgName'],
      this.selectedApplication['orgAddress'],
      this.selectedApplication['orgType'],
      this.selectedApplication['adminName'],
      this.selectedApplication['adminUportAddress'],
      web3Address,
    ];
    this.organizationService
      .deployContract(args, this.userOrg.adminWeb3Address)
      .then(contract => {
        this.localStorageService.saveContract('Organization', contract);
        this.localStorageService.incrementNoOfRegisteredUsers();
        this.isDeployed = true;
        this.organizationService
          .getEvents(contract.options.address)
          .then(events => {
            events.forEach(event => {
              this.localStorageService.saveEvent(event);
            });
            this.uportService.getUport().attestCredentials(
              {
                sub: this.selectedApplication['adminUportID'],
                claim: {
                  token: events[0].returnValues.id,
                },
                exp:
                  new Date().getTime() +
                  this.selectedApplication.tokenValidity * 24 * 60 * 60 * 1000, // Optional expiration
              },
              uri => {
                this.qr = kjua({
                  text: uri,
                  fill: '#000000',
                  size: 500,
                  back: 'rgba(255,255,255,1)',
                });
              }
            );
          });
      });
  }

  rejectApplication() {
    this.localStorageService.changeApplicationStatus(
      this.selectedApplication,
      'Approved'
    );
    this.refreshTable();
  }

  resetFlags() {
    this.isReviewed = false;
    this.isApproved = false;
    this.isDeployed = false;
  }

  refreshTable() {
    this.selectedApplication = {};
    this.loadApplications();
    this.resetFlags();
    $('#viewApplicationModal').modal('hide');
  }
}
