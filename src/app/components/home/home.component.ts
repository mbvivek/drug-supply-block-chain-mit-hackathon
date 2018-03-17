import { Component, OnInit } from '@angular/core';
import kjua = require('kjua');
import { Router } from '@angular/router';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../../services/web3/web3.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { MedicationService } from '../../services/medication/medication.service';
import { TransactionService } from '../../services/transaction/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userOrg: any;
  router: Router;
  uportService: UportService;
  uport: any;
  web3Service: Web3Service;
  web3: any;
  userService: UserService;
  organizationService: OrganizationService;
  localStorageService: LocalStorageService;
  medicationService: MedicationService;
  transactionService: TransactionService;
  selectedView: any;
  isManufacturer: boolean;
  medicationToCreate: any;
  transactionToCreate: any;
  medicationsInInventory: any;
  otherOrganizations: any;
  medicationToSend: any;
  medicationToCheck: any;
  medicationToCheckTxs: any;
  constructor(
    router: Router,
    uportService: UportService,
    web3Service: Web3Service,
    userService: UserService,
    localStorageService: LocalStorageService,
    organizationService: OrganizationService,
    medicationService: MedicationService,
    transactionService: TransactionService
  ) {
    this.router = router;
    this.uportService = uportService;
    this.uport = uportService.getUport();
    this.web3Service = web3Service;
    this.web3 = web3Service.getWeb3();
    this.userService = userService;
    this.localStorageService = localStorageService;
    this.medicationService = medicationService;
    this.transactionService = transactionService;
    this.selectedView = 'manageMedication';
    this.isManufacturer = false;
    this.medicationsInInventory = [];
    this.otherOrganizations = [];
    this.medicationToSend = {
      medicationId: null,
      organizationId: null,
    };
    this.medicationToCheck = null;
    this.medicationToCheckTxs = [];
    this.transactionToCreate = {
      medicationId: null,
      fromOrg: null,
      toOrg: null,
    };
    this.medicationToCreate = {
      name: null,
      manufacturer: null,
      manufacturedDate: null,
      expirationDate: null,
      status: null,
    };
  }

  ngOnInit() {
    this.validateSession();
    this.getMedicationsInInventory();
    this.getOtherOrganizations();
  }

  validateSession() {
    this.userOrg = this.localStorageService.getUserOrg();
    if (this.userOrg == null || this.userOrg == '' || this.userOrg == {}) {
      this.router.navigate(['login']);
    }
    if (this.userOrg.orgType == 'Manufacturer') {
      this.isManufacturer = true;
    }
  }

  logout() {
    this.localStorageService.clearUserOrg();
    this.router.navigate(['login']);
  }

  resetCreateMedication() {
    this.medicationToCreate = {
      name: null,
      manufacturer: null,
      manufacturedDate: null,
      expirationDate: null,
      status: null,
    };
  }

  createMedication(event, form) {
    event.preventDefault();
    if (!form.valid) {
      alert('Invalid Data!');
      console.log(this.medicationToCreate);
      return;
    }
    let args = [
      this.medicationToCreate.name,
      this.userOrg.id,
      this.medicationToCreate.manufacturedDate,
      this.medicationToCreate.expirationDate,
      this.medicationToCreate.status,
    ];
    console.log(args);
    let approver = this.userOrg.adminWeb3Address;
    this.medicationService.deployContract(args, approver).then(contract => {
      console.log('medication contract deployed successfully!');
      this.medicationService
        .getEvents(contract.options.address)
        .then(events => {
          let medId = events[0].returnValues.id;
          let fromOrg = this.userOrg.id;
          let toOrg = this.userOrg.id;
          alert('Medication deployed successfully! ( ID: ' + medId + ')');
          let txArgs = [medId, fromOrg, toOrg];
          console.log('txArgs = ');
          console.log(txArgs);
          this.createTransaction(txArgs, approver);
          this.resetCreateMedication();
          events.forEach(event => {
            this.localStorageService.saveEvent(event);
          });
        });
    });
  }

  createTransaction(args, account) {
    this.transactionService.deployContract(args, account).then(contract => {
      console.log('transaction contract deployed successfully!');
      this.transactionService
        .getEvents(contract.options.address)
        .then(events => {
          let txId = events[0].returnValues.id;
          alert('Transaction deployed successfully! ( ID: ' + txId + ')');
          events.forEach(event => {
            this.localStorageService.saveEvent(event);
          });
        });
    });
  }

  getMedicationsInInventory() {
    console.log('getMedicationsInInventory');
    this.medicationsInInventory = [];
    let medEvents = this.localStorageService.getAllEventsOfType(
      'CreateMedication'
    );
    for (let medEvent of medEvents) {
      var lastTx = this.getLastTransactionOfMedication(
        medEvent.returnValues.id
      );
      console.log('lastTx');
      console.log(lastTx);
      if (
        lastTx != null &&
        lastTx.returnValues.toOrganizationId == this.userOrg.id
      ) {
        this.medicationsInInventory.push(medEvent.returnValues);
      }
      console.log(
        'medicationsInInventory = ' + this.medicationsInInventory.length
      );
    }
  }

  getLastTransactionOfMedication = function(medId) {
    console.log('getLastTransactionOfMedication ' + medId);
    var tx = null;
    var logs = this.getAllTransactionsOfMedication(medId);
    if (logs.length > 0) {
      tx = logs[logs.length - 1];
    }
    return tx;
  };

  getAllTransactionsOfMedication(medId) {
    var txs = [];
    let logs = this.localStorageService.getAllEventsOfType('CreateTransaction');
    for (let log of logs) {
      if (log.returnValues.medicationId == medId) {
        txs.push(log);
      }
    }
    return txs;
  }

  getOtherOrganizations() {
    this.otherOrganizations = [];
    var orgEvents = this.localStorageService.getAllEventsOfType(
      'CreateOrganization'
    );
    for (let orgEvent of orgEvents) {
      if (orgEvent.returnValues.id != this.userOrg.id && orgEvent.returnValues.orgType != 'ADMIN') {
        this.otherOrganizations.push(orgEvent.returnValues);
      }
    }
    console.log('otherOrganizations = ' + this.otherOrganizations.length);
  }

  resetMedicationToSend() {
    this.medicationToSend.medicationId = null;
    this.medicationToSend.organizationId = null;
  }

  sendMedication(event, form) {
    event.preventDefault();
    if (!form.valid) {
      alert('Invalid Data!');
      console.log(this.medicationToCreate);
      return;
    }
    console.log(this.medicationToSend);
    let args = [
      this.medicationToSend.medicationId,
      this.userOrg.id,
      this.medicationToSend.organizationId,
    ];
    let account = this.userOrg.adminWeb3Address;
    this.createTransaction(args, account);
    this.resetMedicationToSend();
    this.selectedView = 'manageMedication';
  }

  checkMedication(event, form) {
    event.preventDefault();
    if (!form.valid) {
      alert('Invalid Data!');
      console.log(this.medicationToCheck);
      return;
    }
    this.medicationToCheckTxs = this.getAllTransactionsOfMedication(
      this.medicationToCheck
    );
    console.log(this.medicationToCheckTxs);
  }

  getOrgName(orgId) {
    var orgName = '';
    let orgEvents = this.localStorageService.getAllEventsOfType(
      'CreateOrganization'
    );
    for (let orgEvent of orgEvents) {
      if (orgEvent.returnValues.id == orgId) {
        orgName = orgEvent.returnValues.name;
        break;
      }
    }
    return orgName;
  }
}
