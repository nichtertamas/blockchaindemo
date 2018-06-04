const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//fetch the entire blockchain
app.get('/blockchain', function (req, res) {
	res.send(bitcoin);
});


//create a new, pending transaction
app.post('/transaction', function(req, res) {
	//for testing, change back to post
	//const blockIndex = bitcoin.createNewTransaction(Math.floor((Math.random() * 100) + 1), Math.random().toString(36).substring(7), Math.random().toString(36).substring(7));
	
	const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({note: `Transaction willbe added in block ${blockIndex}.`});
});


//create and mine a new block to the chain
app.get('/mine', function(req, res) {
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] +1 
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);


	bitcoin.createNewTransaction(12.5, "00", nodeAddress);

	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
	res.json({
		note: "New block mined succesfully",
		block: newBlock
	});


});

 

app.listen(3000, function() {
	console.log('Listening on port 3000...');
});