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
            playView.model.set("currentGuess", 0);

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


// The number of stars to display
var MAX_STARS = 3;

// The maximum score for a single turn
var BASE_TURN_SCORE = 10000;

// The number of calls a user must identify to unlock an achievement
var NUM_CALLS_TO_UNLOCK_ACHIEVEMENT = 4;

window.levelData = getLevelDataFromLocalStorage();
window.achievementData = getAchievementDataFromLocalStorage();


//
// A single level
//
Level = Backbone.Model.extend({
    defaults : {
        score : 0,
    },

    initialize: function() {
        this.setStars();

        this.bind("change:score", function() {
            this.setStars();
        });
    },

    // Set the number of stars from the score and maxScore
    setStars: function() {
        var score = this.get("score");
        var maxScore = this.get("turns").length * BASE_TURN_SCORE;
        var stars =  Math.floor(score / maxScore * MAX_STARS);
        this.set("stars", stars)                
    },

    // Add this increment to the score
    addToScore: function(addScore) {
        var score = parseInt(this.get("score"));
        score += addScore;
        this.set("score",score);
    }

});

//
// All the levels
//
LevelCollection = Backbone.Collection.extend({
    model: Level,

    initialize: function (models, options) {
    },
    
});

//
// All the achievements
//
//
// A single level
//
Achievement = Backbone.Model.extend({
    defaults : {
        achievementShown : false
    },

    initialize: function() {
        this.updateLocked();

        this.bind("change:currentNum", function() {
            this.updateLocked();
        });
    },

    incrementCurrentNum: function() {
        var currentNum = this.get("currentNum");
        this.set("currentNum",currentNum + 1);
    },

    // Set the number of locked from the score and maxScore
    updateLocked: function() {
        var currentNum = this.get("currentNum");
        var locked = true;
        if (currentNum >= NUM_CALLS_TO_UNLOCK_ACHIEVEMENT) {
            locked = false;
        }
        if (locked == false && this.get("achievementShown") == false) {
            this.trigger("unlockAchievement",this);

            // Slowly reveal and hide the achievement unlocked screen
            $('#achievementUnlockedContainer').slideDown('slow').delay(5000).slideUp('slow');

            this.set("achievementShown",true);
        }
        this.set("locked", locked)                
    },


});

AchievementCollection = Backbone.Collection.extend({
    model: Achievement,

    initialize: function (models, options) {
    },
    
});


//
// Contains global information about the game
//
PlayModel = Backbone.Model.extend({
    defaults : {
        currentQuery : undefined,
        currentReference : undefined,
        currentGuess : 0,
        userGuessComplete : false,
        // currentGuess : 2,
        // userGuessComplete : true,
        currentLevel : undefined,
        currentTurn : undefined,
        helpScreenShown : false
        //helpScreenShown : true
    },
    
});

//
// A single call
//
Call = Backbone.Model.extend({
    defaults : {
        matched : false
    },
});

//
// A collection of calls
//
CallCollection = Backbone.Collection.extend({
    model: Call,

    initialize: function (models, options) {
    },
    
});

// A query call, located at the top of the screen
QueryView = Backbone.View.extend({
    className: "query",

    events: {
        "xdown .call": "xdown",
        "xup .call": "xup",
    },

    xdown: function(e){
        $(this.el).find('.image').addClass('click');
        playClick();
        playAudio(this.model.get("audio"));
        recordUserEvent({
            'level' : 'interfaceEvent',
            'type' : 'query',
            'name' : 'click',
            'modelId' : this.model.id
        });
    },
    
    xup: function(e) {
        $('.image').removeClass('click');
    },

    initialize: function(){
    },
    
    render: function(queryId){
        // Get the correct model from the collection
        this.model = this.collection.get(queryId);

        // Set the currentQuery on the parents playModel to be this query
        this.options.playModel.set({currentQuery : this.model});

        // Render the query
        $(this.el).empty();
        var template = _.template($("#queryTemplate").html());
        var html = template(this.model.toJSON());
        $(this.el).append(html);
        return this;
    }
});

