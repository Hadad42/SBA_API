var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');
var card_checker = require('./tools/check_card_faction');

router.use(jwt_handler);

var check_args = function (req, res, next) {
    var player_id = req.decoded_data.Id;
    var body = req.body;
    console.log("hero_id est", body.hero_id);
    console.log(typeof player_id);
    console.log(body);
    if (
        !player_id
        || !body.hero_id
        || !body.name
        || !body.deck
    ) {
        console.log("Parameters missing");
        return res.status(403).send(JSON.parse('{ "message": "One or more parameter is missing"} '));
    }
    else if (typeof player_id === "number"){
        console.log("player id is a number");
        next();
    }
    else {
        next();
    }
};

router.use(check_args);

function create_insert_query(req) {
    var player_id = req.decoded_data.Id;
    console.log("player_id est", player_id);
    var insert_query = "INSERT INTO `card`(`ID`, `Player_id`, `Hero_id`,`Name`, ";
    for(var i = 1; i <= 20; i++){
        insert_query += "`Card_" + String(i) + "_id`";
        if (i !== 20)
            insert_query +=  ', ';
    }
    insert_query += ") VALUES ('', '" + player_id + "', '" + req.body.hero_id + "', '" + req.body.name + "', ";
    for(i = 1; i <= 20; i++){
        insert_query += String(req.body.deck[i]);
        if (i !== 20)
            insert_query += ', ';
    }
    insert_query += ");";
    return insert_query;
}

router.post('/createDeck', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        /* Get Hero Faction */
        db.query('SELECT hero.Faction_id AS "hero_faction_id" ' +
            'FROM hero ' +
            'WHERE hero.ID=?', req.body.hero_id,
            function(err, result) {
                if (err) {
                    db.rollback(function() {
                        throw err;
                    });
                }
                console.log("1st query result is ", result);
                var log = result[0].hero_faction_id;
                console.log("log is ", log);
                /* Get list of available cards of Hero faction */
                db.query(
                    'SELECT card.ID AS "card"' +
                    'FROM card ' +
                    'INNER JOIN faction ON card.Faction_id=faction.ID ' +
                    'WHERE faction.ID=? OR faction.ID=1', log,
                    function(err, result) {
                        if (err) {
                            db.rollback(function() {
                                throw err;
                            });
                        }
                        console.log("2nd query result is ", result);
                        var pass = card_checker.check_available_cards(req.body.deck, result);
                        if (pass === false){
                            console.log("One or more cards is not part of the hero's faction");
                            db.rollback(function () {});
                            res.json({"results": {
                                "status": 403,
                                "error": "One or more cards is not part of the hero\'s faction"
                            }});
                            res.end();
                            return;
                        }
                        var insert_query = create_insert_query(req);
                        db.query(insert_query, function(err, result) {
                            if (err) {
                                db.rollback(function() {
                                    throw err;
                                });
                            }
                            console.log(result);
                            var log = result.hero_faction_id;
                            db.commit(function(err) {
                                if (err) {
                                    db.rollback(function () {
                                        throw err;
                                    });
                                }
                            });
                            res.json({"results":{
                                "status": 201,
                                "success": "Deck Successfully Created"
                            }}) ;
                            res.end();
                        });
                    });
            });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;