
const BlockIo = require('block_io');
const block_io_paramrs = require('../config/blockIoparams');
const block_io = new BlockIo(block_io_paramrs.apiToken, block_io_paramrs.apiPin, block_io_paramrs.version);


function GetNewWallet(userName){
    block_io.get_new_address({'label': 'usr_' + userName }, function(error, data){
        if (error) {
            console.log("Error occured:", error.message);
            res.json({
                'error': error.message
            });
        }
        else{
            console.log(data);  
            return data;
        }       
    });
}