//
// The reference calls that the user has to pick from
//
ReferenceView = Backbone.View.extend({
    tagName: "div",
    className: "reference",

    events: {
        "xdown": "xdown",
        "xup": "xup",
    },
    
    initialize: function() {
    },

    xdown: function(e){
        this.options.playModel.set({currentReference : this.model});
        $('.call').removeClass('selected');

        // Don't highlight the guesses if the user is playing with the
        // displayed signs.
        if (!(this.options.playModel.get("userGuessComplete"))) {
            this.$el.find('.call').addClass('selected');
        }
        this.$el.find('.image').addClass('click');
        playClick();
        playAudio(this.model.get("audio"));
        recordUserEvent({
            'level' : 'interfaceEvent',
            'type' : 'reference',
            'name' : 'click',
            'modelId' : this.model.id
        });
    },
    
    xup: function(e) {
        $('.image').removeClass('click');
    },

    render: function(){
        $(this.el).empty();
        var template = _.template($("#referenceTemplate").html());
        var model = this.model.toJSON();
        var html = template(model);
        $(this.el).append(html);
    }  
});

ReferenceListView = Backbone.View.extend({
    tagName: "div",
    
    initialize: function(){
    },
    
    render: function(referenceIds){
        $(this.el).empty();

        // Render each reference
        _.each(referenceIds, function(n) {
            var model = this.collection.get(n);
            var referenceView = new ReferenceView({model: model, playModel : this.options.playModel});
            referenceView.render();
            $(this.el).append(referenceView.el);
        }, this);

    }
});

