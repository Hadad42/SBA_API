var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.get('/', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    console.log("id est", player_id);
    var ret = {
        "status": "200",
        "decks": []
    };
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
                res.json(ret);
                res.end();
            }
        }
    });
});

module.exports = router;