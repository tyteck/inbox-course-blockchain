const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let usedAccount;
let inbox;
const expectedDefaultMessage = 'hi there';

beforeEach(async () => {
    // get a list of all acounts
    accounts = await web3.eth.getAccounts();
    usedAccount = accounts[0];
    console.log("usedAccount : " + usedAccount);
    // use one to deploy contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [expectedDefaultMessage] })
        .send({ from: usedAccount, gas: '1000000' })
});

describe('Inbox features', () => {
    it('contract is deployed', () => {
        assert.ok(inbox.options.address);
        /* 
        assert.equal(inbox.options.address, usedAccount);
        assert(Array.isArray(accounts));
        assert(accounts.length > 0); 
        */

    });

    it('contract has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.ok(message);
        assert.equal(message, expectedDefaultMessage);
    });

    it('contract message can be updated', async () => {
        // sending new message
        const newMessage = 'Hello you !';
        await inbox.methods.setMessage(newMessage)
            .send({ from: usedAccount });

        // checking if it has been updated
        const message = await inbox.methods.message().call();
        assert.ok(message);
        assert.equal(message, newMessage);
    });
});