//
// The play start page of the application
//
PlayView = Backbone.View.extend({
    events: {
        "xup": "xup",

        "xup #guessButton" : "guessButtonUp",
        "xdown #guessButton" : "guessButtonDown",

        "xup #nextButton" : "nextButtonUp",
        "xdown #nextButton" : "nextButtonDown",

        "xdown #pauseButton" : "pauseButtonDown",
        "xup #pauseButton" : "pauseButtonUp",

        "xdown #achievementButton" : "achievementButtonDown",
        "xup #achievementButton" : "achievementButtonUp",

        "xdown #pauseMenuScoreBoardButton" : "pauseMenuScoreBoardButtonDown",
        "xup #pauseMenuScoreBoardButton" : "pauseMenuScoreBoardButtonUp",

        "xdown #pauseMenuReplayLevelButton" : "pauseMenuReplayLevelButtonDown",
        "xup #pauseMenuReplayLevelButton" : "pauseMenuReplayLevelButtonUp",

        "xdown #pauseMenuPlayButton" : "pauseMenuPlayButtonDown",
        "xup #pauseMenuPlayButton" : "pauseMenuPlayButtonUp",

        "xdown #pauseMenuHelpButton" : "pauseMenuHelpButtonDown",
        "xup #pauseMenuHelpButton" : "pauseMenuHelpButtonUp",

        "xup .playInfo" : "hidePlayInfo",
        
        "xdown .tryAgainButton" : "tryAgainButtonDown"
    },

    xup : function(e) {
        $(this.el).find(".pressButton").removeClass('pressed');            
    },

    tryAgainButtonDown: function(e) {
        $(this.el).find(".tryAgainButton").addClass('pressed');
    },

    guessButtonDown: function(e){
        $(this.el).find("#guessButton").addClass('pressed');
    },

    nextButtonDown: function(e){
        $(this.el).find("#nextButton").addClass('pressed');
    },

    pauseMenuScoreBoardButtonDown: function(e){
        $(this.el).find("#pauseMenuScoreBoardButton").addClass('pressed');
    },

    pauseMenuReplayLevelButtonDown: function(e){
        $(this.el).find("#pauseMenuReplayLevelButton").addClass('pressed');
    },

    pauseMenuPlayButtonDown: function(e){
        $(this.el).find("#pauseMenuPlayButton").addClass('pressed');
    },

    pauseMenuHelpButtonDown: function(e){
        $(this.el).find("#pauseMenuHelpButton").addClass('pressed');
    },

    hidePlayInfo: function() {
        $('.playInfo').hide();
        this.render();
    },

    // When the user presses the guess button, check to see if the
    // guess is correct or incorrect and update the currentGuess
    guessButtonUp: function() {
        var currentReference = this.model.get("currentReference");
        var currentQuery = this.model.get("currentQuery");
        
        if (currentReference === undefined) {
            this.doGuessCurrentReferenceUndefined();
            return;
        }

        var levelNum = this.model.get("currentLevel");
        var level = window.levelCollection.get(levelNum);
        var match = level.get("match");

        if (doQueryAndReferenceMatch(currentReference,currentQuery,match)) {
            this.doGuessMatched();            
        } else {
            this.doGuessDidntMatch();
        }
    },

    // The user has not yet chosen a reference call
    doGuessCurrentReferenceUndefined: function() {
        $("#currentReferenceUndefined").show();
    },

    // If the user guessed correctly, mark the turn as being
    // complete, and add the score increment to the score for this
    // level
    doGuessMatched: function() {
        // Show the popup that the guess matched for 1.5 seconds
        $("#guessMatched").show();

        // Mark the guess as being complete
        // sness - This should probably be a member function
        this.model.set("userGuessComplete", true);

        // Update the achievement score for this call
        var that = this;
        var myName = that.model.get("currentQuery").get("name");
        var achievement = _.find(window.achievementCollection.models, function(n) {
            return (n.get("name") === myName);
        });
        if (achievement) {
            // var currentNum = parseInt(achievement.get("currentNum"));
            // currentNum += 1;
            // achievement.set("currentNum",currentNum);
            achievement.incrementCurrentNum();
            setLevelDataFromLocalStorage(window.levelData);
        }

        // Save the current achievements to LocalStorage
        setAchievementDataFromLocalStorage(window.achievementCollection.toJSON());

        // Add the correct score increment to the score for this level
        var level = this.model.get("currentLevel");
        var turn = this.model.get("currentTurn");
        var score = parseInt(window.levelCollection.get(level).get("score"));
        var currentGuess = parseInt(this.model.get("currentGuess"));
        if (currentGuess == 0) {
            score += BASE_TURN_SCORE;
        } else if (currentGuess == 1) {
            score += BASE_TURN_SCORE / 2;
        } else {
            score += BASE_TURN_SCORE / 3;
        }
        window.levelCollection.get(level).set("score", score);

        recordUserEvent({
            'level' : 'gameEvent',
            'match' : 'matched',
            'queryId' : window.levelCollection.get(level).get("turns")[turn].queryId,
            'shuffledReferenceIds' : window.levelCollection.get(level).get("turns")[turn].shuffledReferenceIds
        });

    },

    doGuessDidntMatch: function() {
        var currentGuess = this.model.get("currentGuess");
        currentGuess += 1;
        this.model.set("currentGuess", currentGuess);

        // Show the correct information div for this guess level
        if (currentGuess === 1) {
            $("#guessDidntMatch1").show();
        } else if (currentGuess === 2) {
            $("#guessDidntMatch2").show();
        } else {
            $("#guessDidntMatch3").show();
            this.model.set("userGuessComplete", true);
        }

        // Reset the currentReference so the user can pick a different
        // guess the second time.
        this.model.set("currentReference",undefined);

        var level = this.model.get("currentLevel");
        var turn = this.model.get("currentTurn");
        recordUserEvent({
            'level' : 'gameEvent',
            'match' : 'didntMatch',
            'currentGuess' : currentGuess,
            'queryId' : window.levelCollection.get(level).get("turns")[turn].queryId,
            'shuffledReferenceIds' : window.levelCollection.get(level).get("turns")[turn].shuffledReferenceIds
        });

    },

    // When the user presses the next button, go to the next turn,
    // and if we are at the last turn, go to the next level
    nextButtonUp: function() {
        var level = this.model.get("currentLevel");
        var turn = parseInt(this.model.get("currentTurn"));
        var numTurns = window.levelCollection.get(level).get("turns").length;
        
        turn += 1;

        if (turn < numTurns) {
            var url = "/play/" + this.model.get("currentLevel") + "/" + turn;
        } else {
            var url = "/levelComplete/" + this.model.get("currentLevel");
        }
        app.navigate(url, {trigger: true});

    },

    pauseButtonDown: function() {
        $(this.el).find("#pauseButton").addClass('pressed');
    },

    pauseButtonUp: function() {
        $("#pauseScreen").fadeIn(200);
        $("#pauseMenu").show().animate({left: '+=500'}, 200);
    },

    achievementButtonDown: function() {
        $(this.el).find("#achievementButton").addClass('pressed');
    },

    achievementButtonUp: function() {
        app.navigate("achievements", {trigger: true});            
    },

    pauseMenuScoreBoardButtonUp: function() {
        app.navigate("scoreboard", {trigger: true});            
    },

    pauseMenuReplayLevelButtonUp: function() {
        var url = "/play/" + this.model.get("currentLevel") + "/0"
        this.hidePauseMenu();
        app.navigate(url, {trigger: true});
    },

    pauseMenuPlayButtonUp: function() {
        this.hidePauseMenu();
    },

    pauseMenuHelpButtonUp: function() {
        this.hidePauseMenu();
        app.navigate("help/0", {trigger: true});
    },

    hidePauseMenu: function() {
        $("#pauseScreen").fadeOut(200);
        $("#pauseMenu").animate({left: '-=500'}, 200);
    },

    initialize: function(){
        // All the calls
        this.queryCalls = new CallCollection(window.callCatalog);
        this.referenceCalls = new CallCollection(window.callCatalog);
    },

    render: function(){
        // The query at the top of the page
        // Both the queryView and referenceListView use the same model
        // as this one for sharing state.
        this.queryView = new QueryView({playModel : this.model, collection: this.queryCalls});
        
        // The references at the bottom of the page
        this.referenceListView = new ReferenceListView({playModel : this.model, collection: this.referenceCalls});

        $(this.el).empty();

        var level = this.model.get("currentLevel");
        var turn = this.model.get("currentTurn");

        // Render the query
        var queryId = window.levelCollection.get(level).get("turns")[turn].queryId;
        this.queryView.render(queryId);
        $(this.el).append(this.queryView.el);

        // Render the shuffled_references, shuffling the references if
        // they have not already been shuffled this game.
        var shuffledReferenceIds = window.levelCollection.get(level).get("turns")[turn].shuffledReferenceIds;
        //var shuffledReferenceIds = window.levelCollection.get(level).get("turns")[turn].referenceIds;
        this.referenceListView.render(shuffledReferenceIds);
        $(this.el).append(this.referenceListView.el);
        
        // Show the guess button or next button depending on if
        // the user has completed their rounds of guessing yet
        if (this.model.get("userGuessComplete")) {
            $(this.el).append(_.template($("#nextButtonTemplate").html())());
        } else {
            $(this.el).append(_.template($("#guessButtonTemplate").html())());
        }

        // Current level and turn
        $(this.el).append(_.template($("#playLevelTurnTemplate").html())(this.model.toJSON()));

        // Show the names of the calls on the bottom at the end of
        // the turn.
        if (this.model.get("userGuessComplete")) {
            $('.reference h2').show();
        } else {
            $('.reference h2').hide();
        }

        // The pause button
        $(this.el).append(_.template($("#pauseButtonTemplate").html())());
        $(this.el).append(_.template($("#pauseScreenTemplate").html())(window.levelCollection.get(level).toJSON()));

        // The achievements button
        $(this.el).append(_.template($("#achievementButtonTemplate").html())());
        $(this.el).append(_.template($("#achievementUnlockedTemplate").html())());

        // Add the information divs
        $(this.el).append(_.template($("#currentReferenceUndefinedTemplate").html())());
        $(this.el).append(_.template($("#guessMatched").html())());
        $(this.el).append(_.template($("#guessDidntMatch1").html())());
        $(this.el).append(_.template($("#guessDidntMatch2").html())());
        $(this.el).append(_.template($("#guessDidntMatch3").html())());

        // Hide the reference buttons for a specific amount of
        // time depending on the guess level
        if (this.model.get("userGuessComplete") != true) {
            var currentGuess = this.model.get("currentGuess");
            $(".reference img").each(function() {
                if (currentGuess == 0) {            
                    $(this).attr("src","assets/images/buttons/orcaButton.png");
                } else if (currentGuess == 1) {
                    $(this).delay(2000).queue(function() { 
                        $(this).attr("src","assets/images/buttons/orcaButton.png");
                        $(this).dequeue(); 
                    });
                } else if (currentGuess == 2) {
                    // Just leave the spectrogram up
                }
            });
        }
        
        return this;
    },

});


