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
    console.log("new_list is", list_card);
    return list_card;
}

function query_commit(req, res, next) {
    db.commit(function(err) {
        if (err) {
            db.rollback(function () {
                throw err;
            });
        }
    });
    res.status(201).send({"results":{
        "status": 201,
        "success": "Booster Bought"
    }}) ;
    res.end();

}

function query_insert_card(req, res, next, to_insert) {
    var player_id = req.decoded_data.Id;
    var insert_query = 'INSERT INTO `card_collection`(`Player_id`, `Card_id`,`Number`) VALUES ';

    console.log("to_insert", to_insert);
    var i = 0;
    for (var key in to_insert){
        if (to_insert.hasOwnProperty(key)) {
            if (i > 0){
                insert_query += ', '
            }
            insert_query += '(' + player_id + ', ' + key + ', ' + to_insert[key] + ') ';
        }
        i += 1;
    }
    insert_query += ";";
    console.log("query is ", insert_query);

    db.query(insert_query, function(err, result) {
        if (err) {
            db.rollback(function() {
                throw err;
            });
        }
        console.log(result);
        query_commit(req, res, next)
    });
}

function query_update_card(req, res, next, player_card_list) {
    var new_card_list = number_generator(6, 2);
    var player_id = req.decoded_data.Id;
    var to_insert = {};
    var to_update = {};

    // Split list of card to be added into to_update and to_insert
    for (var i=0; i<new_card_list.length; i++) {
        var is_in_PL = false;
        for (var b=0; b < player_card_list.length; b++){
            if (new_card_list[i] === player_card_list[b].card){
                is_in_PL = true;
                to_update[new_card_list[i]] = to_update[new_card_list[i]] + 1 || player_card_list[b].Number + 1;
                break;
            }
        }
        if (is_in_PL === false){
            to_insert[new_card_list[i]] = to_insert[new_card_list[i]] + 1 || 1;
        }

    }
    if (JSON.stringify(to_update) !== '{}') {

        var update_query =
            'UPDATE `card_collection` ' +
            'SET card_collection.Number = CASE card_collection.Card_id ';
        for (var key in to_update) {
            update_query += ' WHEN ' + key + ' THEN ' + to_update[key];
        }
        update_query += ' END WHERE Player_id=' + player_id + ';';
        db.query(update_query, function (err, result) {
            if (err) {
                db.rollback(function () {
                    throw err;
                });
            }
            if (JSON.stringify(to_insert) === '{}') {
                console.log("entre dans query commit");
                query_commit(req, res, next);
            }
            else {
                query_insert_card(req, res, next, to_insert)
            }

        });
    }
    else {
        query_insert_card(req, res, next, to_insert)
    }
}

function select_player_card(req, res, next) {
    var player_id = req.decoded_data.Id;
    var sql =
        'SELECT Player_id, Card_id AS "card", Number \
    FROM card_collection \
    WHERE card_collection.Player_id='+player_id+'';
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                query_update_card(req, res, next, results);
            }
        }
    })
}

router.post('/buy', function (req, res, next) {
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
                                select_player_card(req, res, next);
                            });
            });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;