import { Injectable } from '@angular/core';
var noOfUsersRegistered = 0;

@Injectable()
export class LocalStorageService {
  business: {};
  constructor() {
    localStorage.clear();
    this.business = this.getBusiness();
  }

  getBusiness() {
    if (
      localStorage == undefined ||
      localStorage.business == undefined ||
      localStorage.business == ''
    ) {
      let initData = {
        contracts: [],
        events: [],
        userOrg: "",
        applications: [],
      };
      localStorage.clear();
      this.saveBusiness(initData);
    }
    return JSON.parse(localStorage.getItem('business'));
  }

  saveBusiness(business) {
    localStorage.setItem('business', JSON.stringify(business));
  }

  saveContract(type, contract) {
    console.log('saving contract');
    console.log(contract);
    var business = this.getBusiness();
    business.contracts.push({
      type: type,
      contract: contract,
    });
    this.saveBusiness(business);
  }

  getAllContracts(): any[] {
    var business = this.getBusiness();
    return business['contracts'];
  }

  getAllContractsOfType(type) {
    var contracts = [];
    this.getAllContracts().forEach(contract => {
      if (contract.type == type) {
        contracts.push(contract);
      }
    });
    return contracts;
  }

  saveEvent(event) {
    var business = this.getBusiness();
    business['events'].push(event);
    this.saveBusiness(business);
  }

  getAllEvents(): any[] {
    var business = this.getBusiness();
    return business['events'];
  }

  getAllEventsOfType(type) {
    var events = [];
    this.getAllEvents().forEach(event => {
      if (event.event == type) {
        events.push(event);
      }
    });
    return events;
  }

  getUserOrg() {
    let business = this.getBusiness();
    return business['userOrg'];
  }

  saveUserOrg(userOrg) {
    var business = this.getBusiness();
    business['userOrg'] = userOrg;
    this.saveBusiness(business);
  }

  clearUserOrg() {
    var business = this.getBusiness();
    business['userOrg'] = "";
    this.saveBusiness(business);
  }

  getAllApplications() {
    let business = this.getBusiness();
    return business['applications'];
  }

  saveApplication(application) {
    var business = this.getBusiness();
    business['applications'].push(application);
    this.saveBusiness(business);
  }

  changeApplicationStatus(application, status) {
    var business = this.getBusiness();
    var idx = 0;
    business['applications'].forEach(_application => {
      console.log('idx = ' + idx);
      console.log(
        '_application.adminUportAddress = ' + _application.adminUportAddress
      );
      console.log(
        'application.adminUportAddress = ' + application.adminUportAddress
      );
      if (
        _application.adminUportAddress == application.adminUportAddress &&
        _application.date == application.date
      ) {
        console.log('found!');
        business['applications'][idx].status = status;
      }
      idx++;
    });
    this.saveBusiness(business);
  }

  getNoOfRegisteredUsers() {
    return noOfUsersRegistered;
  }

  incrementNoOfRegisteredUsers() {
    noOfUsersRegistered++;
  }
}
