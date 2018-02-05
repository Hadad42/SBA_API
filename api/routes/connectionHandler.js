var express = require('express');
var jwt = require('jsonwebtoken');
var atob = require('atob');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
var router = express.Router();

var check_user=function (req, res, next) {
    var user_name=req.body.email;
    var sql_username ="SELECT Id FROM `user` WHERE `Email`= '"+user_name+"'";
    console.log('checking if User exist');
    console.log(req.body);
    var query = db.query(sql_username, function (err, result) {
        if (err){
            throw err;
        }
        l = result.length;
        if (l === 0){
//        if (result === ""){
            return res.status(403).send(JSON.parse('{ "message": "User does not exist"} '));
        }
        else {
            console.log("User exist");
            next();
        }
    });
};

router.use(check_user);

router.post('/signin', function (req, res) {
    console.log(req.body);
    var id=req.body.id;
    var name=req.body.email;
    var pass= req.body.password;
    var dec_pass = atob(pass);
    // Si On compte un jour encrypter les mdps
    // var encrypted_pass = cryptr.encrypt(dec_pass);
    var sql="SELECT Id, Name, Email FROM `user` WHERE `Email`='"+name+"' and `Password` = '"+pass+"'";

    db.query(sql,function(err, results){
        if (results !== ""){

            var data = JSON.stringify(results) ;
            if (data === "[]") {
                res.json({
                    "results":
                        {
                            "status": false,
                            "message" : 'Password incorrect'
                        }
                });
                res.end();
            }
            var secret = process.env.KEY_SECRET;
            var now = Math.floor(Date.now() / 1000),
                iat = (now - 10),
                expiresIn = 3600,
                expr = (now + expiresIn),
                notBefore = (now - 10),
                jwtId = Math.random().toString(36).substring(7);
            var payload = {
                iat: iat,
                jwtid : jwtId,
                audience : 'TEST',
                data : data
            };
            console.log("data are", data);
            jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn : expiresIn}, function(err, token) {
                if (err){
                    res.json({
                        "results":
                            {
                                "status": false,
                                "message" : 'Error occurred while generating token'
                            }
                    });
                }
                else {
                    if(token !== false){
                        res.header();
                        res.json({
                            "results":
                                {
                                    "status": true,
                                    "token" : token,
                                    "user" : results[0]
                                }
                        });
                        res.end();
                    }
                    else{
                        res.json({
                            "results":
                                {
                                    "status": false,
                                    "message" : 'Could not create token'
                                }
                        });
                        res.end();
                    }

                }
            });
        }
        else {
            res.json({
                "results":
                    {
                        "status": false,
                        "message" : 'User Not found'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;