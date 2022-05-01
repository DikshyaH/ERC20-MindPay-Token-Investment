//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.0;

import "./MindPay.sol";
import "./ReserveContract.sol";
import "./LiquidityContract.sol";

contract InvestmentTracker{

    address[] public reserve_investments;
    address[] public liquid_investments;
    uint256 public investedAmount;
    address public owner;
    uint256 public reserve_amount;
    uint256 public liquidity_amount;
    uint256 public token_balance; //current contract token balance
    uint256 public token_amount; // tokens invested
    uint256 public bonus_tokens;

    MindPay MPYToken;
    ReserveContract new_investment_reserve;
    LiquidContract new_investment_liquidity;
    
    event ReserveEtherTransfer(address reserve_contract,address owner,uint EthTRansferred);
    event LiquidEtherTransfer(address liquid_contract,address owner,uint EthTRansferred);
     
    constructor(uint256 _tokenamount, address _MindPayAddress) public payable {
      owner = msg.sender;
      investedAmount = msg.value;
      token_amount = _tokenamount;
      MPYToken = MindPay(_MindPayAddress);
      new_investment_liquidity = new LiquidContract(msg.sender);
      new_investment_reserve = new ReserveContract(msg.sender ,token_balance,address(this));    
    }

    function processInvestment() public {       
        reserve_amount = ((90 * investedAmount) / 100);
        liquidity_amount = ((10 * investedAmount)/ 100);
        transferReserveEther();
        transferliquidAssets();
        // transferReserveTokens(MPYToken);
    }

    function transferReserveEther() public {
        require(address(this).balance >= reserve_amount,"Error in calculating reserve amount");
        reserve_investments.push(payable(new_investment_reserve));
        address payable _reserve = payable(new_investment_reserve);
        _reserve.transfer(reserve_amount);   
        emit ReserveEtherTransfer(_reserve,owner,reserve_amount);
    }

    function transferReserveTokens(IERC20 MindPayToken) public {
        require(token_amount > 0,"Please enter the amount of tokens you want to buy");
        token_amount = token_amount + getBonusTokens();
        token_balance = MindPayToken.balanceOf(address(this));
        require(token_balance > token_amount,"Not enough tokens in the reserve");
        MindPayToken.transfer(reserve_investments[0], token_amount);
        // emit TransferSent(msg.sender,new_investment_reserve, token_amount);

    }

    function getBonusTokens() public returns(uint){
        if( investedAmount > 1 * 10**18  &&  investedAmount < 5 * 10**18) {   // if else statement
            bonus_tokens = ((10 * token_amount) / 100);
            return bonus_tokens;
        } else if( investedAmount > 5 * 10**18 ){
            bonus_tokens = ((20 * token_amount) / 100);
            return bonus_tokens;
        } else {
            bonus_tokens = 0;
            return bonus_tokens;
        }
    }

    function transferliquidAssets() public {
        require(address(this).balance >= liquidity_amount,"Error in calculating Liquidity amount");
        liquid_investments.push(payable(new_investment_liquidity));
        address payable _liquid = payable(new_investment_liquidity);
        _liquid.transfer(liquidity_amount);
        emit LiquidEtherTransfer(_liquid,owner,liquidity_amount);
    }

    function getEtherBalance() public view returns(uint){
        return address(this).balance;
    }

    function getTokenBalance(IERC20 MindPayToken) public view returns(uint){
        MindPayToken.balanceOf(address(this));
    }

    function getReserveInvestmentContractBalance()public view returns(address , uint , uint , uint , uint){
        return new_investment_reserve.viewBalance();
    }

    function getLiquidContractBalance()public view returns(address, uint, uint){
        return new_investment_liquidity.viewBalance();
    }

    // function createInvestment(uint256 _tokenamount) public returns(address payable){
    //         InvestmentContract new_investment_reserve = new InvestmentContract(msg.sender, _tokenamount);
    //         investments.push(payable(new_investment_reserve));
    //         return (payable(new_investment_reserve));
    // }

    function cancelInvestment()public returns(bool cancellation_success){
            require(owner == msg.sender, "You are not the owner. You are not allowed to cancel this investment");
            new_investment_reserve.cancelInvestment(owner);
            return true;
    }

    function stakeInvestment()public returns(bool cancellation_success){
            require(owner == msg.sender, "You are not the owner. You are not allowed to stake this investment");
            new_investment_reserve.stakeInvestment(owner, MPYToken);
            return true;
    }

    receive() external payable{

    }

}


