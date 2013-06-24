//
// openmirEditor - A javascript app using backbone.js that uses
// several openMir 
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    //
    // The main model that loads the recording from the server and
    // coordinates all the actions between different UI elements.
    //
    RecordingModel = Backbone.Model.extend({
        openmirServer : 'http://openmir.sness.net:8888',
        urlRoot: 'http://openmir.sness.net:8888/api/v1/recording/',

        initialize: function() {
            this.bind('playPause', this.playPauseAudio);
            this.bind('change:url', this.urlChange);
            this.bind('change:currentTimeSec', this.currentTimeSecChanged);
            this.bind('change:startSec', this.startSecChanged);
            this.bind('change:predictions', this.predictionsChanged);

            this.spectrogramView = new SpectrogramView({model : this});
            this.shuttleView = new ShuttleView({model : this});
            this.shuttleView.render();

            this.dataView = new DataView({model : this});

            this.audio = new Audio();

            this.predictionCollection = new PredictionCollection();
            this.predictionCollection.fetch();
            this.predictionListView = new PredictionListView({ el: "#predictions", collection: this.predictionCollection});

            var that = this;
            window.setInterval(function(){
                var audioState = that.get("audioState");
                if (audioState == "1") {
                    that.set("currentTimeSec", that.audio.currentTime);
                }
            },100);

        },

        seek: function(newTimeSec) {
            this.audio.currentTime = newTimeSec;
            var audioState = this.get("audioState");
        },

        currentTimeSecChanged: function() {
            var currentTimeSec = this.get("currentTimeSec");
        },

        predictionsChanged: function() {
        },

        startSecChanged: function() {
            var startSec = this.get("startSec");
        },

        urlChange: function () {
            this.set("spectrogramUrl", "http://openmir.sness.net:8888/visualizations/spectrogram/" + this.id);
            this.spectrogramView.render();
            this.dataView.render();
        },

        defaults : {
            audioState : "0",
        },
        
        parse: function(response) {
            this.audio.setAttribute("src",response.url);
            this.audio.load();
            return response;
        },

        playPauseAudio: function() {
            var audioState = this.get("audioState");
            if (audioState == "1") {
                this.set("audioState", "0");
                this.audio.pause();
            } else {
                this.set("audioState", "1");
                var currentTime = this.get("currentTimeSec");
                this.audio.currentTime = currentTime;
                this.audio.play();
            }
        },

    });


    //
    // The shuttle controls
    //
    ShuttleView = Backbone.View.extend({
        el: $('#shuttle'),

        events: { 
            'click #playPause': 'clickPlayPause',
            'click #pageForward': 'clickPageForward',
            'click #pageBackward': 'clickPageBackward',
        },

        clickPlayPause: function() {
            recording.trigger("playPause");
        },

        clickPageForward: function() {
            var lengthSec = this.model.get("endSec") - this.model.get("startSec");
            var newStartSec = this.model.get("startSec") + lengthSec;
            var newEndSec = this.model.get("endSec") + lengthSec;
            var url = newStartSec + "/" + newEndSec;
            app.navigate(url, {trigger : true});
        },

        clickPageBackward: function() {
            var lengthSec = this.model.get("endSec") - this.model.get("startSec");
            var newStartSec = this.model.get("startSec") - lengthSec;
            var newEndSec = this.model.get("endSec") - lengthSec;
            var url = newStartSec + "/" + newEndSec;
            app.navigate(url, {trigger : true});
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#shuttleTemplate").html());
            var html = template();
            $(this.el).append(html);
        }

    });

    //
    // The Spectrogram View
    //
    SpectrogramView = Backbone.View.extend({
        el: $('#spectrogram'),

        initialize: function() {
            this.model.bind('change:currentTimeSec', this.changeCurrentTimeSec, this);
            this.model.bind('change:predictions', this.changePredictions, this);
            this.model.bind('change:startSec', this.changeStartSec, this);
        },

        events:{ 
            'seekSecEvent': 'seekSecEvent',
        },

        seekSecEvent: function(e,newTimeSec) {
            this.model.seek(newTimeSec);
        },

        changeCurrentTimeSec: function() {
            $(this.el).trigger('currentTimeSecEvent', [this.model.get("currentTimeSec")]);
        },

        changePredictions: function() {
            $(this.el).trigger('changePredictionsEvent', [this.model.get("predictions")]);
        },

        changeStartSec: function() {
            $(this.el).trigger('startSecEvent', [this.model.get("startSec"), this.model.get("endSec")]);
        },

        render: function() {
            $(this.el).openMirSpectrogram({
                spectrogramUrl : this.model.get("spectrogramUrl"),
                startSec : this.model.get("startSec"),
                endSec : this.model.get("endSec"),
                clips : this.model.get("clips"),
                predictions : this.model.get("predictions")
            });
        }
        
    });


    //
    // The data controls
    //
    DataView = Backbone.View.extend({
        el: $('#data'),

        events: { 
        },

        render: function(){
            var clips = this.model.get("clips")
            var clipsData = [];
            for (var i = 0; i < clips.length; i++) {
                var c = clips[i];
                var clipArray = [c.name, c.startSec, c.endSec, c.lowHz, c.highHz];
                clipsData.push(clipArray);
            }

            clipsColumns = [
                { "sTitle": "name" },
                { "sTitle": "startSec" },
                { "sTitle": "endSec" },
                { "sTitle": "lowHz" },
                { "sTitle": "highHz" }
            ];
            

            $('#data').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );

            $('#example').dataTable( {
                "aaData": clipsData,
                "aoColumns": clipsColumns
            });

        }

    });


    //
    // Predictions
    //
    Prediction = Backbone.Model.extend({
    });

    PredictionCollection = Backbone.Collection.extend({
        model: Prediction,
        
        url : "http://openmir.sness.net:8888/api/v1/prediction/?format=json",
        
        parse: function(response) {
            console.log("PredictionCollection parse");
            return response.objects;
        }
    });

    PredictionView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        doClick: function() {
            console.log("PredictionView doClick");
            console.log(this.model.id);
            
            // Load the predictions from the server
            var predictionId = this.model.id;
            var recordingId = window.recording.get("id");
            var baseUrl = 'http://openmir.sness.net:8888/predictions';
            var url = baseUrl + "/" + predictionId + "/" + recordingId;
            $.ajax({
                url : url
            }).done(function(predictions) { 
                // TODO(sness) - This feels wrong, we should be able
                // to access the parent Recording model through the
                // collection
                window.recording.set("predictions", predictions);
            });
            
        },

        initialize: function() {
        },

        render: function() {
            var template = _.template( $("#predictionTemplate").html(), this.model.toJSON() );
            $(this.el).append(template);
        }
    });

    PredictionListView = Backbone.View.extend({

        initialize: function() {
            this.listenTo(this.collection, "reset", this.render);
        },

        render: function() {
            $(this.el).empty();

            _.each(this.collection.models, function(n) {
                var model = this.collection.get(n);
                var predictionView = new PredictionView({model: model});
                predictionView.render();
                $(this.el).append(predictionView.el);
            }, this);
        }
    });
    

    //
    // Setup the app
    //


    window.recording = new RecordingModel({id: window.editorRecordingId});
    window.recording.fetch();


    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "mainView",
            ":startSec/:endSec": "mainView",
        },

        mainView: function(startSec, endSec) {
            if (!startSec) {
                startSec = 0;
                endSec = 50.000;
            }
            window.recording.set({"startSec" : parseFloat(startSec),  "endSec" : parseFloat(endSec)});
        }

    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
