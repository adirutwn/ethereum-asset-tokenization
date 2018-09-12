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

    const accounts = await jsonfile.readFile(file);
    const developer = accounts[1];
    const alice = accounts[2];
    const bob = accounts[3];

    console.log('On Blockchain, the developer hold : ');
    const balanceOfDeveloper = await RealEstateInstance.balanceOf(developer.address);
    for(let i = 0; i<balanceOfDeveloper;i++){
      console.log(await RealEstateInstance.tokenOfOwnerByIndex(developer.address, i));
    }

    console.log('On Blockchain, Alice hold : ');
    const balanceOfAlice = await RealEstateInstance.balanceOf(alice.address);
    for(let i = 0; i<balanceOfAlice;i++){
      console.log(await RealEstateInstance.tokenOfOwnerByIndex(alice.address, i));
    }

    console.log('On Blockchain, Bob hold : ');
    const balanceOfBob = await RealEstateInstance.balanceOf(bob.address);
    for(let i = 0; i<balanceOfBob;i++){
      console.log(await RealEstateInstance.tokenOfOwnerByIndex(bob.address, i));
    }

  } catch(e) {
    console.log(e);
  }

})();
