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

    // Get the account address and unlock the government account to interact with contract.
    const accounts = await jsonfile.readFile(file);
    const government = accounts[0];
    await web3.eth.personal.unlockAccount(government.address, government.name, 600);

    // Get real estate developer account to put as the owner of newly built houses which not sold to anyone yet.
    const developer = accounts[1];

    // House address number or House Identifier.
    const realEstateId = [11, 12, 13, 14, 15, 16];

    // Call Smart Contract as Government to tokenized newly built houses.
    for(let i = 0; i<realEstateId.length;i++) {
      const result = await RealEstateInstance.tokenizedRealEstate(developer.address, realEstateId[i], {from: government.address, gas: 500000});
    }

    console.log('Success: Newly built house had been tokenized!');

  } catch(e) {
    console.log(e);
  }

})()
