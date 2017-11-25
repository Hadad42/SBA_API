var express = require('express');
var router = express.Router();

var atob = require('atob');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');

var check_user = function (req, res, next) {
    var user_name = req.body.email;
    console.log(user_name);
//    var sql_username ="SELECT ID FROM `user` WHERE `Email`= '"+user_name+"'";
    var sql_username = "SELECT ID FROM `user` WHERE `Email`= '" + user_name + "'";
    console.log('checking if User is already registered');
    var query = db.query(sql_username, function (err, result) {
        if (err) {
            throw err;
        }
        l = result.length;
        if (l > 0) {
            return res.status(403).send(JSON.parse('{ "message": "User is already registered"} '));
        }
        else {
            next();
        }
    });

};


var check_args = function (req, res, next) {
    var body = req.body;
    if (
        !body.first_name
        || !body.last_name
        || !body.email
        || !body.password
    ) {
        console.log("Parameters missing");
        return res.status(403).send(JSON.parse('{ "message": "One or more parameter is missing"} '));
    }
    else {
        next();
    }
};

router.use(check_user);
router.use(check_args);

router.post('/signup', function (req, res) {
    console.log('add User');
    var fname = req.body.first_name;
    var pass = req.body.password;
    var email = req.body.email;
    var dec_pass = atob(pass);
    var encrypted_pass = cryptr.encrypt(dec_pass);
    var sql = "INSERT INTO `user`(`ID`,`Name`,`Email`,`password`) VALUES ('','" + fname + "','" + email + "','" + encrypted_pass + "')";

    var query = db.query(sql, function (err, result) {
        ret = '{ "message": "Your account has been created successfully" }';
        res.json(JSON.parse(ret));
    });
});

module.exports = router;