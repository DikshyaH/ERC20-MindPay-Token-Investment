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
// var signature_received = document.getElementById('signature');

console.log(socket);

var Tokenvalue = 0;

socket.on( 'connect', function() {
  stat.innerHTML = 'Connected' ;
  Convert.addEventListener('click', function (event) {
    console.log(Ether.value);
    const check_exponential = Ether.value.toString();
    if (check_exponential.indexOf('e') !== -1) {
      const exponent = parseInt(check_exponential.split('-')[1], 10);
      Tokenvalue = Ether.value.toFixed(exponent) * 1000;
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


socket.on("InvestmentComplete", (arg) => {
  console.log(arg)
  Investedmessage.innerHTML = "Investment Contract deployed at "+ arg; // world
});

socket.on("sendReservevalue", (reservedetails)=> {
  console.log(reservedetails)
  Reservemessage.innerHTML = "Reserve contract details :" + reservedetails; // world
});



});
};
window.addEventListener('DOMContentLoaded', initialize);

