const Web3 = require('web3');
const jsonfile = require('jsonfile');
const file = 'accounts.json';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const actors = [{name: 'goverment'}, {name: 'real-estate-developer'}, {name: 'Alice'}, {name: 'Bob'}];

generateWallet();

async function generateWallet() {
  try {
    const coinbase = await web3.eth.getCoinbase();
    for(let i = 0;i < actors.length; i++) {
      const account = await web3.eth.personal.newAccount(actors[i].name);
      actors[i].address = account;

      // Transfer ETH to each account for paying transaction fees
      web3.eth.sendTransaction({to: account, from: coinbase, value: web3.utils.toWei("1","ether")});
    }

    await jsonfile.writeFile(file, actors);
    console.log(actors);
  } catch(e) {
    console.log(e);
  }
}
