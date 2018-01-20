var express = require('express');
var router = express.Router();
var jwt_handler = require('../controllers/check_jwt');

router.use(jwt_handler);

router.get('/deck/all', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    console.log("id est", player_id);
    var ret = {
        "status": "200",
        "decks": []
    };
    res.json(ret);
    var sql =
        'SELECT ID, Player_id, Hero_id, Name\
            FROM deck\
            WHERE deck.Player_id="'+player_id+'"';
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                console.log(results);
                ret.decks = results;

            }
        }
    });
    res.end()
});

router.get('/deck/{id}', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    console.log("id est", player_id);
    var ret = {
        "status": "200",
        "decks": []
    };
    res.json(ret);
    var sql =
        'SELECT ID, Player_id, Hero_id, Name\
            FROM deck\
            WHERE deck.Player_id="'+player_id+'"';
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                console.log(results);
                ret.decks = results;

            }
        }
    });
    res.end()
});



module.exports = router;