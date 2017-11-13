'use strict';

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const BlockIo = require('block_io');
const block_io_paramrs = require('./config/blockIoparams');
const block_io = new BlockIo(block_io_paramrs.apiToken, block_io_paramrs.apiPin, block_io_paramrs.version);

var connection = require('./config/database');

var jwt = require('jsonwebtoken');


var server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const port = 3000;

server.post('/api/teste', function(req, res){
    let userlabel = req.params('username');
    let email = req.params('email');
    let password = req.params('password');
    let cpassword = req.params('cpassword');
    let secretpin = req.params('secretpin');



    // block_io.get_new_address({'label': 'testeApiNode2'}, function(error, data){
    //     if (error) {
    //         console.log("Error occured:", error.message);
    //         res.json({
    //             'error': error.message
    //         });
    //     }
    //     else{
    //         console.log(data);  
    //         res.json({
    //             data
    //         });
    //     }       
    // });
});

server.get('/api/login', function(req, res){
     // insert code here to actually authenticate, or fake it
    const user = { id: 99 };
  
    // then return a token, secret key should be an env variable
    const token = jwt.sign({ user: user.id }, 'secret_key_goes_here');
    res.json({
        message: 'Authenticated! Use this token in the "Authorization" header',
        token: token
    });
});


server.get('/api/users', ensureToken, function(req, res){    
    jwt.verify(req.token, 'secret_key_goes_here', function(err, data) {
        if (err) {
          res.sendStatus(403);
        } else {
            connection.getConnection(function(error, tempCont){
                if(!!error){
                    tempCont.release();
                    console.log(error);
                }else{
                    console.log("Conectado!");
                    tempCont.query("SELECT * FROM btc_users", function(error, rows, fields){
                        tempCont.release();
                        if(!!error){
                            console.log(error);
                        }
                        else{
                            console.log("Busca na /api/users");
                            //console.log(rows);
                
                            res.json(rows);
                        }
                    });
                }
            });
        }
      });
});

server.get('/api/order/buy', function(req, res){    
    connection.getConnection(function(error, tempCont){
        if(!!error){
            tempCont.release();
            console.log(error);
        }else{
            console.log("Conectado!");
            tempCont.query("SELECT * FROM btc_ads WHERE type='buy' ORDER BY id DESC", function(error, rows, fields){
                tempCont.release();
                if(!!error){
                    console.log(error);
                }
                else{
                    console.log("Busca Ok");
                    //console.log(rows);
        
                    res.json(rows);
                }
            });
        }
    });
});

server.get('/api/order/sell', function(req, res){    
    connection.getConnection(function(error, tempCont){
        if(!!error){
            tempCont.release();
            console.log(error);
        }else{
            console.log("Conectado!");
            tempCont.query("SELECT * FROM btc_ads WHERE type='sell' ORDER BY id DESC", function(error, rows, fields){
                tempCont.release();
                if(!!error){
                    console.log(error);
                }
                else{
                    console.log("Busca Ok");
                    //console.log(rows);
        
                    res.json(rows);
                }
            });
        }
    });
});

server.get('/api/order/sell', function(req, res){    
    connection.getConnection(function(error, tempCont){
        if(!!error){
            tempCont.release();
            console.log(error);
        }else{
            console.log("Conectado!");
            tempCont.query("SELECT * FROM btc_ads WHERE type='sell' ORDER BY id DESC", function(error, rows, fields){
                tempCont.release();
                if(!!error){
                    console.log(error);
                }
                else{
                    console.log("Busca Ok");
                    //console.log(rows);
        
                    res.json(rows);
                }
            });
        }
    });
});

server.get('/api/hello', function(req, res){
    res.json(
        "HELLO SERVER"
    );
});


function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

server.listen(port, function(){
    console.log("NEW API - porta " + port);
}); 



