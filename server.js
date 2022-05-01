// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
const express = require('express'); //Import the express dependency
const app = express();            //Instantiate an express app, the main work horse of this server
const port = 3000;               //Save the port number where your server will be listening
const socket = require('socket.io');
const ethers = require('ethers');
const fs = require('fs');
// const InvestmentTracker = require ("./client/src/contracts/InvestmentTracker.json");
// const MindPay = require ("./client/src/contracts/MindPay.json");

// import InvestmentTracker from Investment_json;
// import MindPay from "./client/src/contracts/MindPay.json";

// Connection Initialization
const rpcURL = "http://127.0.0.1:8545";
const web3 = new Web3(rpcURL);

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('/html/index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.use(express.static('html'));

var server = app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

const io = socket(server);



// Read the contract artifact
const metadata = JSON.parse(fs.readFileSync('./client/src/contracts/MindPay.json').toString())
const provider = ethers.providers.getDefaultProvider(rpcURL)

let MindPay_contractaddress = "";

//Deploy  MindPay Contract
async function MindPaydeployment() {

  // Use your wallet's private key to deploy the contract
  const privateKey = "6dcd9f67a1da35abc3989f9fd03086b3b95e48a43f9433327025f72a022a6e86"
  const wallet = new ethers.Wallet(privateKey, provider)

  // Set gas limit and gas price, using the default Ropsten provider
  const price = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
  const options = {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits(price, 'gwei')}
  // console.log(metadata.bytecode);
  // Deploy the contract
  const factory = new ethers.ContractFactory(metadata.abi, metadata.bytecode, wallet)
  const contract = await factory.deploy(options)
  await contract.deployed()
  MindPay_contractaddress = contract.address
  console.log(`MindPay Deployment successful! Contract Address: ${contract.address}`)
  const balance = (await contract.balanceOf(MindPay_contractaddress))
//   ethers.utils.formatEther(balance)
  console.log(balance);
};

//actions
MindPaydeployment();

// console.log("Address" + MindPay_contractaddress);

// const target_contractaddress = process.env.TARGET_CONTRACT_ADDRESS;
var newInvestmentContract ="";
const metadata_two = JSON.parse(fs.readFileSync('./client/src/contracts/InvestmentTracker.json').toString())
io.on('connection', (socket) => {
  // ...
  console.log("made connection with client");
  socket.on("deployContract", (argument1, argument2) => {
    console.log("Investor "+ argument1);
    investor = argument1;
    investmentamount = argument2;
    console.log(investmentamount);
    tokenamount = investmentamount * 1000;
    investment_contract = new web3.eth.Contract(metadata_two.abi);
    console.log("MindPay address verification " + MindPay_contractaddress);
    investment_contract.deploy({data:metadata_two.bytecode,arguments: [tokenamount,MindPay_contractaddress]} ).send({
      from:investor,
      gas:3000000, gasPrice: web3.utils.toWei('0.00000015', 'ether'), value:web3.utils.toWei(investmentamount+'', 'ether') }).then(function(newContractInstance){
        newInvestmentContract = newContractInstance.options.address;
        console.log(newContractInstance.options.address) // instance with the new contract address
        socket.emit("InvestmentComplete", newInvestmentContract);
    });
   
    // const new_Investment = new ethers.Contract(metadata_two.abi, metadata_two.bytecode, provider);
    // const price = ethers.utils.formatUnits( provider.getGasPrice(), 'gwei')
    // const options = {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits(price, 'gwei'),value: ethers.utils.parseEther(investmentamount)}
    // const newInvestmentContract = new_Investment.deploy(tokenamount,MindPay_contractaddress,options)
    // newInvestmentContract.deployed()
    // Investment_contractaddress = contract.address

    // const balance = (newInvestmentContract.methods.processInvestment());
    // ethers.utils.formatEther(balance)


  // });
//   socket.on("signature", (arg1,arg2) => {
//     console.log("Signature : "+ arg1); 
//     console.log("Owner : "+arg2);
//     console.log("Verification for the message and signature is to be done");
//     let accounts = web3.eth.getAccounts().then(e => console.log(e[1]));
//     var ReceieverContract = new web3.eth.Contract(metadata_two.abi, investor);
//     const verifier = ReceieverContract.methods.forward(target_contractaddress,arg2,message_sent,arg1).send({ from: admin_address });
//     console.log(verifier);
  
  });

});
