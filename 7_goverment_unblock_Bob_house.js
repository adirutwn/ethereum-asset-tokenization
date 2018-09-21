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

    // Get the account address and unlock the government account to unblock Bob's asset.
    const accounts = await jsonfile.readFile(file);
    const government = accounts[0];
    await web3.eth.personal.unlockAccount(government.address, government.name, 600);

    // Bob's house
    const houseId = 15;

    // Unblocked Bob's assets
    await RealEstateInstance.enableTransfer(houseId, {from: government.address, gas: 500000});

    console.log(`Success: Goverment had unblocked the property since after investigation, government found that Alice is an innocent.`);

  } catch(e) {
    console.log(e);
  }

})()
