//
// orcaMatch : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    // The name of this application, used when
    window.appName = "orcaMatch";

    // The current query call
    var currentQuery;

    // The current reference call
    var currentReference = undefined;

    // Number of reference calls to show at one time
    var numReferenceCalls = 4;

    // The current score
    var currentScore = 0;
    var totalCalls = 0;

    // Did the user already guess this turn?
    var guessed = false;

    // Log all tap and mousedown events
    $(document).bind('xdown', function(e) {
        recordBaseUserEvent('xdown',e);
    });

    $(document).bind('xup', function(e) {
        recordBaseUserEvent('xup',e);
    });


    // Update the HTML score
    // TODO - refactor into a probably should be a Backbone model and view
    $('#score').html("score = " + currentScore);

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
    // The current score of the user
    //
    Score = Backbone.Model.extend({
        defaults : {
            score : 0
        },

        getScore: function() {
            return this.get("score");
        },

        increment: function() {
            this.set({score : this.get("score") + 1 });
        }
        
    });

    ScoreView = Backbone.View.extend({
        tagName: "div",
        id: "score",

        initialize: function() {
            this.model.bind('change', this.render, this);
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#score_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }
        
    });


    //
    // The query call that we are asking the user to match
    //
    QueryView = Backbone.View.extend({
        tagName: "div",
        className: "query",

        events: {
            "xdown img": "xdown",
            "xup img": "xup",
        },

        xup: function(e) {
            $('.image').removeClass('click');
        },
        
        initialize: function() {
        },
        
        xdown: function(e){
            this.$el.find('.image').addClass('click');
            playAudio(this.model.get("audio"));
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#query_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    // TODO - I think I'm doing this wrong here.  There should be a
    // model that does the random generaton, and this QueryListView
    // should reference it.
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
            var rnd = Math.floor(Math.random() * this.collection.models.length);
            currentQuery = this.collection.models[rnd];
            this.renderQuery(this.collection.models[rnd]);
        }
    });

    //
    // The reference calls that the user has to pick from
    //

    ReferenceView = Backbone.View.extend({
        tagName: "div",
        className: "reference",

        events: {
            "xdown img": "xdown",
            "xup img": "xup",
        },
        
        initialize: function() {
        },
        
        xup: function(e) {
            $('.image').removeClass('click');
        },

        xdown: function(e){
            currentReference = this.model;
            $('.call').removeClass('selected');

            this.$el.find('.call').addClass('selected');
            this.$el.find('.image').addClass('click');
            playAudio(this.model.get("audio"));
            recordUserEvent({
                'level' : 'interfaceEvent',
                'type' : 'reference',
                'name' : 'click',
                'modelId' : this.model.id
            });
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#reference_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    ReferenceListView = Backbone.View.extend({
        tagName: "div",
        
        initialize: function(){
            _.bindAll(this, "renderReference");
        },
        
        renderReference: function(model){
            var referenceView = new ReferenceView({model: model});
            referenceView.render();
            $(this.el).append(referenceView.el);
        },
        
        render: function(){
            $(this.el).empty();

            var allMatchingCalls = [];
            var allNonMatchingCalls = [];

            this.collection.each(function(n) {
                if ((n.get("name") === currentQuery.get("name"))) {
                    allMatchingCalls.push(n);
                } else {
                    allNonMatchingCalls.push(n);
                }
            });

            var rnd = Math.floor(Math.random() * allMatchingCalls.length);
            var displayCalls = [allMatchingCalls[rnd]];

            for (i = 0; i < numReferenceCalls - 1; i++) {
                var rnd = Math.floor(Math.random() * allNonMatchingCalls.length);
                var call = allNonMatchingCalls[rnd];
                displayCalls.push(call);
            }

            // Randomize the order of the calls
            shuffle(displayCalls);

            _.each(displayCalls, function(n) {
                this.renderReference(n);
            }, this);




        }
    });


    //
    // All the calls
    //
    var queryCalls = new CallCollection(window.callData);
    var referenceCalls = new CallCollection(window.callCatalog);

    //
    // The query at the top of the page
    //
    var queryView = new QueryListView({collection: queryCalls});
    queryView.render();
    $("#query").html(queryView.el);

    window.calls = queryCalls;

    //
    // The references at the bottom of the page
    //
    var referenceView = new ReferenceListView({collection: referenceCalls});
    referenceView.render();
    $("#reference").html(referenceView.el);

    //
    // The score
    //
    // var score = new Score();
    // var scoreView = new ScoreView({model: score});
    // scoreView.render();
    // $("#score").html(scoreView.el);


    function doNext() {
        guessType = "next";
        // Reset the current reference call
        currentReference = undefined;
        guessed = false;
        $('h2').hide();
        
        // Re-render the views, which randomly chooses new calls
        queryView.render();
        referenceView.render();
        $("#match").html("");
        
        // Reset the text in the guess button to Guess
        $('#guess').html("Guess");
    }


    $('#skip').bind('xdown', function() {
        doNext();
    });
    
    // Guess button
    $('#guess').bind('xdown', function() {
        var guessType = "pleaseGuessFirst";
        if (currentReference != undefined) {
            guessType = "guess";
            if (guessed === false) {
                var userMatch;
                if (currentReference.get("name") == currentQuery.get("name")) {
                    $("#match").html("Matched!");
                    currentScore += 1;
                    match = true;
                    
                } else {
                    $("#match").html("Didn't match...");
                    match = false;
                }
                totalCalls += 1;
                
                recordUserEvent({
                    'level' : 'gameEvent',
                    'match' : match,
                    'selection' : currentReference.get('id'),
                    'elements' : findGameElements()
                });

                // Send the classification to the server
                sendData({
                    'query' : currentQuery.get("id"),
                    'reference' : currentReference.get("id")
                });

                // TODO - refactor into template
                $('#score').html("score = " + currentScore);

                guessed = true;

                // TODO - Should this be a property of the model?
                $('h2').show();
                
                // Set the Guess button to next
                // TODO - The Guess button should also be a backbone model.
                $('#guess').html("Next");

            } else {
                doNext();
            }
        } else {
            $("#match").html("Please make a guess first");
        }

        recordUserEvent({
            'level' : 'interfaceEvent',
            'type' : guessType
        });



    });



});


