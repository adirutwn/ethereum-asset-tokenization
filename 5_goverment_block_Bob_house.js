const Web3 = require('web3');
const contract = require('truffle-contract');
const jsonfile = require('jsonfile');
const file = 'accounts.json';
const RealEstateSmartContract = require('./build/contracts/RealEstate.json');

(async () => {
  try {
    // Connect to Ethereum Network and inject Smart Contract to NodeJS
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    const RealEstate = contract(RealEstateSmartContract);
    RealEstate.setProvider(web3.currentProvider);
    const RealEstateInstance = await RealEstate.deployed();

    // Get the account address and unlock the Alice account to transfer ownership to Bob.
    const accounts = await jsonfile.readFile(file);
    const goverment = accounts[0];
    await web3.eth.personal.unlockAccount(goverment.address, goverment.name, 600);

    // House that Alice brought
    const houseId = 11;

    // Transfer ownership of the asset
    await RealEstateInstance.disableTransfer(houseId, {from: goverment.address, gas: 500000});

    console.log(`Success: Goverment had blocked an ability to transfer ownership of house#${houseId}, since Alice is a suspect for running ponzi scheme.`);

  } catch(e) {
    console.log(e);
  }

})()
