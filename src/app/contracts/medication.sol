pragma solidity ^0.4.0;
contract Medication {
    bytes32 id;
    uint time;
    string name;
    bytes32 manufacturerId;
    string manufacturedDate;
    string expirationDate;
    string status;
    address approver;
    
    event CreateMedication(uint time, bytes32 indexed id, string name, bytes32 indexed manufacturerId, string manufacturedDate, string expirationDate, string status, address approver);
    
    function Medication(string _name, bytes32 _manufacturerId, string _manufacturedDate, string _expirationDate, string _status) {
        time = now;
        id = sha3(time, _name, _manufacturerId, _manufacturedDate, _expirationDate);
        name = _name;
        manufacturerId = _manufacturerId;
        manufacturedDate = _manufacturedDate;
        expirationDate = _expirationDate;
        status = _status;
        approver = msg.sender;

        CreateMedication(time, id, _name, _manufacturerId, _manufacturedDate, expirationDate, status, approver);
    }
}