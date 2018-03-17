import { Injectable } from '@angular/core';
import { UportService } from '../../services/uport/uport.service';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class OrganizationService {
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
            "name": "_physicalAddress",
            "type": "string"
          },
          {
            "name": "_orgType",
            "type": "string"
          },
          {
            "name": "_adminName",
            "type": "string"
          },
          {
            "name": "_adminUportAddress",
            "type": "address"
          },
          {
            "name": "_adminWeb3Address",
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
            "indexed": false,
            "name": "physicalAddress",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "orgType",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "adminName",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "adminUportAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "adminWeb3Address",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "CreateOrganization",
        "type": "event"
      }
    ];

    return abi;
  }

  getBytecode(): any {
    let bytecode =
      '60606040526040516106f83803806106f883398101604052808051820191906020018051820191906020018051820191906020018051820191906020018051906020019091908051906020019091905050426001819055506001548686866040518085815260200184805190602001908083835b6020831015156100985780518252602082019150602081019050602083039250610073565b6001836020036101000a03801982511681845116808217855250505050505090500183805190602001908083835b6020831015156100eb57805182526020820191506020810190506020830392506100c6565b6001836020036101000a03801982511681845116808217855250505050505090500182805190602001908083835b60208310151561013e5780518252602082019150602081019050602083039250610119565b6001836020036101000a038019825116818451168082178552505050505050905001945050505050604051809103902060008160001916905550856002908051906020019061018e929190610610565b5084600390805190602001906101a5929190610610565b5083600490805190602001906101bc929190610610565b5082600590805190602001906101d3929190610610565b5081600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600054600019167fbe124305abdc483af825f2c9d64486cff21e68f63bafa1bf06b24fd3150847746001546002600360046005600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660405180898152602001806020018060200180602001806020018873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185810385528c8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104645780601f1061043957610100808354040283529160200191610464565b820191906000526020600020905b81548152906001019060200180831161044757829003601f168201915b505085810384528b8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104e75780601f106104bc576101008083540402835291602001916104e7565b820191906000526020600020905b8154815290600101906020018083116104ca57829003601f168201915b505085810383528a81815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561056a5780601f1061053f5761010080835404028352916020019161056a565b820191906000526020600020905b81548152906001019060200180831161054d57829003601f168201915b50508581038252898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156105ed5780601f106105c2576101008083540402835291602001916105ed565b820191906000526020600020905b8154815290600101906020018083116105d057829003601f168201915b50509c5050505050505050505050505060405180910390a25050505050506106b5565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061065157805160ff191683800117855561067f565b8280016001018555821561067f579182015b8281111561067e578251825591602001919060010190610663565b5b50905061068c9190610690565b5090565b6106b291905b808211156106ae576000816000905550600101610696565b5090565b90565b6035806106c36000396000f3006060604052600080fd00a165627a7a72305820cb59f682fc93b08b7beeb1bb996b48a4733f24a1acff37ae020b871b67d59a120029';
    return bytecode;
  }
}
