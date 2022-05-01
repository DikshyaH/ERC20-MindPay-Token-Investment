//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MindPay is ERC20 {
    uint256 _totalSupply;

    constructor() ERC20("MINDPAY", "MPY") public {
        _totalSupply = 100000 * 10 **18;
        _mint(msg.sender, _totalSupply );
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