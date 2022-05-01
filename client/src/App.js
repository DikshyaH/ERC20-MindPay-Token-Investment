import React, { Component } from "react";
import MindPay from "./contracts/MindPay.json";
import InvestmentTracker from "./contracts/InvestmentTracker.json";
import ReserveContract from "./contracts/ReserveContract.json";
import LiquidityContract from "./contracts/LiquidContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = { loaded:false, Ether:23};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.

      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      this.investmenttracker = new web3.eth.Contract(
        InvestmentTracker.abi,
        InvestmentTracker.networks[networkId] && InvestmentTracker.networks[networkId].address
      );

      this.mindpay = new web3.eth.Contract(
        MindPay.abi,
        MindPay.networks[networkId].address
      );

      // let contract = MindPay.new({from: accounts[0], gas: 1000000});

      // // Transaction has entered to geth memory pool
      // console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

      // this.reservecontract = new this.web3.eth.Contract(
      //   ReserveContract.abi,
      //   ReserveContract.networks[this.networkId] && ReserveContract.networks[this.networkId].address,
      // );

      // this.liquiditycontract = new this.web3.eth.Contract(
      //   LiquidityContract.abi,
      //   LiquidityContract.networks[this.networkId] && LiquidityContract.networks[this.networkId].address,
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  handleConvert = async() => {
    const {Ether} = this.state;
    console.log(Ether);
    const check_exponential = Ether.toString();
    if (check_exponential.indexOf('e') !== -1) {
      const exponent = parseInt(check_exponential.split('-')[1], 10);
      const result = Ether.toFixed(exponent);
      document.getElementById("output").innerHTML = Tokenvalue + " MINDPAY Tokens";
    }
    else{
      var Tokenvalue = (parseFloat(Ether) * 1000);
      document.getElementById("output").innerHTML = Tokenvalue + " MINDPAY Tokens";
    };
    alert(Tokenvalue);
  };

  handleInvest= async() => {
    let _investment = await this.investmenttracker.methods.processInvestment();
    console.log(_investment);
    this.investmenttracker.events.ReserveEtherTransfer().on("data", async function(evt) {
      // if(evt.returnValues._step == 1) {
      //   let item = await self.productsupplymanager.methods.items(evt.returnValues.productNumber).call();
      //   console.log(item);
      //   alert("Item " + item.productSKU + " was paid, deliver it now!");
      // };
      console.log(evt);
    });
  };
  
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const id = target.id;

    this.setState({
      [id]: value
    });
  };

  handleSupply= async() => {
    console.log("Get Mind Pay ERC20 Contract");
    console.log(this.mindpay);
    let result = await this.mindpay.methods.totalSupply().call().then(function (x) {
      // Use x in here.
      return x;
    });
    console.log(result);
  };



  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to MindPay Investment!</h1>
        {/* <p>Your Truffle Box is installed and ready.</p>*/}
        <h2>1 Ether = 1000 Mindpay</h2>
        <p>
            Enter the Ether value to view the MINDPAY Tokens you want to Invest
        </p>
        {/* <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p> */}
        {/* <div>The stored value is: {this.state.storageValue}</div> */}
        <p></p>
        <input type ="text" id="Ether" maxLength="20" onChange={this.handleInputChange} value = {this.state.Ether}></input>
        <p></p>
        <button type ="button" id="Convert" onClick={this.handleConvert}>Convert</button>
        <p id ="output">0 MINDPAY</p>
        <button type ="button" id="Supply" onClick={this.handleSupply}>Check MindPay Supply</button>
        <p></p>
        <button type ="button" id="Invest" onClick={this.handleInvest}>Invest  into MINDPAY</button>
        <button type ="button" id="Reserve" onClick={this.handleConvert}>Check Reserve Balance</button>
        <button type ="button" id="Liquid" onClick={this.handleConvert}>Check Liquid Balance</button>
        <p></p>
        <button type ="button" id="Cancel" onClick={this.handleConvert}>Cancel Investment</button>
        <button type ="button" id="Stake" onClick={this.handleConvert}>Stake Investment</button>

        <p></p>
      </div>
    );
  }
}

export default App;
