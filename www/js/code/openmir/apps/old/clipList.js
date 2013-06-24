//
// openmirEditor - A javascript app using backbone.js that uses
// several openMir 
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    ClipModel = Backbone.Model.extend({
        
        initialize: function() {
        },

        attachMainModel: function(mainModel) {
            this.mainModel = mainModel;
        },

    });

    ClipView = Backbone.View.extend({
        initialize: function() {
            this.model.bind('change', this.render);
            this.model.mainModel.bind('change:highHzCutoff', this.testChange);
        },

        testChange: function() {
            console.log("testChange");
             $(this.el).trigger('testEvent', "test123");            
        },

        render: function() {
            $(this.el).clipListClip({
                recordingId : this.model.get("recording").id,
                startSec : this.model.get("startSec"),
                endSec : this.model.get("endSec"),
                name : this.model.get("name"),
                highHzCutoff : this.model.mainModel.get("highHzCutoff"),
                lowHzCutoff : this.model.mainModel.get("lowHzCutoff"),
                highHzWrap : this.model.mainModel.get("highHzWrap"),
                lowHzWrap : this.model.mainModel.get("lowHzWrap"),
                tolerance : this.model.mainModel.get("tolerance"),
                energyCutoff : this.model.mainModel.get("energyCutoff"),
                medianFilter : this.model.mainModel.get("medianFilter"),
                histogramBins : this.model.mainModel.get("histogramBins")
            });
            return this;
        }
    });

    ClipCollection = Backbone.Collection.extend({
        model: ClipModel,

        initialize: function() {
        },
    });

    ClipCollectionView = Backbone.View.extend({
        el: $('#clipCollectionViewContainer'),
        
        initialize: function() {
            // this.collection.bind('change', this.render);
            this.render();

        },

        render: function() {
            $(this.el).empty();
            var that = this;
            this.collection.each(function(clip) {
                var cv = new ClipView({model: clip});
                $(that.el).append(cv.render().el);
            });
            return this;
        }
        
    });


    //
    // The main model that loads the recording from the server and
    // coordinates all the actions between different UI elements.
    //
    MainModel = Backbone.Model.extend({
        urlRoot: 'http://openmir.sness.net:8888/api/v1/clipList/',

        defaults : {
            audioState : "0",
            highHzCutoff : 500,
            lowHzCutoff : 0,
            highHzWrap : 500,
            lowHzWrap : 0,
            tolerance : 0.1,
            energyCutoff : 0.0,
            medianFilter : 1,
            histogramBins : 0,
            audioUrl : "audio"
        },

        initialize: function() {
            console.log("MainModel initialize");
            this.bind('change:clipListItems', this.changeClipListItems);
            this.clipListControlsView = new ClipListControlsView({model : this});
            this.clipListControlsView.render();
            this.bind('change:highHzCutoff', this.changeHighHzCutoff);
        },

        changeHighHzCutoff: function() {
            console.log("changeHighHzCutoff");
        },

        testChange: function() {
            console.log("test change");
        },

        changeClipListItems: function() {
            console.log("ClipModel changeClipListItems");
            var clipListItems = this.get("clipListItems");
            var clips = [];
            var that = this;
            this.clipViews = [];
            _.each(clipListItems, function(n) {
                var clip = new ClipModel(n.clip);
                clip.attachMainModel(that);
                clips.push(clip);
            });
            window.clipCollection = new ClipCollection(clips);
            window.clipCollectionView = new ClipCollectionView({collection : window.clipCollection});
        },

        parse: function(response) {
            console.log("MainModel parse");
            return response;
        },

    });


    //
    // The ClipListControls View
    //
    ClipListControlsView = Backbone.View.extend({
        el: $('#mainControlsContainer'),

        initialize: function() {
            this.model.bind('change:winSize', this.changeWinSize, this);
        },

        events:{ 
            "change input:text[name=highHzCutoff]" : "inputHighHzCutoffChanged",
        },

        inputHighHzCutoffChanged: function() {
            console.log("inputHighHzCutoffChanged");
            var highHzCutoff = parseInt($('input:text[name=highHzCutoff]').val(),10);
            this.model.set({highHzCutoff : highHzCutoff});
        },

        render: function() {
            $("#mainControlsContainer").empty();
            var template = _.template($("#clipListControlsTemplate").html());
            var html = template(this.model.toJSON());
            $("#mainControlsContainer").append(html);
        }
        
    });


    // window.mainModel = new MainModel({id: window.mainModelId});
    window.mainModel = new MainModel({id: 1});
    window.mainModel.fetch();

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "mainView",
        },

        mainView: function() {
        }

    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
