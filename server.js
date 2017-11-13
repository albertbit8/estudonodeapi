'use strict';

const express = require('express');
var validator = require('express-validator');

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
server.use(validator());

server.use(function(req, res, next) {  
  console.log('%s %s %s', req.method, req.url, req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  next();
});

const port = 3000;


server.post('/api/teste', function(req, res, next){
    req.checkBody('username', 'username can not null').notEmpty();
    req.checkBody('email', 'email can not null').notEmpty();
    req.checkBody('password', 'password can not null').notEmpty();
    req.checkBody('cpassword', 'cpassword can not null').notEmpty();
    req.checkBody('secretpin', 'secretpin can not null').notEmpty();

    req.checkBody("email", "Enter a valid email address.").isEmail();
    
    let userName = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    let secretpin = req.body.secretpin;

    var errors = req.validationErrors();
    if (errors) {      
        res.status(422).json(errors);      
    } else {

        connection.getConnection(function(error, tempCont){
            if(!!error){
                tempCont.release();
                console.log(error);
            }else{
                try {
                    console.log("Conectado!");
                    tempCont.query('SELECT username FROM btc_users WHERE username = ? or email = ?', [userName, email],  function(error, rows, fields){
                        tempCont.release();
                        if(!!error){
                            console.log(error);
                        }
                        else{
                            console.log("Busca na /api/users");
                            console.log(rows);
                            if(rows){
                                res.json('username ou email já sendo utilizado');
                            }
                            

                        }
                    });
                } catch (err) {
                    res.json('Erro ao buscar user no banco');
                }
       
            }
        });

        block_io.get_new_address({'label': 'usr_' + userName }, function(error, data){
            if (error) {
                console.log("Error occured:", error.message);
                res.json({
                    'error': error.message
                });
            }
            else{
                console.log(data);  
                
            }       
        });
        
    }


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



