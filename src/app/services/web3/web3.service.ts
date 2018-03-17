import { Injectable } from '@angular/core';
var Web3 = require('web3');
var accounts = [];

@Injectable()
export class Web3Service {
  web3: any;
  accounts: any;
  constructor() {
    this.accounts = {};
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
    console.log('web3 initialized');
    // add testrpc accounts
    
    this.web3.eth.getAccounts(function(error, result) {
      if (error != null) {
        console.log("Couldn't get accounts");
      }
      accounts = result;
      console.log('web3 accounts initialized');
    });
  }

  getWeb3() {
    return this.web3;
  }

  getWeb3Accounts() {
    return accounts;
  }

}
