"use strict";

var algosdk = require('algosdk');

var fs = require('fs');

var fetch = require("node-fetch");

function deployToken() {
  var accountData, address, privateKey, privateKeyUint8, algodToken, algodServer, algodPort, algodClient, suggestedParams, txn, signedTxn, result, assetIndex, url;
  return regeneratorRuntime.async(function deployToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Read the account details from JSON
          accountData = JSON.parse(fs.readFileSync('account.json', 'utf8'));
          address = accountData.address, privateKey = accountData.privateKey; // Convert the private key from base64 string back to Uint8Array

          privateKeyUint8 = new Uint8Array(Buffer.from(privateKey, 'base64')); // Connect to the Algorand node

          console.log("Connecting to Algorand Testnet");
          algodToken = {
            "x-api-key": "1V2TK9aQG81Uh3VgF45Kp3EirOFfa4Rm1rEBArFV" // fill in yours

          };
          algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
          algodPort = "";
          algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort); // Get suggested transaction parameters

          _context.next = 10;
          return regeneratorRuntime.awrap(algodClient.getTransactionParams()["do"]());

        case 10:
          suggestedParams = _context.sent;
          // Create an asset creation transaction
          console.log("Creating the Token Metadata");
          txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: address,
            suggestedParams: suggestedParams,
            defaultFrozen: false,
            unitName: 'S999',
            // Symbol
            assetName: 'Starrohan Coin',
            // Name of the asset
            manager: address,
            reserve: address,
            freeze: address,
            clawback: address,
            total: 1000,
            decimals: 0 // Decimals

          }); // Sign the transaction

          signedTxn = algosdk.signTransaction(txn, privateKeyUint8); // Submit the transaction to the network

          _context.next = 16;
          return regeneratorRuntime.awrap(algodClient.sendRawTransaction(signedTxn.blob)["do"]());

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3));

        case 18:
          result = _context.sent;
          console.log("Token deployed");
          assetIndex = result['asset-index'];
          console.log("Asset ID created: ".concat(assetIndex)); // Display AlgoExplorer URL

          url = "https://testnet.algoexplorer.io/asset/".concat(assetIndex);
          console.log("Asset URL: ".concat(url)); // End the console

          process.exit();

        case 25:
        case "end":
          return _context.stop();
      }
    }
  });
}

deployToken();