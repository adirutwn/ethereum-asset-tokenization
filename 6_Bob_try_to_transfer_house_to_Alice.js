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

    // Get the account address and unlock the Bob account to transfer ownership to Alice.
    const accounts = await jsonfile.readFile(file);
    const bob = accounts[3];
    await web3.eth.personal.unlockAccount(bob.address, bob.name, 600);

    // Get Alice account to put as a new owner of Bob's house.
    const alice = accounts[2];

    // House that Bob brought
    const houseId = 15;

    // Transfer ownership of the asset
    await RealEstateInstance.safeTransferFrom(bob.address, alice.address, houseId, {from: bob.address, gas: 500000});

    console.log(`Success: ownership of the house#${houseId} had been trasnfer from Bob to Alice`);

  } catch(e) {
    console.log(e);
  }

})()
