//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReserveContract {

    address public owner;
    uint public createdAt;
    uint public unlock;
    uint public tokenBalance;
    address public stakeAddress;
    

    constructor(address investor, uint _tokenBalance,address _parent ) public {
            owner = investor;
            createdAt = block.timestamp;
            unlock = createdAt + 15 minutes;
            tokenBalance = _tokenBalance;
            stakeAddress = _parent;
            
        }
  
    function viewBalance() public view returns(address, uint, uint, uint, uint) {
        return (owner, unlock, createdAt, address(this).balance, tokenBalance);
    }

    function cancelInvestment(address investor) public {
        require(block.timestamp > unlock, "The contract is locked. You cannot liquiate your assets till the lock period is complete");
        address payable to = payable(owner);
        to.transfer(address(this).balance);
    }

    function stakeInvestment(address investor,IERC20 MindPayToken) public {
        require(block.timestamp > unlock, "The contract is locked. You cannot stake your assets till the lock period is complete");
        address payable to = payable(stakeAddress);
        to.transfer(address(this).balance);
        MindPayToken.transfer(stakeAddress,tokenBalance);
    }

    receive() external payable{

    }
}