//
// The main start page of the application
//
MainView = Backbone.View.extend({
    events: {
        "xdown #mainPlayButton": "mainPlayButtonDown",
        "xup" : "xup",
        "xup #mainPlayButton": "mainPlayButtonUp",
    },

    mainPlayButtonDown: function(e){
        $(this.el).find("#mainPlayButton").addClass('pressed');
    },

    xup : function(e) {
        $(this.el).find(".pressButton").removeClass('pressed');            
    },
    
    mainPlayButtonUp: function(e){
        app.navigate("scoreboard", {trigger: true});
    },

    initialize: function(){
        this.template = _.template($("#mainTemplate").html());
    },

    render: function(){
        $(this.el).empty();
        $(this.el).append(this.template());
    }

});

//
// The help start page of the application
//
HelpView = Backbone.View.extend({
    events: {
        "xdown #helpNextButton": "helpNextButtonDown",
        "xup": "helpNext",
    },

    helpNextButtonDown: function(e) {
        $(this.el).find("#helpNextButton").addClass('pressed');
    },

    helpNext: function(e){
        this.helpScreen = parseInt(this.helpScreen);
        if (this.helpScreen > 2) {
            var url = "/play/" + playView.model.get("currentLevel") + "/" +  playView.model.get("currentTurn");
            app.navigate(url, {trigger: true});
        } else {
            var url = "/help/" + (this.helpScreen + 1);
            app.navigate(url, {trigger: true});
        }
    },

    initialize: function(){
        this.template = _.template($("#helpTemplate").html());
    },

    render: function(helpScreen){
        this.helpScreen = helpScreen;
        $(this.el).empty();
        $(this.el).append(this.template({ screen : helpScreen}));
    }

});

