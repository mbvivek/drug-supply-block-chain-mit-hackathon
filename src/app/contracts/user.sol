pragma solidity ^0.4.0;
contract User {
    bytes32 id;
    uint time;
    string name;
    address uportAddress;
    address web3Address;
    address approver;
    
    event CreateUser(uint time, bytes32 id, string name, address uportAddress, address web3Address, address approver);
    
    function User(string _name, address _uportAddress, address _web3Address) public payable {
        time = now;
        id = sha3(time, _name, _uportAddress, _web3Address);
        name = _name;
        uportAddress = _uportAddress;
        web3Address = _web3Address;
        approver = msg.sender;
        
        CreateUser(time, id, name, uportAddress, web3Address, approver);
    }
}