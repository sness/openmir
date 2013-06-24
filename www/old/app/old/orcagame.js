//
// orcaTalk : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//


$(document).ready(function () {

    // The name of this application, used when saving user actions to
    // the database
    window.appName = "orcaGame";

    if (window.onWeb) {
        // Log all tap and mousedown events
        $(document).bind('xdown', function(e) {
            recordBaseUserEvent('xdown',e);
        });
        
        $(document).bind('xup', function(e) {
            recordBaseUserEvent('xup',e);
        });
    }

    // Shuffle the referenceIds when the game loads to make it more
    // challenging.
    function generateShuffledReferenceIds() {
        _.each(window.levelData, function(level) {
            _.each(level.turns, function(turn) {
                turn.shuffledReferenceIds = _.shuffle(turn.referenceIds);
            });
        });
    };
               
    // Render the main view, with the main play button
    window.mainView = new MainView({ el: $("#mainContainer") });
    window.scoreBoardView = new ScoreBoardView({ el: $("#scoreBoardContainer") });
    window.levelCompleteView = new LevelCompleteView({ el: $("#levelCompleteContainer") });
    window.helpView = new HelpView({ el: $("#helpContainer") });

    // The achievements
    window.achievementCollection = new AchievementCollection(window.achievementData);
    window.achievementListView = new AchievementListView({ collection: achievementCollection, el: $("#achievementListContainer") });

    // The levels
    generateShuffledReferenceIds();
    window.levelCollection = new LevelCollection(window.levelData);
    window.levelListView = new LevelListView({collection: levelCollection, el: $("#levelListContainer")});

    //
    // The main game board
    //
    window.playModel = new PlayModel();
    window.playView = new PlayView({model : playModel, el: $("#playContainer") });

    // Start at level 0 and turn 0

    // sness - This should be saved in LocalStorage and should be
    // persistant across games.  Should the whole playModel be saved?
    // playView.model.set("currentLevel",0);
    // playView.model.set("currentTurn",0);

    //
    // The router for the app
    // 
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "mainView",
            "scoreboard" : "scoreBoardView",
            "play/:level/:turn" : "playView",
            "levelComplete/:level" : "levelCompleteView",
            "help/:screen" : "helpView",
            "achievements" : "achievementListView"
        },
        mainView: function() {
            this.hideAll();
            $("#mainContainer").show();
            mainView.render();
            bindClickButtons();
        },
        scoreBoardView: function() {
            this.hideAll();
            $("#scoreBoardContainer").show();
            scoreBoardView.render();
            bindClickButtons();
        },
        playView: function(level,turn) {
            playView.model.set("currentLevel",level);
            playView.model.set("currentTurn",turn);

            // Save the current levels to LocalStorage
            setLevelDataFromLocalStorage(levelCollection.toJSON());

            // Set the current level as have being played
            levelCollection.get(level).set("played", true);

            // The user has not made a guess for this level yet
            playView.model.set("userGuessComplete", false);
            playView.model.set("currentReference", undefined);

            // If the user is playing this level again, set the score
            // for this level to 0
            // sness - This should probably be a member function
            if (turn == "0") {
                levelCollection.get(level).set("score", 0);
                playView.model.set("userGuessComplete", false);
            }

            // The user hasn't made any guesses yet
            playView.model.set("guessLevel", 0);

            // If the help view hasn't been shown already, show it first
            if (level == "0" && turn == "0" && playView.model.get("helpScreenShown") === false) {
                app.navigate("help/0", {trigger: true});
                return;
            }
            
            this.hideAll();
            $("#playContainer").show();
            playView.render();
            playAudio(playView.model.get("currentQuery").get("audio"));
            bindClickButtons();

        },
        levelCompleteView: function(level) {
            // Set the next level as being unlocked
            var nextLevel = parseInt(level) + 1;
            levelCollection.get(nextLevel).set("locked", false);
            
            // Show the view
            this.hideAll();
            playView.model.set("currentLevel",level);
            $("#levelCompleteContainer").show();
            levelCompleteView.render(parseInt(level));
            bindClickButtons();
        },
        helpView: function(screen) {
            playView.model.set("helpScreenShown",true);
            this.hideAll();
            $("#helpContainer").show();
            helpView.render(screen);
            bindClickButtons();
        },
        achievementListView: function(screen) {
            this.hideAll();
            $("#achievementListContainer").show();
            bindClickButtons();
        },
        hideAll: function() {
            $("#mainContainer").hide();
            $("#scoreBoardContainer").hide();
            $("#playContainer").hide();
            $("#levelCompleteContainer").hide();
            $("#helpContainer").hide();
            $("#achievementListContainer").hide();
        }

        
    });


    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();

    preloadButtonImages();


});


