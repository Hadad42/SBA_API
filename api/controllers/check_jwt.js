var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var check_jwt=function(req, res, next) {
    var Authorization = req.header('Authorization');
    var secret = process.env.KEY_SECRET;
    jwt.verify(Authorization, secret, function (err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            // if everything is good, save to request for use in other routes
            var data = JSON.parse(decoded.data);
            req.decoded_data = data[0];
            console.log(decoded.data);
            next();
        }});
};

router.use(check_jwt);

module.exports = router;