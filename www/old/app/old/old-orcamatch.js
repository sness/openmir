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

    // The current turn
    var currentTurn = 0;

    // Log all tap and mousedown events
    $(document).bind('vmousedown', function(e) {
        recordBaseUserEvent('vmousedown',e);
    });

    $(document).bind('vmouseup', function(e) {
        recordBaseUserEvent('vmouseup',e);
    });


    // Update the HTML score
    // TODO - refactor into a probably should be a Backbone model and view
    $('#score').html(currentScore + " / " + totalCalls);

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
    // The query call that we are asking the user to match
    //
    QueryView = Backbone.View.extend({
        tagName: "div",
        className: "query",

        events: {
            "vmousedown img": "vmousedown",
            "vmouseup img": "vmouseup",
        },

        vmouseup: function(e) {
            $('.image').removeClass('click');
        },
        
        initialize: function() {
        },
        
        vmousedown: function(e){
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
            // console.log("currentQuery=",currentQuery);
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
            "vmousedown img": "vmousedown",
            "vmouseup img": "vmouseup",
        },
        
        initialize: function() {
        },
        
        vmouseup: function(e) {
            $('.image').removeClass('click');
        },

        vmousedown: function(e){
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
            // console.log("allMatchingCalls.length",allMatchingCalls.length);
            // console.log("rnd=",rnd);
            var displayCalls = [allMatchingCalls[rnd]];

            for (i = 0; i < numReferenceCalls - 1; i++) {
                var rnd = Math.floor(Math.random() * allNonMatchingCalls.length);
                var call = allNonMatchingCalls[rnd];
                displayCalls.push(call);
            }

            // Randomize the order of the calls
            shuffle(displayCalls);

            _.each(displayCalls, function(n) {
                // console.log("n=",n);
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

    $('#next').bind('vmousedown', function() {
        console.log("next");
        currentTurn += 1;
        showTurn();
    });

    // sness - hack to show instructions_1 first

    function showTurn() {
        console.log("currentTurn=",currentTurn);
        $.mobile.changePage(window.turnData[currentTurn].url);
    };

    showTurn();

    function doGuess() {
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

                // TODO - refactor into template
                $('#score').html(currentScore + " / " + totalCalls);

                guessed = true;

                // TODO - Should this be a property of the model?
                $('h2').show();
                
                // Set the Guess button to next
                // TODO - The Guess button should also be a backbone model.
                $('#guess').html("Next");

            } else {
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
        } else {
            $("#match").html("Please make a guess first");
        }

    }
    
    // Guess button
    $('#guess').bind('vmousedown', function() {

    });



});


