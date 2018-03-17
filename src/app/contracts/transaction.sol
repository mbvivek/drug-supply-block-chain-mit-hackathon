pragma solidity ^0.4.0;
contract Transaction {

    bytes32 id;
    uint time;
    bytes32 medicationId;
    bytes32 fromOrganizationId;
    bytes32 toOrganizationId;
    address approver;
    
    event CreateTransaction(uint time, bytes32 id, bytes32 indexed medicationId, bytes32 indexed fromOrganizationId, bytes32 indexed toOrganizationId);
    
    function Transaction(bytes32 _medicationId, bytes32 _fromOrganizationId, bytes32 _toOrganizationId) payable {
        time = now;
        id = sha3(time, _medicationId, _fromOrganizationId, _toOrganizationId);
        medicationId = _medicationId;
        fromOrganizationId = _fromOrganizationId;
        toOrganizationId = _toOrganizationId;
        
        CreateTransaction(time, id, medicationId, fromOrganizationId, toOrganizationId);
    }
    
}