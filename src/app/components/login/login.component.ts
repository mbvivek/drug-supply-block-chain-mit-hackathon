import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import kjua = require('kjua');
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../../services/web3/web3.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  router: Router;
  uportService: UportService;
  uport: any;
  web3Service: Web3Service;
  web3: any;
  userService: UserService;
  organizationService: OrganizationService;
  localStorageService: LocalStorageService;
  qr: any;
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
  }

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    this.uport
      .requestCredentials(
        {
          requested: ['name'],
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
        // Do something
        console.log(credentials);
        // decode the MNID to get the address
        let address = this.uportService.decode(credentials.address).address;
        console.log(address);
        this.login(address);
      });
  }

  login(address) {
    let events = this.localStorageService.getAllEventsOfType(
      'CreateOrganization'
    );
    var userOrg = null;
    events.forEach(event => {
      if (
        event.returnValues.adminUportAddress.toLowerCase() ==
        address.toLowerCase()
      ) {
        userOrg = {
          adminName: event.returnValues.adminName,
          adminUportAddress: event.returnValues.adminUportAddress,
          adminWeb3Address: event.returnValues.adminWeb3Address,
          id: event.returnValues.id,
          name: event.returnValues.name,
          orgType: event.returnValues.orgType,
          physicalAddress: event.returnValues.physicalAddress,
          time: event.returnValues.time,
        };
      }
    });
    if (userOrg == null) {
      alert('Invalid Credentials!');
    } else if (userOrg.orgType == 'ADMIN') {
      this.localStorageService.saveUserOrg(userOrg);
      alert('Admin!');
      this.router.navigate(['admin']);
    } else {
      this.localStorageService.saveUserOrg(userOrg);
      alert('Org!');
      this.router.navigate(['home']);
    }
  }

  initAdminContract() {
    let adminUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b89';
    let adminWeb3Address = this.web3Service.getWeb3Accounts()[0];
    //deploy the system admin organization contract
    let args = [
      'SYSTEM_ADMIN',
      'DRUG SUPPLY BLOCK CHAIN',
      'ADMIN',
      'Vivek',
      adminUportAddress,
      adminWeb3Address,
    ];
    this.organizationService
      .deployContract(args, adminWeb3Address)
      .then(contract => {
        this.localStorageService.saveContract('organization', contract);
        this.localStorageService.incrementNoOfRegisteredUsers();
        this.organizationService
          .getEvents(contract.options.address)
          .then(events => {
            events.forEach(event => {
              this.localStorageService.saveEvent(event);
              alert('Done!');
            });
          });
      });
  }

  initManufacturerContract() {
    let manufacturerUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b00';
    let manufacturerWeb3Address = this.web3Service.getWeb3Accounts()[1];
    //deploy the system admin organization contract
    let args = [
      '123 Manufacturers',
      'Boston',
      'Manufacturer',
      'Manufacturer Admin',
      manufacturerUportAddress,
      manufacturerWeb3Address,
    ];
    this.organizationService
      .deployContract(args, this.web3Service.getWeb3Accounts()[0])
      .then(contract => {
        this.localStorageService.saveContract('organization', contract);
        this.localStorageService.incrementNoOfRegisteredUsers();
        this.organizationService
          .getEvents(contract.options.address)
          .then(events => {
            events.forEach(event => {
              this.localStorageService.saveEvent(event);
              alert('Done!');
            });
          });
      });
  }

  initDistributorContract() {
    let distributorUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b01';
    let distributorWeb3Address = this.web3Service.getWeb3Accounts()[2];
    //deploy the system admin organization contract
    let args = [
      'ABC Dictributors',
      'Boston',
      'Distributor',
      'Distributor Admin',
      distributorUportAddress,
      distributorWeb3Address,
    ];
    this.organizationService
      .deployContract(args, this.web3Service.getWeb3Accounts()[0])
      .then(contract => {
        this.localStorageService.saveContract('organization', contract);
        this.localStorageService.incrementNoOfRegisteredUsers();
        this.organizationService
          .getEvents(contract.options.address)
          .then(events => {
            events.forEach(event => {
              this.localStorageService.saveEvent(event);
              alert('Done!');
            });
          });
      });
  }

  initPharmacyContract() {
    let pharmacyUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b02';
    let pharmacyWeb3Address = this.web3Service.getWeb3Accounts()[2];
    //deploy the system admin organization contract
    let args = [
      'XYZ Pharmacy',
      'Boston',
      'Pharmacy',
      'Pharmacy Admin',
      pharmacyUportAddress,
      pharmacyWeb3Address,
    ];
    this.organizationService
      .deployContract(args, this.web3Service.getWeb3Accounts()[0])
      .then(contract => {
        this.localStorageService.saveContract('organization', contract);
        this.localStorageService.incrementNoOfRegisteredUsers();
        this.organizationService
          .getEvents(contract.options.address)
          .then(events => {
            events.forEach(event => {
              this.localStorageService.saveEvent(event);
              alert('Done!');
            });
          });
      });
  }

  loginAdmin() {
    let adminUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b89';
    this.login(adminUportAddress);
  }

  loginManufacturer() {
    let manufacturerUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b00';
    this.login(manufacturerUportAddress);
  }

  loginDistributor() {
    let distributorUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b01';
    this.login(distributorUportAddress);
  }

  loginPharmacy() {
    let pharmacyUportAddress = '0x1eeff7744cda94dd1878cb29f2660a7bc7481b02';
    this.login(pharmacyUportAddress);
  }
}
