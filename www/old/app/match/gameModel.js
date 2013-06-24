//
// Main model of match game that contains globally important
// information.
//
// openmir (c) 2013 sness@sness.net
//

define(['jquery', 'backbone'], function ($, Backbone) {

    var GameModel = Backbone.Model.extend({
        urlRoot: 'http://localhost:8000/api/v1/game/',
        defaults : {
            currentLevel : 0,
            currentGuess : 0,
            userGuessComplete : false,
        },
    });

    return GameModel;
   
});
