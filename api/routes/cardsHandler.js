var express = require('express');
var router = express.Router();
var jwt_handler = require('../controllers/check_jwt');
router.use(jwt_handler);

router.get('/card', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    console.log("id est", player_id);
    var ret = {
        "status": "200",
        "cards": []
    };
    res.json(ret);
    var sql = 'SELECT card.ID, card.Sprite, card.Name, card.Cost, card.HP, card.ATK, card.Rarity_id,\
        type_card.Name "Type",\
        faction.Name "Faction",\
        card_collection.Number\
    FROM card\
    LEFT JOIN card_collection ON card.ID=card_collection.Card_id\
    LEFT JOIN type_card ON card.Type_card_id=type_card.ID\
    LEFT JOIN faction ON card.Faction_id=faction.ID\
    WHERE card_collection.Player_id="'+player_id+'"';
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                console.log(results);
                ret.cards = results;
            }
        }
    });
    res.end()
});

module.exports = router;
