var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');
var card_checker = require('./tools/check_card_faction');

router.use(jwt_handler);

function create_update_query(req) {
    var player_id = req.decoded_data.Id;
    var update_query =
        'UPDATE deck' +
        ' SET ';
    for(var i = 1; i <= 20; i++){
        update_query += 'deck.Card_' + String(i) + '_id=' + req.body.deck[i] + '';
        if (i !== 20)
            update_query += ', ';
    }
    update_query += ' WHERE deck.Player_id=' + player_id + ' AND deck.Hero_id=' + req.body.hero_id;
    return update_query;
}

router.put('/:id/update', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        /* Get Hero Faction */
        if (!req.params.id || isNaN(req.params.id) === true){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter id_deck is incorrect or missing"}});
            res.end();
            return;
        }
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
                            return ;
                        }
                        var update_query = create_update_query(req);
                        db.query(update_query, function(err, result) {
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
                            res.json({"results": {
                                "status": 201,
                                "success": "Deck Successfully Updated"
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