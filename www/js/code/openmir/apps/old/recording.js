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

        defaults : {
            audioState : "0",
            highHzCutoff : 3000,
            lowHzCutoff : 0,
            highHzWrap : 3000,
            lowHzWrap : 0,
            tolerance : 0.1,
            energyCutoff : 0.0,
            medianFilter : 1,
            histogramBins : 0,
            winSize : 1024
        },
        

        initialize: function() {
            this.bind('playPause', this.playPauseAudio);
            this.bind('change:url', this.urlChange);
            this.bind('change:currentTimeSec', this.currentTimeSecChanged);
            this.bind('change:startSec', this.startSecChanged);
            // this.bind('change:predictions', this.predictionsChanged);

            var views = this.get("views");
            
            if (_.contains(views, 'spectrogram')) {
                this.spectrogramView = new SpectrogramView({model : this});
            }

            if (_.contains(views, 'shuttle')) {
                this.shuttleView = new ShuttleView({model : this});
                this.shuttleView.render();
            }

            if (_.contains(views, 'clipTable')) {
                this.clipTableView = new ClipTableView({model : this});
            }

            if (_.contains(views, 'pitch')) {
                this.pitchView = new PitchView({model : this});
            }

            if (_.contains(views, 'energy')) {
                this.energyView = new EnergyView({model : this});
            }

            this.audio = new Audio();

            if (_.contains(views, 'prediction')) {
                this.predictionCollection = new PredictionCollection();
                this.predictionCollection.fetch();
                this.predictionListView = new PredictionListView({ el: "#predictions", collection: this.predictionCollection});
            }
            
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

        // predictionsChanged: function() {
        // },

        // pitchesChanged: function() {
        //     this.pitchView.render();
        // },

        // energiesChanged: function() {
        //     this.energyView.render();
        // },

        startSecChanged: function() {
            var startSec = this.get("startSec");
        },

        urlChange: function () {
            this.set("spectrogramUrl", "http://openmir.sness.net:8888/visualizations/spectrogram/" + this.id);
            this.spectrogramView.render();

            if (_.contains(this.get("views"), 'clipTable')) {
                this.clipTableView.render();
            }
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
        el: $('#spectrogramContainer'),

        initialize: function() {
            this.model.bind('change:currentTimeSec', this.changeCurrentTimeSec, this);
            this.model.bind('change:predictions', this.changePredictions, this);
            this.model.bind('change:startSec', this.changeStartSec, this);
            this.model.bind('change:winSize', this.changeWinSize, this);
        },

        events:{ 
            'seekSecEvent': 'seekSecEvent',
            "change input:text[name=winSize]" : "inputWinSizeChanged",
        },

        inputWinSizeChanged: function() {
            var winSize = parseInt($('input:text[name=winSize]').val(),10);
            this.model.set({winSize : winSize});
        },

        seekSecEvent: function(e,newTimeSec) {
            this.model.seek(newTimeSec);
        },

        changeCurrentTimeSec: function() {
             $("#spectrogram").trigger('currentTimeSecEvent', [this.model.get("currentTimeSec")]);
        },

        changePredictions: function() {
             $("#spectrogram").trigger('changePredictionsEvent', [this.model.get("predictions")]);
        },

        changeStartSec: function() {
             $("#spectrogram").trigger('startSecEvent', [this.model.get("startSec"), this.model.get("endSec")]);
        },

        changeWinSize: function() {
             $("#spectrogram").trigger('winSizeEvent', [this.model.get("winSize")]);
        },

        render: function() {
            // Controls
            $("#spectrogramControlsContainer").empty();
            var template = _.template($("#spectrogramControlsTemplate").html());
            var html = template(this.model.toJSON());
            $("#spectrogramControlsContainer").append(html);

            $("#spectrogram").openMirSpectrogram({
                spectrogramUrl : this.model.get("spectrogramUrl"),
                startSec : this.model.get("startSec"),
                endSec : this.model.get("endSec"),
                winSize : this.model.get("winSize"),
                clips : this.model.get("clips"),
                predictions : this.model.get("predictions"),
            });

        }
        
    });

    //
    // The PitchView
    //
    PitchView = Backbone.View.extend({
        el: $('#pitchContainer'),

        events:{ 
            "change input:text[name=highHzCutoff]" : "highHzCutoffChanged",
            "change input:text[name=lowHzCutoff]" : "lowHzCutoffChanged",
            "change input:text[name=highHzWrap]" : "highHzWrapChanged",
            "change input:text[name=lowHzWrap]" : "lowHzWrapChanged",
            "change input:text[name=tolerance]" : "toleranceChanged",
            "change input:text[name=energyCutoff]" : "energyCutoffChanged",
            "change input:text[name=medianFilter]" : "medianFilterChanged",
            "change input:text[name=histogramBins]" : "histogramBinsChanged"
        },

        highHzCutoffChanged: function() {
            var highHzCutoff = $('input:text[name=highHzCutoff]').val();
            this.model.set({highHzCutoff : highHzCutoff});
        },

        lowHzCutoffChanged: function() {
            var lowHzCutoff = $('input:text[name=lowHzCutoff]').val();
            this.model.set({lowHzCutoff : lowHzCutoff});
        },

        highHzWrapChanged: function() {
            var highHzWrap = $('input:text[name=highHzWrap]').val();
            this.model.set({highHzWrap : highHzWrap});
        },

        lowHzWrapChanged: function() {
            var lowHzWrap = $('input:text[name=lowHzWrap]').val();
            this.model.set({lowHzWrap : lowHzWrap});
        },

        toleranceChanged: function() {
            var tolerance = $('input:text[name=tolerance]').val();
            this.model.set({tolerance : tolerance});
        },

        energyCutoffChanged: function() {
            var energyCutoff = $('input:text[name=energyCutoff]').val();
            this.model.set({energyCutoff : energyCutoff});
        },

        medianFilterChanged: function() {
            var medianFilter = $('input:text[name=medianFilter]').val();
            this.model.set({medianFilter : medianFilter});
        },

        histogramBinsChanged: function() {
            var histogramBins = $('input:text[name=histogramBins]').val();
            this.model.set({histogramBins : histogramBins});
        },

        initialize: function() {
            this.model.bind('change:currentTimeSec', this.changeCurrentTimeSec, this);
            this.model.bind('change:pitches', this.changePitches, this);
            this.model.bind('change:startSec', this.changeStartSec, this);
            this.model.bind('change:highHzCutoff', this.changeParams, this);
            this.model.bind('change:lowHzCutoff', this.changeParams, this);
            this.model.bind('change:highHzWrap', this.changeParams, this);
            this.model.bind('change:lowHzWrap', this.changeParams, this);
            this.model.bind('change:tolerance', this.changeParams, this);
            this.model.bind('change:energyCutoff', this.changeParams, this);
            this.model.bind('change:medianFilter', this.changeParams, this);
            this.model.bind('change:histogramBins', this.changeParams, this);
        },

        load: function() {
            // Load the predictions from the server
            var recordingId = window.recording.get("id");
            var startSec = this.model.get("startSec");
            var endSec = this.model.get("endSec");

            var highHzCutoff = this.model.get("highHzCutoff");
            var lowHzCutoff = this.model.get("lowHzCutoff");
            var highHzWrap = this.model.get("highHzWrap");
            var lowHzWrap = this.model.get("lowHzWrap");
            var tolerance = this.model.get("tolerance");
            var energyCutoff = this.model.get("energyCutoff");
            var medianFilter = this.model.get("medianFilter");
            var histogramBins = this.model.get("histogramBins");

            var baseUrl = 'http://openmir.sness.net:8888/visualizations/yin/';
            var timing = "?startSec=" + startSec + "&endSec=" + endSec;
            var cutoff = "&highHzCutoff=" + highHzCutoff + "&lowHzCutoff=" + lowHzCutoff;
            var wrap = "&highHzWrap=" + highHzWrap + "&lowHzWrap=" + lowHzWrap;
            var tolerance = "&tolerance=" + tolerance;
            var energyCutoff = "&energyCutoff=" + energyCutoff;
            var medianFilter = "&medianFilter=" + medianFilter;
            var histogramBins = "&histogramBins=" + histogramBins;
            var url = baseUrl + recordingId + timing + cutoff + wrap + tolerance + energyCutoff + medianFilter + histogramBins;
            $.ajax({
                url : url
            }).done(function(pitches) { 
                window.recording.set("pitches", pitches);
            });
        },

        changeStartSec: function() {
            this.load();
        },

        changeParams: function() {
            this.load();
        },

        changePitches: function() {
            this.render();
        },

        render: function() {
            $("#yin_y_axis").empty();
            $("#yin_chart").empty();

            // Controls
            $("#pitchControlsContainer").empty();
            var template = _.template($("#pitchControlsTemplate").html());
            var html = template(this.model.toJSON());
            $("#pitchControlsContainer").append(html);

            var pitches = this.model.get("pitches");
            data = [];
            for (var i = 0; i < pitches.length; i++) {
                var a = {x : pitches[i][0], y: pitches[i][1]}
                data.push(a);
            }

            var graph = new Rickshaw.Graph( {
                element: document.querySelector("#yin_chart"),
                width: 1000,
                height: 200,
                renderer: 'line',
                series: [ {
                    color: 'steelblue',
                    data: data
                } ]
            } );

            var axes = new Rickshaw.Graph.Axis.Time( { graph: graph } );

            var y_axis = new Rickshaw.Graph.Axis.Y( {
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('yin_y_axis'),
            } );

            graph.render();
        }
        
    });

    //
    // The EnergyView
    //
    EnergyView = Backbone.View.extend({
        el: $('#energyContainer'),

        initialize: function() {
            this.model.bind('change:currentTimeSec', this.changeCurrentTimeSec, this);
            this.model.bind('change:energies', this.changeEnergies, this);
            this.model.bind('change:startSec', this.changeStartSec, this);
        },

        load: function() {
            // Load the predictions from the server
            var recordingId = window.recording.get("id");
            var startSec = this.model.get("startSec");
            var endSec = this.model.get("endSec");
            var baseUrl = 'http://openmir.sness.net:8888/visualizations/energy/';
            var timing = "?startSec=" + startSec + "&endSec=" + endSec;
            var url = baseUrl + recordingId + timing;
            $.ajax({
                url : url
            }).done(function(energies) { 
                window.recording.set("energies", energies);
            });
        },

        events:{ 
        },

        changeStartSec: function() {
            this.load();
        },

        changeEnergies: function() {
            this.render();
        },

        render: function() {
            $(this.el).empty();
            
            $("#energy_y_axis").empty();
            $("#energy_chart").empty();

            var energies = this.model.get("energies");
            data = [];
            for (var i = 0; i < energies.length; i++) {
                var a = {x : energies[i][0], y: energies[i][1]}
                data.push(a);
            }

            var graph = new Rickshaw.Graph( {
                element: document.querySelector("#energy_chart"),
                width: 1000,
                height: 200,
                renderer: 'line',
                series: [ {
                    color: 'steelblue',
                    data: data
                } ]
            } );

            var axes = new Rickshaw.Graph.Axis.Time( { graph: graph } );

            var y_axis = new Rickshaw.Graph.Axis.Y( {
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('energy_y_axis'),
            } );

            graph.render();
        }
        
    });


    //
    // The data controls
    //
    ClipsTableView = Backbone.View.extend({
        el: $('#clipTable'),

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
            

            $('#clipTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );

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
            return response.objects;
        }
    });

    PredictionView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        doClick: function() {
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


    window.recording = new RecordingModel({id: window.editorRecordingId, views: window.recordingViews});
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
