import { Injectable } from '@angular/core';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class UserService {
  uportService: UportService;
  uport: any;
  web3Service: Web3Service;
  web3: any;
  constructor(uportService: UportService, web3Service: Web3Service) {
    this.uportService = uportService;
    this.web3Service = web3Service;
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
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_uportAddress",
            "type": "address"
          },
          {
            "name": "_web3Address",
            "type": "address"
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
            "indexed": false,
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "uportAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "web3Address",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "CreateUser",
        "type": "event"
      }
    ];

    return abi;
  }

  getBytecode(): any {
    let bytecode =
      '60606040526040516104db3803806104db83398101604052808051820191906020018051906020019091908051906020019091905050426001819055506001548383836040518085815260200184805190602001908083835b60208310151561007d5780518252602082019150602081019050602083039250610058565b6001836020036101000a0380198251168184511680821785525050505050509050018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401945050505050604051809103902060008160001916905550826002908051906020019061014f9291906103f3565b5081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fa33f74b6024eb6d31e53ba35c44922caea118262b71e864919f41a921f81dcf46001546000546002600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808781526020018660001916600019168152602001806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281038252868181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156103d85780601f106103ad576101008083540402835291602001916103d8565b820191906000526020600020905b8154815290600101906020018083116103bb57829003601f168201915b505097505050505050505060405180910390a1505050610498565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061043457805160ff1916838001178555610462565b82800160010185558215610462579182015b82811115610461578251825591602001919060010190610446565b5b50905061046f9190610473565b5090565b61049591905b80821115610491576000816000905550600101610479565b5090565b90565b6035806104a66000396000f3006060604052600080fd00a165627a7a72305820724b040a4995dfa3f506674cdeffab13c4d7bd98b27d2452cf9e2c728d3c12c10029';
    return bytecode;
  }
}

