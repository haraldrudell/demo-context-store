pragma solidity ^0.4.22;


contract NumberStore {
  uint inumber;
  uint private privnumber;
  uint public number;

  uint pubCount;
  uint extCount;
  uint intCount;
  uint priCount;
  constructor() public {
  }
  function counters() public view returns (uint[4]) {
    return [pubCount, extCount, intCount, priCount];
  }
  function pubf() external returns (string) {
    pubCount++;
    return "publicFunction";
  }
  function extf() external returns (string) {
    extCount++;
    return "externalFunction";
  }
  function intf() internal returns (string) {
    intCount++;
    return "internalFunction";
  }
  function prif() private returns (string) {
    priCount++;
    return "privateFunction";
  }

  function set(uint _number) public returns(string) {
    number = _number;
    return "ok";
  }
}
