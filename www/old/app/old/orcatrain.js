//
// orcaTalk : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    // Don't allow the user to scroll the screen
    document.addEventListener("touchmove", preventBehavior, false);

    // Disable fancy page transitions in jQuerymobile
    $.mobile.defaultPageTransition = 'none';

    // The name of this application, used when
    window.appName = "orcaMatch";

    // The current query call
    var currentQuery;

    // The current reference call
    var currentReference = undefined;

    // The current score
    // var currentScore = 0;

    // The score amount for this turn
    var scoreIncrement = 30;

    // The total calls shown to the user
    var totalCalls = 0;

    // The current guess level
    var guessLevel = 0;

    // The number of stars to display
    var numStars = 3;

    // Did the user make a match already
    var userGuessComplete = false;

    // Did the users guess match
    var userGuessMatched = false;

    //
    // A single call
    //
    Call = Backbone.Model.extend({
        defaults : {
            flipped : false,
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
            var maxScore = this.get("maxScore");
            var stars =  Math.floor(score / maxScore * numStars);
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
    // A collection of levels
    //
    LevelCollection = Backbone.Collection.extend({
        model: Level,

        initialize: function (models, options) {
        },
        
    });

    //
    // The query call that we are asking the user to match
    //
    QueryView = Backbone.View.extend({
        tagName: "div",
        className: "query",

        events: {
            "myDown": "myDown",
            "myUp": "myUp",
        },

        myDown: function(e){
            this.$el.find('.image').addClass('click');
            playAudio(this.model.get("audio"));
        },
        
        myUp: function(e) {
            $('.image').removeClass('click');
        },

        initialize: function() {
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#query_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);

        }  
    });

    QueryListView = Backbone.View.extend({
        tagName: "div",
        
        initialize: function(){
            _.bindAll(this, "renderQuery");
        },
        
        renderQuery: function(model){
            var queryView = new QueryView({model: model});
            queryView.render();
            $(this.el).append(queryView.el);
        },
        
        render: function(){
            $(this.el).empty();
            var currentStep = getCurrentStep();
            currentQueryId = window.stepData[currentStep].query;
            currentQuery = this.collection.get(currentQueryId);
            this.renderQuery(currentQuery);

        }
    });

    //
    // The reference calls that the user has to pick from
    //
    ReferenceView = Backbone.View.extend({
        tagName: "div",
        className: "reference",

        events: {
            "myDown": "myDown",
            "myUp": "myUp",
        },
        
        initialize: function() {
        },
        
        myUp: function(e) {
            $('.image').removeClass('click');
        },

        myDown: function(e){
            currentReference = this.model;
            $('.call').removeClass('selected');

            this.$el.find('.call').addClass('selected');
            this.$el.find('.image').addClass('click');
            playAudio(this.model.get("audio"));
            // recordUserEvent({
            //     'level' : 'interfaceEvent',
            //     'type' : 'reference',
            //     'name' : 'click',
            //     'modelId' : this.model.id
            // });
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#reference_template").html());
            var model = this.model.toJSON();
            var html = template(model);
            $(this.el).append(html);
        }  
    });

    ReferenceListView = Backbone.View.extend({
        tagName: "div",
        
        initialize: function(){
            _.bindAll(this, "renderReference");

            this.displayCalls = [];
        },
        
        renderReference: function(model){
            var referenceView = new ReferenceView({model: model});
            referenceView.render();
            $(this.el).append(referenceView.el);
        },
        
        generateDisplayCalls: function() {

            this.displayCalls = [];
            
            var currentStep = getCurrentStep();
            
            // Add all the calls to the displayCalls array
            _.each(window.stepData[currentStep].references, function(n) {
                this.displayCalls.push(this.collection.get(n));
            }, this);
            
            // Randomize the order of the calls
            shuffle(this.displayCalls);
        },
        
        render: function(){
            $(this.el).empty();

            _.each(this.displayCalls, function(n) {
                this.renderReference(n);
            }, this);

        }
    });

    //
    // The scoreBoard
    //
    ScoreBoardView = Backbone.View.extend({
        tagName: "span",
        className: "scoreBoard",

        events: {
            "myDown": "myDown",
        },

        myDown: function(e){
            // Go to the level that was clicked on
            var step = this.model.get("step");
            setCurrentStep(step);
            showCurrentStep();
        },

        initialize: function() {
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#scoreBoardTemplate").html());
            
            var html = template(this.model.toJSON());
            $(this.el).append(html);

        }  
    });

    ScoreBoardListView = Backbone.View.extend({
        tagName: "span",
        
        initialize: function(){
            _.bindAll(this, "renderScoreBoard");
        },
        
        renderScoreBoard: function(model){
            var scoreBoardView = new ScoreBoardView({model: model});
            scoreBoardView.render();
            $(this.el).append(scoreBoardView.el);
        },
        
        render: function(){
            $(this.el).empty();
            var that = this;
            this.collection.each(function(n) {
                that.renderScoreBoard(n);
            });

        }
    });

    //
    // The levelComplete
    //
    LevelCompleteView = Backbone.View.extend({
        tagName: "span",
        className: "levelComplete",

        events: {
        },

        initialize: function() {
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#levelCompleteTemplate").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);

        }  
    });

    //
    // All the calls
    //
    var queryCalls = new CallCollection(window.callCatalog);
    var referenceCalls = new CallCollection(window.callCatalog);

    // The levels
    var levels = new LevelCollection(window.levelData);

    //
    // The query at the top of the page
    //
    var queryView = new QueryListView({collection: queryCalls});
    $("#query").html(queryView.el);

    //
    // The references at the bottom of the page
    //
    var referenceView = new ReferenceListView({collection: referenceCalls});
    $("#reference").html(referenceView.el);

    //
    // The scoreboard
    //
    var scoreBoardView = new ScoreBoardListView({collection: levels});
    $("#scoreBoard").html(scoreBoardView.el);

    //
    // Bind actions to buttons
    //
    $('.next').bind('myDown', function() {
        doNextTurn();
    });

    $(".restart").bind('myDown', function() {
        restartGame();
    });

    $(".backtogame").bind('myDown', function() {
        showCurrentStep();
    });

    $('.guess').bind('myDown', function() {
        doGuess();
    });

    function renderReferenceNames() {
        if (userGuessComplete === true) {
            $('.reference h2').show();
        }
    }

    // Show the correct text fort the match area
    function renderMatchArea() {
        if (userGuessComplete === true) {
            if (userGuessMatched === true) {
                $("#match").html("Matched!");
            } else {
                $("#match").html("The correct answer was : " + currentQuery.get("name"));
            }
            return;
        }
        
        if (guessLevel === 0) {
            $("#match").html("First try (30 points)<br />three tries left");
        } else if (guessLevel === 1) {
            $("#match").html("Didn't Match, try again<br />Second try (15 points)<br />two tries left");
        } else if (guessLevel === 2) {
            $("#match").html("Didn't Match, try again<br />Third try (5 points)<br />last try...");
        }
    }

    // Update the scoreIncrement
    function updateScoreIncrement() {
        if (guessLevel == 0) {
            scoreIncrement = 30;
        } else if (guessLevel == 1) {
            scoreIncrement = 15;
        } else if (guessLevel == 2) {
            scoreIncrement = 5;
        }
    }

    // Show the reference button if guessLevel == 0, show the image
    // briefly if guessLevel == 1, show the image if guessLevel == 2
    function updateReferenceIcons() {
        $("#reference img").each(function() {
            if (guessLevel == 0) {            
                $(this).attr("src","assets/images/buttons/orca.png");
            } else if (guessLevel == 1) {
                $(this).delay(500).queue(function() { 
                    $(this).attr("src","assets/images/buttons/orca.png");
                    $(this).dequeue(); 
                });
            } else if (guessLevel == 2) {
                // Just leave the spectrogram up
            }
        });
    }

    function showGuessLevel() {
        referenceView.render();
        renderMatchArea();
        updateScoreIncrement();
        updateReferenceIcons();
    }

    function doGuess() {
        if (currentReference === undefined) {
            doGuessCurrentReferenceUndefined();
            return;
        }
        if (currentReference.get("name") == currentQuery.get("name")) {
            doGuessMatched();
        } else {
            doGuessDidntMatch();
        }
    }

    function doGuessCurrentReferenceUndefined() {
        $("#match").html("Please make a guess first");
    }

    function hideShowGuessNextButtons() {
        if (userGuessComplete === true) {
            $('#guess').hide();
            $('#next').show();
        } else {
            $('#guess').show();
            $('#next').hide();
        }
    }

    function doGuessMatched() {
        userGuessComplete = true;
        renderMatchArea();

        // Add the score increment to the score
        levels.get(getCurrentLevel()).addToScore(scoreIncrement);
        hideShowGuessNextButtons();
        referenceView.render();
        showScoreAndTurn();
    }

    function doGuessDidntMatch() {
        guessLevel += 1;
        if (guessLevel > 2) {
            userGuessMatched = false;
            hideShowGuessNextButtons();
            $('h2').show();
            return;
        }
        doGuessLevel();
    }


    function restartGame() {
        levels.each(function(n) {
            n.set("score",0);
        });

        localStorage.removeItem("currentStep");
        localStorage.removeItem("currentLevel");
        showCurrentStep();
    }

    //
    // Show the current turn
    //
    function showCurrentStep() {
        updateScoreArea();

        var currentStep = getCurrentStep();
        $.mobile.changePage(window.stepData[currentStep].url);

        if (location.hash.split("?")[0] == "#orcamatch") {
            queryView.render();
            referenceView.render();
            
            doGuessLevel();

            $('#guess').show();
            $('#next').hide();
            
            showScoreAndTurn();
        } else if (location.hash.split("?")[0] == "#level_complete") {

            // sness - Temporarily skip next level screen
            incrementCurrentLevel();
            doNextTurn();

            // levelCompleteView.render();

        } else {
            $('#next').show();
        }
    };

    function showScoreAndTurn() {
        // Update the HTML score
        var currentStep = getCurrentStep();
        // $('#turn').html("Turn = " + window.stepData[currentStep].turn);
        // $('#score').html("Score = " + currentScore);
    }

    function doNextTurn() {
        userGuessComplete = false;
        currentReference = undefined;
        incrementCurrentStep();
        referenceView.generateDisplayCalls();

        // Reset the guess level
        guessLevel = 0;

        showCurrentStep();

    }

    //
    // The current level the user is on
    //
    function getCurrentLevel() {
        var currentLevel = localStorage.getItem("currentLevel");
        if (currentLevel === null) {
            currentLevel = 1;
            localStorage.setItem("currentLevel",currentLevel)
        }
        return parseInt(currentLevel,10);
    }

    function incrementCurrentLevel() {
        var currentLevel = localStorage.getItem("currentLevel");
        currentLevel = parseInt(currentLevel,10) + 1;
        localStorage.setItem("currentLevel",currentLevel)
    }

    //
    // The current step the user is on
    //
    function getCurrentStep() {
        var currentStep = localStorage.getItem("currentStep");
        if (currentStep === null) {
            currentStep = 0;
            localStorage.setItem("currentStep",currentStep)
        }
        return parseInt(currentStep,10);
    }

    function setCurrentStep(step) {
        localStorage.setItem("currentStep",step);
    }

    function incrementCurrentStep() {
        var currentStep = localStorage.getItem("currentStep");
        currentStep = parseInt(currentStep,10) + 1;
        localStorage.setItem("currentStep",currentStep)
    }

    //
    // The score board
    //
    function renderScoreBoard() {
        scoreBoardView.render();
    }

    $(document).bind( "pagechange", function( event, data ){
        var pageId = data.toPage.attr("id");
        if (pageId === "scoreboard") {
            renderScoreBoard();
        }
    });

    // When the app starts, show the current step
    referenceView.generateDisplayCalls();
    showCurrentStep();



});


