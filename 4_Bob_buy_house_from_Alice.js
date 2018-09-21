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
    const alice = accounts[2];
    await web3.eth.personal.unlockAccount(alice.address, alice.name, 600);

    // Get Bob account to put as a new owner of Alice's house.
    const bob = accounts[3];

    // House that Alice brought
    const houseId = 15;

    // Transfer ownership of the asset
    await RealEstateInstance.safeTransferFrom(alice.address, bob.address, houseId, {from: alice.address, gas: 500000});

    console.log(`Success: ownership of the house#${houseId} had been trasnfer from Alice to Bob`);

  } catch(e) {
    console.log(e);
  }

})()
