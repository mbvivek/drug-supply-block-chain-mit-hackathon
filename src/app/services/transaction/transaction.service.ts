import { Injectable } from '@angular/core';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class TransactionService {
  web3: any;
  constructor(web3Service: Web3Service) {
    this.web3 = web3Service.getWeb3();
  }

  deployContract(arguements, account) {
    // deploy the contract
    var options = {
      data: this.getBytecode(),
      arguments: arguements,
    };
    var abi = this.getABI();

    var contract = new this.web3.eth.Contract(abi, null, options);

    return contract
      .deploy(options)
      .send({
        from: account,
        gas: 4700000,
      })
      .then(function(instance) {
        if (instance) {
          // if contract is deployed, set the deployed address to the contract instance
          contract.options.address = instance.options.address;
          return contract;
        } else {
          throw 'Error deploying the contract!';
        }
      });
  }

  getContract(contractAddress) {
    var abi = this.getABI();
    var contract = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  getEvents(contractAddress) {
    let contract = this.getContract(contractAddress);
    return contract.getPastEvents(
      'allEvents',
      { filter: null, fromBlock: 0, toBlock: 'latest' },
      function(error, events) {
        return events;
      }
    );
  }

  getABI(): any {
    let abi = [
      {
        "inputs": [
          {
            "name": "_medicationId",
            "type": "bytes32"
          },
          {
            "name": "_fromOrganizationId",
            "type": "bytes32"
          },
          {
            "name": "_toOrganizationId",
            "type": "bytes32"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "id",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "medicationId",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "fromOrganizationId",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "toOrganizationId",
            "type": "bytes32"
          }
        ],
        "name": "CreateTransaction",
        "type": "event"
      }
    ];

    return abi;
  }

  getBytecode(): any {
    let bytecode =
      '60606040526040516060806101528339810160405280805190602001909190805190602001909190805190602001909190505042600181905550600154838383604051808581526020018460001916600019168152602001836000191660001916815260200182600019166000191681526020019450505050506040518091039020600081600019169055508260028160001916905550816003816000191690555080600481600019169055506004546000191660035460001916600254600019167fa3350aec64b78f27a56d6ef75833032c89249b144141f835e8785859eabf5c4f6001546000546040518083815260200182600019166000191681526020019250505060405180910390a450505060358061011d6000396000f3006060604052600080fd00a165627a7a72305820e58dd74b7f64a69fa66544aeb898ae6cd8c63fb1a58bdbce4e51b41c90817c3f0029';
    return bytecode;
  }
}
