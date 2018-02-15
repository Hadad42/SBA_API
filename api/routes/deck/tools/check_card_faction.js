module.exports = {
    check_available_cards : function (list_cards, list_available) {
        var status;
        var b;
        console.log("list_card is ", list_cards);
        console.log("list_avail is ", list_available);
        for (var i=0; i < list_cards.length; i++){
            status = false;
            for (b=0; b < list_available.length; b++){
                console.log('card is ', list_cards[i], ' and avail card is ', list_available[b].card);
                if (list_cards[i] === list_available[b].card){
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
};
