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

    // Get the account address and unlock the government account to block the transferability of Bob's asset.
    const accounts = await jsonfile.readFile(file);
    const government = accounts[0];
    await web3.eth.personal.unlockAccount(government.address, government.name, 600);

    // Bob's house
    const houseId = 15;

    // Block the transferability of Bob's asset
    await RealEstateInstance.disableTransfer(houseId, {from: government.address, gas: 500000});

    console.log(`Success: Government had blocked an ability to transfer ownership of house#${houseId}, since Alice is a suspect for running ponzi scheme.`);

  } catch(e) {
    console.log(e);
  }

})()
