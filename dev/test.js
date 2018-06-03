const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = '454356346234234';
const currentBlockData = [
	{
		amount: 10,
		sender: 'assadsad',
		recipinet: 'adssadsdad'
	},
	{
		amount: 435,
		sender: 'ewrewr',
		recipinet: 'ewrewrer'
	},
	{
		amount: 910,
		sender: 'rrr',
		recipinet: 'ewrwereeeee'
	}
];

const nonce = 100;


console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData, nonce));

//bitcoin.createNewTransaction(100, 'ALEX34242412', 'JEN54353454');

//bitcoin.createNewBlock(4324,'2342342344', '4324324324');

//bitcoin.createNewTransaction(230, 'JEN34242412', 'BILL54353454');
//bitcoin.createNewTransaction(70, 'BILL34242412', 'ALEX54353454');
//bitcoin.createNewTransaction(420, 'BILL34242412', 'ALEX54353454');

//bitcoin.createNewBlock(4324,'2342342344', '4324324324');


//console.log(bitcoin.chain[2]);
