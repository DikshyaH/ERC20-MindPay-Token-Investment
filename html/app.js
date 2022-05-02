const url = 'http://localhost:3000';
const socket = io.connect( url, { reconnection: true } );
// const Web3 = require('web3');

// const rpcURL = "http://127.0.0.1:7545";
// const web3 = new Web3(rpcURL);

const initialize = () => {
 var stat = document.getElementById('Connection');
 var Convert = document.getElementById('Convert');
  var Ether = document.getElementById('Ether');
  var CheckSupply = document.getElementById('Supply');
  var Invest = document.getElementById("Invest"); 
  var Reserve = document.getElementById("Reserve");
  var Liquid = document.getElementById("Liquid");
  var Cancel = document.getElementById("Cancel");
  var Stake = document.getElementById("Stake");
  var Investedmessage = document.getElementById("Invested");
  var Reservemessage = document.getElementById("Reserved");
  var Liquidmessage = document.getElementById("Liquidate");
  var Cancellationmessage = document.getElementById("Cancellation");
  var Stakemessage = document.getElementById("Staking");
  var SupplyMessage = document.getElementById("Supplydisplay");
// var signature_received = document.getElementById('signature');

console.log(socket);

var Tokenvalue = 0;

socket.on( 'connect', function() {
  stat.innerHTML = 'Connected' ;
  Convert.addEventListener('click', function (event) {
    console.log(Ether.value);
    const check_exponential = Ether.value.toString();
    let result = check_exponential.includes("e");
    if (result = true) {

      Tokenvalue = Ether.value * 1000;
      // console.log(Tokenvalue);
      // const exponent = parseInt(check_exponential.substr(check_exponential.length - 1));
      // console.log("exp :"+exponent);
      // Tokenvalue = Tokenvalue.toFixed(exponent);
      output.innerHTML = Tokenvalue + " MINDPAY Tokens";
    }
    else{
      Tokenvalue = (parseFloat(Ether.value) * 1000);
      output.innerHTML = Tokenvalue + " MINDPAY Tokens";
    };
});
  Invest.addEventListener('click', function (event) {
    const owner = window.ethereum.selectedAddress;
    const investmentamount = Ether.value;
    console.log(owner,investmentamount);
    socket.emit("deployContract",owner,investmentamount);   
    
});

Reserve.addEventListener('click', function (event) {
    socket.emit("getReservevalue");   
});

 Liquid.addEventListener('click', function (event) {
  socket.emit("getLiquidvalue");  
 });
  Cancel.addEventListener('click', function (event) {
    var currentuserwallet = window.ethereum.selectedAddress;
    socket.emit("cancelInvestment",currentuserwallet);
 
});
  Stake.addEventListener('click', function (event) {
    var currentuserwallet = window.ethereum.selectedAddress;
    socket.emit("stakeInvestment",currentuserwallet);

});
  CheckSupply.addEventListener('click', function (event) {
    socket.emit("MindPaySupply");

});


socket.on("InvestmentComplete", (arg) => {
  console.log(arg)
  Investedmessage.innerHTML = "Investment Contract deployed at "+ arg; // world
});

socket.on("sendReservevalue", (reservedetails,contractaddress)=> {
  console.log(reservedetails,contractaddress)
  Reservemessage.innerHTML = "Reserve contract Ether amount : " + (parseFloat(reservedetails[3]) / 10 **18 ) +  "ETH  at address : " + contractaddress; // world
});

socket.on("sendLiquidvalue", (liquiddetails,contractaddress)=> {
  console.log(liquiddetails,contractaddress)
  Liquidmessage.innerHTML = "Liquid contract Ether amount : " + (parseFloat(liquiddetails[2])/ 10 **18 ) + " ETH at address : " + contractaddress; // world
});

socket.on("cancelinvestmentsuccess", (cancelInvestment)=> {
  console.log(cancelInvestment)
  Cancellationmessage.innerHTML = "Cancellation success! txn - " + cancelInvestment; // world
  Stake.disabled = true;
});

socket.on("cancelinvestmentreject", (cancelInvestment)=> {
  console.log(cancelInvestment)
  Cancellationmessage.innerHTML = "Cancellation details" + cancelInvestment[reason]; // world
});

socket.on("stakeinvestmentsuccess", (stakeInvestment)=> {
  console.log(stakeInvestment)
  Stakemessage.innerHTML = "Stake Investment success! txn - " + stakeInvestment; // world
  Cancel.disabled = true;
});

socket.on("stakeinvestmentreject", (stakeInvestment)=> {
  console.log(stakeInvestment)
  Stakemessage.innerHTML = "Stake details" + stakeInvestment[reason]; // world
});

socket.on("MPYSupply", (supply)=> {
  console.log(supply)
  SupplyMessage.innerHTML = "Token Supply : " + supply; // world
});

});
};
window.addEventListener('DOMContentLoaded', initialize);

