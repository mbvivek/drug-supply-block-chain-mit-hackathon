pragma solidity ^0.4.0;
contract Organization {
    
    bytes32 id;
    uint time;
    string name;
    string physicalAddress;
    string orgType;
    string adminName;
    address adminUportAddress;
    address adminWeb3Address;
    address approver;
    
    event CreateOrganization(uint time, bytes32 indexed id, string name, string physicalAddress, string orgType, string adminName, address adminUportAddress, address adminWeb3Address, address approver);
    
    function Organization(string _name, string _physicalAddress, string _orgType, string _adminName, address _adminUportAddress, address _adminWeb3Address) public payable {
        time = now; 
        id = sha3(time, _name, _physicalAddress, _orgType);
        name = _name;
        physicalAddress = _physicalAddress;
        orgType = _orgType;
        adminName = _adminName;
        adminUportAddress = _adminUportAddress;
        adminWeb3Address = _adminWeb3Address;
        approver = msg.sender;
        
        CreateOrganization(time, id, name, physicalAddress, orgType, adminName, adminUportAddress, adminWeb3Address, approver);
    }
}