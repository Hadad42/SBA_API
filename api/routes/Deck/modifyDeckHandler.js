var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

function create_update_query(req) {
    var update_query =
        'UPDATE deck' +
        ' SET ';
    for(var i = 1; i <= 20; i++){
        update_query += 'deck.Card_' + String(i) + '_id="'+deck+'"';
        if (i !== 20)
            update_query += ', ';
    }
    update_query += ' WHERE deck.Player_id=' + player_id + ' AND deck.Hero=' + req.body.hero_id;
    return update_query;
}

function check_available_cards(list_cards, list_available) {
    var status;
    var b;
    console.log("list_card is ", list_cards);
    console.log("list_avail is ", list_available);
    for (var i=0; i < list_cards.length; i++){
        status = false;
        for (b=0; b < list_available.length; b++){
            if (list_cards[i] === list_available[b].cards){
                status = true;
                break;
            }
        }
        if (status === false){
            return false;
        }
    }
    return true;
}

function do_deck_transaction(req) {
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
                'WHERE faction.ID=?', log,
                function(err, result) {
                if (err) {
                    db.rollback(function() {
                        throw err;
                    });
                }
                console.log("2nd query result is ", result[0], " and ", result[1]);
                var available_cards = result;
                var pass = check_available_cards(req.body.deck, available_cards);
                if (pass === false){
                    console.log("One or more cards is not part of the hero's faction");
                    db.rollback(function () {});
                    return {
                        "status": 403,
                        "error": "One or more cards is not part of the hero\'s faction"
                    };
                }
                var update_query = create_update_query(req);
                db.query(update_query, function(err, result) {
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
                    console.log('Transaction Complete.');
                    return {
                        "status": 200,
                        "success": "Deck Successfully Updated"
                    }
                });
            });
        });
    });
    /* End transaction */

}

router.put('/updateDeck', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    var deck = req.decoded_data;
    console.log("id est", player_id);
    var ret = {
        "results":{}
    };
    ret = do_deck_transaction(req);
    console.log("return is ", ret);
    res.json(ret);
    // var query = db.query(sql, function (err, results) {
    //     if (err){
    //         throw err;
    //     }
    //     else {
    //         if (results !== ""){
    //             console.log(results);
    //             ret.decks = results;
    //
    //         }
    //     }
    // });
    res.end()
});

module.exports = router;