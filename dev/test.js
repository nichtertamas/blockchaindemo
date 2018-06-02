const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(2398,'9083123908', 'QA9874234');
bitcoin.createNewBlock(4324,'2342342344', '4324324324');
bitcoin.createNewBlock(8434,'5435324324', '3245435434');


console.log(bitcoin);
