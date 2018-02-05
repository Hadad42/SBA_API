var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

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


var check_deck = function (req, res, next) {
    var deck = req.body.deck;
    for (var i = 0; i < deck.length; i++) {

    }

};


router.use(check_args);

function create_check_query(req) {
    var check_query = "";

    return check_query;
}

function create_insert_query(req) {
    var player_id = req.decoded_data.Id;
    console.log("player_id est", player_id);
    var insert_query = "INSERT INTO `deck`(`ID`, `Player_id`, `Hero_id`,`Name`, ";
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
    var check_query = create_check_query();
    var insert_query = create_insert_query(req);
//    console.log(insert_query);
    var query = db.query(insert_query, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                var ret = {
                    "results": {
                    }
                };
                var data = JSON.stringify(results) ;
                if (data === "[]") {
                    ret.results = {
                        "error" : 'Password incorrect'
                    };
                }
                else {
                    console.log("results are ", results);
                    ret.results = {
                        "status": 200,
                        "success": "deck successfully created"
                    };
                }
                res.json(ret);
                res.end()
            }
        }
    });
});

module.exports = router;