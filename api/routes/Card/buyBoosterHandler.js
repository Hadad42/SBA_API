var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

// Create add Card Query

function number_generator(num, max) {
    var list_card = [];
    var min = 1;
    for (var i = 0; i < num; i++){
        list_card.push(Math.floor(Math.random() * (max - min +1)) + min)
    }
    return list_card;
}

function create_insert_query(req, list_card) {
    var player_id = req.decoded_data.Id;
    var list_inserted = [];
    var insert_query = "INSERT INTO `card_collection`(`Player_id`, `Card_id`,`Number`) VALUES ";
    insert_query += "(" + player_id + "', '" + ") ";

    for (var i=0; i<list_card.length; i++){

    }

    insert_query += ");";
    return insert_query;
}

function create_update_query(req) {
    var player_id = req.decoded_data.Id;
    var update_query =
        'UPDATE `card_collection`' +
        ' SET ';
    for (var i=0; i<) {

    }
}

function query_update_card(req, res, next, list_player_card) {
    var new_card_list = number_generator(6, 2);
    console.log(player_card_list);
    var add_cards_update_query = create_update_query(req, player_card_list);
    db.query(add_cards_update_query, function(err, result) {
        if (err) {
            db.rollback(function() {
                throw err;
            });
        }
        console.log(result);
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

}

function select_player_card(req, res, next) {
    var sql =
        'SELECT Player_id, Card_id, Number\
    FROM card_collection\
    WHERE card_collection.Player_id="'+player_id+'"';
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                var data = JSON.stringify(results);
                if (data === "[]") {
                    // ajouter gestion d'erreur quand j'aurais le temps
                    res.json(ret);
                    console.log();
                    res.end();
                    return;
                }
                query_update_card(req, res, next, results);
            }
        }
    })
}

router.post('/buyBooster', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    var player_id = req.decoded_data.Id;
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        /* Get Hero Faction */
        db.query('SELECT Gold AS "Gold" ' +
            'FROM player ' +
            'WHERE player.ID=?', player_id,
            function(err, result) {
                if (err) {
                    db.rollback(function() {
                        throw err;
                    });
                }
                console.log("1st query result is ", result);
                var log = result[0].Gold;
                console.log("log is ", log);

                if (log < process.env.BOOSTER_PRICE){
                    console.log("Player ", player_id, "doesn't have enough gold to buy a booster");
                    res.json({
                        "results": {
                            "status": 403,
                            "error": "User doesn't have enough part to buy a booster"
                        }
                    });
                    res.end();
                    return;
                }
                db.query('SELECT Player_id AS "Player", Card_id AS "Card", Number ' +
                    'FROM card_collection ' +
                    'WHERE Player_id=?', player_id,
                    function(err, result) {
                        if (err) {
                            db.rollback(function() {
                                throw err;
                            });
                        }
                        console.log("collection is ", result);

                        /* Get list of available cards of Hero faction */
                        db.query(
                            'UPDATE player ' +
                            'SET player.Gold = player.Gold - 200 ' +
                            'WHERE player.ID=?', player_id,
                            function(err, result) {
                                if (err) {
                                    console.log("error is ", err);
                                    db.rollback(function() {
                                        throw err;
                                    });
                                }
                                console.log("2nd query result is ", result);
                                query_update_card(req, res, next)
                            });
                    });
            });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;