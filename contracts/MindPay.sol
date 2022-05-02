//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MindPay is ERC20 {
    uint256 _totalSupply;

    constructor() ERC20("MINDPAY", "MPY") public {
        mint(msg.sender,1000 * 10**18);
    }
     
    function mint(address to,uint256 amount) public{
        _mint(to,amount);
    }  

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function burn(address tokencontainer_address,uint256 token_amount) public {
        _burn(tokencontainer_address, token_amount);
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

}