//
// The achievements page of the application
//
AchievementView = Backbone.View.extend({
    tagName: "span",
    className: "achievement",

    events: {
        "xdown": "xdown",
        "xup": "xup",
        // "change:locked" : "testReciever"
    },

    // testReciever : function(e) {
    //     console.log("here1");
    // },

    xdown: function(e) {
        if (this.model.get("locked") === false) {
            $(this.el).find('.image').addClass('click');
            var callId = this.model.get("callId");
            var call = this.allCalls.get(callId);
            playAudio(call.get("audio"));
        }
    },

    xup: function(e){
        $('.image').removeClass('click');
    },

    initialize: function() {
        this.allCalls = new CallCollection(window.callCatalog);
        // this.model.bind("test", this.testReciever);
    },

    render: function(){
        $(this.el).empty();

        var callId = this.model.get("callId");
        var call = this.allCalls.get(callId);

        var template = _.template($("#achievementViewTemplate").html());
        var html = template(call.toJSON());

        $(this.el).append(html);

        if (this.model.get("locked") === false) {
            $(this.el).find(".achievementLocked").hide();
        }


    }  
});


AchievementListView = Backbone.View.extend({
    events: {
        "xdown #achievementListBackButton": "achievementListBackButtonDown",
        "xup #achievementListBackButton": "achievementListBackButtonUp",
        "xup" : "xup",
    },

    xup : function(e) {
        $(this.el).find(".pressButton").removeClass('pressed');            
    },

    achievementListBackButtonDown: function(e) {
        $(this.el).find("#achievementListBackButton").addClass('pressed');
    },

    achievementListBackButtonUp: function(e) {
        var level = window.playModel.get("currentLevel");
        var turn = window.playModel.get("currentTurn");
        if (level === undefined || turn === undefined) {
            level = 1;
            turn = 0;
        }
        var url = "/play/" + level + "/" + turn;
        app.navigate(url, {trigger: true});
    },

    initialize: function(){
        this.template = _.template($("#achievementListTemplate").html());
        this.htmlData = undefined;
        this.htmlDataChanged = true;
        $(this.el).empty();
        this.generateHtml();
        $(this.el).append(this.htmlData);

        this.collection.bind("unlockAchievement", this.unlockAchievement);
    },

    unlockAchievement: function(achievement) { 
        var achievementId = "#" + achievement.get("callId");
        $(document).find(achievementId).find(".achievementLocked").hide();
    },

    generateHtml: function() {
        var that = this;
        this.collection.each(function(n) {
            var achievementView = new AchievementView({model: n});
            achievementView.render();
            $(that.el).append(achievementView.el);
        });
        
        this.htmlData = this.template();
        this.htmlDataChanged = false;
    },


    render: function(){
        return this;
    }

});

//
// The level
//
LevelView = Backbone.View.extend({
    tagName: "span",
    className: "level",

    events: {
        "xdown": "xdown",
        "xup": "xup",
    },

    xdown: function(e) {
        $(this.el).find(".scoreBoardUnlockedLevel").addClass('pressed');
    },

    xup: function(e){
        if (this.model.get("locked") != true) {
            // Go to the level that was clicked on
            var url = "/play/" + this.model.get("id") + "/0"
            app.navigate(url, {trigger: true});
        }
    },

    initialize: function() {
    },

    render: function(){
        $(this.el).empty();
        if (this.model.get("locked") === true) {
            var template = _.template($("#scoreBoardLockedLevelTemplate").html());
        } else {
            var template = _.template($("#scoreBoardUnlockedLevelTemplate").html());
        }
        var html = template(this.model.toJSON());
        $(this.el).append(html);

    }  
});

