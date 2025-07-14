const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require("path");
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');

const helper = require('./helper');

const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {
    try {
        const ccp = await helper.getCCP(org_name);
        const walletPath = await helper.getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`User ${username} not found in wallet. Registering...`);
            await helper.getRegisteredUser(username, org_name, true);
            identity = await wallet.get(username);
            if (!identity) throw new Error('User registration failed.');
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: { enabled: true, asLocalhost: false }
        });

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        // Ensure args is parsed correctly
        if (typeof args === 'string') {
            try {
                args = JSON.parse(args);
            } catch (err) {
                throw new Error(`Invalid JSON string in args: ${args}`);
            }
        }

        if (!Array.isArray(args)) {
            throw new Error(`'args' must be an array`);
        }

        let result;

        if (
            ["queryCar", "queryCarsByOwner", "getHistoryForAsset", "restictedMethod"].includes(fcn)
        ) {
            result = await contract.evaluateTransaction(fcn, args[0]);
        } else if (
            ["readPrivateCar", "queryPrivateDataHash", "collectionCarPrivateDetails"].includes(fcn)
        ) {
            result = await contract.evaluateTransaction(fcn, args[0], args[1]);
        } else {
            result = await contract.evaluateTransaction(fcn, ...args);
        }

        console.log(`Transaction has been evaluated. Result: ${result.toString()}`);
        return JSON.parse(result.toString());

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return { error: error.message };
    }
};

exports.query = query;
