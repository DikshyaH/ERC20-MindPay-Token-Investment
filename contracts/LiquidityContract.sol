//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.0;

contract LiquidContract {

    address public owner;
    uint public createdAt;

    constructor(address investor) public {
            owner = investor;
            createdAt = block.timestamp;
        }
  
    function viewBalance() public view returns(address, uint, uint) {
        return (owner, createdAt, address(this).balance);
    }

    function liquidate(address investor) public {
        require(investor == owner, "You are not the owner. You are not allowed to cancel this investment");
        address payable to = payable(owner);
        to.transfer(address(this).balance);
    }

    receive() external payable{

    }
}   