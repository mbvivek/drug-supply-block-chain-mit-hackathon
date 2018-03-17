import { Injectable } from '@angular/core';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class MedicationService {
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
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_manufacturerId",
            "type": "bytes32"
          },
          {
            "name": "_manufacturedDate",
            "type": "string"
          },
          {
            "name": "_expirationDate",
            "type": "string"
          },
          {
            "name": "_status",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
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
            "indexed": true,
            "name": "id",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "name",
            "type": "string"
          },
          {
            "indexed": true,
            "name": "manufacturerId",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "manufacturedDate",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "expirationDate",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "status",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "CreateMedication",
        "type": "event"
      }
    ];

    return abi;
  }

  getBytecode(): any {
    let bytecode =
      '6060604052341561000f57600080fd5b6040516105ac3803806105ac8339810160405280805182019190602001805190602001909190805182019190602001805182019190602001805182019190505042600181905550600154858585856040518086815260200185805190602001908083835b6020831015156100985780518252602082019150602081019050602083039250610073565b6001836020036101000a038019825116818451168082178552505050505050905001846000191660001916815260200183805190602001908083835b6020831015156100f957805182526020820191506020810190506020830392506100d4565b6001836020036101000a03801982511681845116808217855250505050505090500182805190602001908083835b60208310151561014c5780518252602082019150602081019050602083039250610127565b6001836020036101000a03801982511681845116808217855250505050505090500195505050505050604051809103902060008160001916905550846002908051906020019061019d9291906104c4565b50836003816000191690555082600490805190602001906101bf9291906104c4565b5081600590805190602001906101d69291906104c4565b5080600690805190602001906101ed9291906104c4565b5033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508360001916600054600019167fd3c9f8f6f9dfbff929362c2b954cb15d8cb9ec054bddd76fbd26cf55db02ab9b600154888760056006600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660405180878152602001806020018060200180602001806020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185810385528a818151815260200191508051906020019080838360005b8381101561030c5780820151818401526020810190506102f1565b50505050905090810190601f1680156103395780820380516001836020036101000a031916815260200191505b50858103845289818151815260200191508051906020019080838360005b83811015610372578082015181840152602081019050610357565b50505050905090810190601f16801561039f5780820380516001836020036101000a031916815260200191505b508581038352888181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104215780601f106103f657610100808354040283529160200191610421565b820191906000526020600020905b81548152906001019060200180831161040457829003601f168201915b50508581038252878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104a45780601f10610479576101008083540402835291602001916104a4565b820191906000526020600020905b81548152906001019060200180831161048757829003601f168201915b50509a505050505050505050505060405180910390a35050505050610569565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061050557805160ff1916838001178555610533565b82800160010185558215610533579182015b82811115610532578251825591602001919060010190610517565b5b5090506105409190610544565b5090565b61056691905b8082111561056257600081600090555060010161054a565b5090565b90565b6035806105776000396000f3006060604052600080fd00a165627a7a72305820f91b6a473f2df0ca85efaa23c259bdfce7029a20fe03d4fef9202f48fe1ab0320029';
    return bytecode;
  }
}