LevelListView = Backbone.View.extend({
    tagName: "span",
    
    initialize: function(){
    },
    
    render: function(){
        $(this.el).empty();
        var that = this;
        this.collection.each(function(n) {
            var levelView = new LevelView({model: n});
            levelView.render();
            $(that.el).append(levelView.el);
        });
        return this;
    }
});

//
// The view that shows all the levels of the game and the scores
// of these levels
//
ScoreBoardView = Backbone.View.extend({
    events: {
        "xdown #scoreBoardBackButton": "scoreBoardBackButtonDown",
        "xup" : "xup",
        "xup #scoreBoardBackButton": "scoreBoardBackButtonUp",
    },

    scoreBoardBackButtonDown: function(e){
        $(this.el).find("#scoreBoardBackButton").addClass('pressed');
    },

    xup : function(e) {
        $(this.el).find(".pressButton").removeClass('pressed');            
        $(this.el).find(".scoreBoardUnlockedLevel").removeClass('pressed');
    },
    
    scoreBoardBackButtonUp: function(e){
        app.navigate("", {trigger: true});
    },

    initialize: function(){
        this.template = _.template($("#scoreBoardTemplate").html());
    },

    render: function(){
        $(this.el).empty();
        $(this.el).append(this.template());
        window.levelListView.render();
        $(this.el).append(window.levelListView.el);
    }

});

//
// The levelComplete start page of the application
//
LevelCompleteView = Backbone.View.extend({
    events: {
        "xup" : "xup",

        "xdown #levelCompleteScoreBoardButton": "levelCompleteScoreBoardButtonDown",
        "xup #levelCompleteScoreBoardButton": "levelCompleteScoreBoardButtonUp",

        "xdown #levelCompleteReplayLevelButton": "levelCompleteReplayLevelButtonDown",
        "xup #levelCompleteReplayLevelButton": "levelCompleteReplayLevelButtonUp",

        "xdown #levelCompleteNextLevelButton": "levelCompleteNextLevelButtonDown",
        "xup #levelCompleteNextLevelButton": "levelCompleteNextLevelButtonUp",
    },

    xup : function(e) {
        $(this.el).find(".pressButton").removeClass('pressed');            
    },
    
    levelCompleteScoreBoardButtonDown : function(e) {
        $(this.el).find("#levelCompleteScoreBoardButton").addClass('pressed');
    },

    levelCompleteReplayLevelButtonDown : function(e) {
        $(this.el).find("#levelCompleteReplayLevelButton").addClass('pressed');
    },

    levelCompleteNextLevelButtonDown : function(e) {
        $(this.el).find("#levelCompleteNextLevelButton").addClass('pressed');
    },

    

    levelCompleteScoreBoardButtonUp: function(e){
        app.navigate("scoreboard", {trigger: true});
    },

    levelCompleteReplayLevelButtonUp: function(e){
        var url = "/play/" + playView.model.get("currentLevel") + "/0"
        app.navigate(url, {trigger: true});
    },

    levelCompleteNextLevelButtonUp: function(e){
        var url = "/play/" + (parseInt(playView.model.get("currentLevel")) + 1) + "/0"
        app.navigate(url, {trigger: true});
    },

    initialize: function(){
        
    },

    render: function(levelId){

        var level = window.levelCollection.get(levelId);

        // The levelComplete template
        $(this.el).empty();
        var template = _.template($("#levelCompleteTemplate").html());
        $(this.el).append(template(level.toJSON()));

        // The info for the reward for completing this level
        var rewardTemplateStr = "#reward" + levelId;
        var rewardTemplate = _.template($(rewardTemplateStr).html());
        $(this.el).append(rewardTemplate());

    }

});


// sness - This feels like it should be part of the playModel or
// something, but it doesn't quite fit in there.
function doQueryAndReferenceMatch(currentReference, currentQuery, match) {
    
    // Look over all the possible kinds of matches (currently the
    // "name" and the "matriline" of the call) and make an array
    // of all the matches and non-matches.
    var matches = _.map(match,function(n) {
        if (currentReference.get(n) == currentQuery.get(n)) {
            return true;
        } else {
            return false;
        }
    });
    
        // If any one of the attributes we are looking for didn't
        // match, the entire guess didn't match.
    if (_.include(matches,false)) {
        return false;
    } else {
        return true;
    }
    
}


