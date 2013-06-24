//
// Match game
//
// openmir (c) 2013 sness@sness.net
//

define(['jquery', 'app/utils/all', 'app/match/gameModel', 'app/match/gameView', 'app/match/queryModel', 'app/match/queryView'], function ($, Utils, GameModel, GameView, QueryModel, QueryView) {

    var queryModel = new QueryModel();
    var queryView = new QueryView();

    var game = new GameModel({id:1});

    // Retrieve the game data from server
    game.fetch({
        success: function (game) {
            console.log("test");
            console.log(game.toJSON());
        }
    })
    // var gameView = new GameView({model : game, el: $("#gameContainer") });


    // gameView.render();
    
    console.log("match1");

});
