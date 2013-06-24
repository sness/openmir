//
// orcaMatch : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//

TestCollection = Backbone.Collection.extend({
    // model: Call,
    
    // initialize: function (models, options) {
    // },
    
});

$(document).ready(function () {

    // The name of this application, used when
    window.appName = "orcaMatchObv";

    // The current query call
    var currentQuery;

    // The current reference call
    var currentReference = undefined;

    // Number of reference calls to show at one time
    var numReferenceCalls = 4;

    // The current score
    var currentQueryNum = 0;
    var totalCalls = 20;

    // Did the user already guess this turn?
    var guessed = false;

    // Log all tap and mousedown events
    $(document).bind('xdown', function(e) {
        recordBaseUserEvent('xdown',e);
    });

    $(document).bind('xup', function(e) {
        recordBaseUserEvent('xup',e);
    });


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

        currentItem: 0,

        nextItem: function() {
            this.currentItem = this.currentItem + 1;
            if (this.currentItem > this.collection.length - 1) {
                this.currentItem = 1;
            }
            this.render();
        },

        prevItem: function() {
            this.currentItem = this.currentItem - 1;
            if (this.currentItem < 1) {
                this.currentItem = this.collection.length - 1;
            }
            this.render();
        },

        setItem: function(itemNum) {
            this.currentItem = itemNum;
        },
        
        initialize: function(){
            _.bindAll(this, "renderQuery");
        },

        playAudio: function() {
            playAudio(currentQuery.get("audio"));
        },
        
        renderQuery: function(model){
            var queryView = new QueryView({model: model});
            queryView.render();
            $(this.el).append(queryView.el);
        },
        
        render: function(){
            $(this.el).empty();
            currentQuery = this.collection.models[this.currentItem];
            playAudio(currentQuery.get("audio"));
            this.renderQuery(currentQuery);

            // Update the current call
            var currentCallTemplate = _.template($("#current_call_template").html());
            var currentCallHtml = currentCallTemplate({call : this.currentItem});
            $('#score').html(currentCallHtml);
        }
    });

    //
    // The reference calls that the user has to pick from
    //

    ReferenceView = Backbone.View.extend({
        tagName: "div",
        className: "reference",

        events: {
            "xdown .image": "xdown",
            "xup .image": "xup",
            "xdown .play": "play",
        },
        
        initialize: function() {
        },
        
        xup: function(e) {
            $('.image').removeClass('click');
        },

        play: function(e) {
            playAudio(this.model.get("audio"));
        },

        xdown: function(e){
            this.selectItem();
        },

        selectItem: function() {
            currentReference = this.model;
            // $('.call').removeClass('selected');

            // this.$el.find('.call').addClass('selected');
            this.$el.find('.image').addClass('click');

            playClick();
            // stopAudio();

            // Do a guess from the user
            doGuess(this.model);

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

        selectItem: function(itemNum) {
            doGuess(this.collection.at(itemNum));
        },
        
        renderReference: function(model){
            var referenceView = new ReferenceView({model: model});
            referenceView.render();
            $(this.el).append(referenceView.el);
        },

        render: function(){
            $(this.el).empty();

            this.collection.each(function(n) {
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

    //
    // The references at the bottom of the page
    //
    var referenceView = new ReferenceListView({collection: referenceCalls});
    referenceView.render();
    $("#reference").html(referenceView.el);

    //
    // Do a guess
    //
    function doGuess(currentReference) {
        var findStr ='#' + currentReference.get("id");
        $(findStr).fadeTo(20,0.0).delay(20).fadeTo(20,1.0).fadeTo(20,0.0).delay(20).fadeTo(20,1.0);
        
        // $(".query .call img").attr("src","/assets/images/buttons/orca.png");

        recordUserEvent({
            'level' : 'gameEvent',
            'selection' : currentReference.get('id'),
            'elements' : findGameElements()
        });
        
        // Send the classification to the server
        sendData({
            'query' : currentQuery.get("id"),
            'reference' : currentReference.get("id")
        });
        
        $(".query .call").fadeTo(20,0.0).delay(20).fadeTo(20,1.0).fadeTo(20,0.0).delay(20).fadeTo(20,1.0);

         setTimeout(function() {
             queryView.nextItem();
         }, 200);
        
    }

    //
    // Prev and next buttons
    //
    $("#prev").click(function() {
        queryView.prevItem();
    });

    $("#next").click(function() {
        queryView.nextItem();
    });

    // Arrow keys
    $(document).keydown(function(e){
        // Left
        if (e.keyCode == 37) { 
            queryView.prevItem();
        }

        // Right
        if (e.keyCode == 39) { 
            queryView.nextItem();
        }

        // Spacebar
        if (e.keyCode == 32) { 
            queryView.playAudio();
        }

        // key "a"
        if (e.keyCode == 65) { 
            referenceView.selectItem(0);
        }

        // key "s"
        if (e.keyCode == 83) { 
            referenceView.selectItem(1);
        }

        // key "d"
        if (e.keyCode == 68) { 
            referenceView.selectItem(2);
        }

        // key "f"
        if (e.keyCode == 70) { 
            referenceView.selectItem(3);
        }

        // key "g"
        if (e.keyCode == 71) { 
            referenceView.selectItem(4);
        }


    });
    
});


