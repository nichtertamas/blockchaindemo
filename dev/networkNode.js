const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

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

//register node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, rest){
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)	bitcoin.networkNodes.push(newNodeUrl);

	const regNodePromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri:networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodePromises.push(rp(requestOptions));

	});
	Promise.all(regNodePromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({note: 'New node registered with network successfully!'});
	});
});


//register a node with the network
app.post('/register-node', function(req, res){

});


//register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res){

});


app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});