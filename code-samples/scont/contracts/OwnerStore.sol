pragma solidity ^0.4.22;

contract OwnerStore {
    address private owner;

    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function showOwner() public view onlyOwner returns(address) {
        return owner;
    }
}
