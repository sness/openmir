//
// openmirEditor - A javascript app using backbone.js that uses
// several openMir 
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    RecordingModel = Backbone.Model.extend({
        urlRoot: '/api/v1/recording/',

        defaults : {
            audioState : "0",
        },

        initialize: function() {
            this.bind('playPause', this.playPauseAudio);
            this.bind('change', this.idChange);

            var that = this;
            vent.on("extents:change", function(n){
                that.set({ "startSec": n.startSec, "endSec" : n.endSec});
            });

            this.audio = new Audio();

            var that = this;
            window.setInterval(function(){
                var audioState = that.get("audioState");
                if (audioState == "1") {
                    that.set("currentTimeSec", that.audio.currentTime);
                }
            },100);

        },

        idChange: function(e) {
            vent.trigger("recording:change", this);
        },

        seek: function(newTimeSec) {
            this.audio.currentTime = newTimeSec;
            var audioState = this.get("audioState");
        },

        currentTimeSecChanged: function() {
            var currentTimeSec = this.get("currentTimeSec");
        },

        parse: function(response) {
            this.audio.setAttribute("src",response.url);
            // this.audio.load();
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

    ShuttleView = Backbone.View.extend({
        el: $('#shuttle'),

        events: { 
            'click #playPause': 'clickPlayPause',
        },

        clickPlayPause: function() {
            recording.trigger("playPause");
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#shuttleTemplate").html());
            var html = template();
            $(this.el).append(html);
        }

    });

    SpectrogramModel = Backbone.Model.extend({
        defaults : {
            winSize : 1024
        },

        initialize: function() {
            var that = this;
            vent.on("recording:change", function(recording){
                that.set("recording", recording);
            });
        },
    });
                                           
    SpectrogramView = Backbone.View.extend({
        el: $('#spectrogramContainer'),

        initialize: function() {
            this.model.bind('change:recording', this.render, this);
        },

        events:{
            'scrollEvent': 'scrollEvent',
        },

        scrollEvent: function(e, startSec, endSec) {
            vent.trigger("extents:change", { 'startSec' : startSec, 'endSec' : endSec});
        },

        render: function() {
            $("#spectrogramControlsContainer").empty();
            var template = _.template($("#spectrogramControlsTemplate").html());
            var html = template(this.model.toJSON());
            $("#spectrogramControlsContainer").append(html);

            var spectrogramUrl = "/visualizations/spectrogram/" + this.model.get("recording").get("id");
            $("#showSpectrogram").recordingViewerSpectrogramPlugin({
                spectrogramUrl : spectrogramUrl,
                recordingLengthSec : this.model.get("recording").get("lengthSec"),
                winSize : this.model.get("winSize"),
                startSec : this.model.get("recording").get("startSec"),
                endSec : this.model.get("recording").get("endSec")
            });

        }
        
    });

    PitchModel = Backbone.Model.extend({
        defaults : {
            highHzCutoff : 3000,
            lowHzCutoff : 0,
            highHzWrap : 3000,
            lowHzWrap : 0,
            tolerance : 0.1,
            energyCutoff : 0.0,
            medianFilter : 1,
            histogramBins : 0,
        },

        initialize: function() {
            var that = this;
            vent.on("extents:change", function(n){
                that.set({ "startSec": n.startSec, "endSec" : n.endSec});
            });

            vent.on("recording:change", function(recording){
                that.set("recording", recording);
            });

        },

    });

    PitchView = Backbone.View.extend({
        el: $('#pitchContainer'),

        initialize: function() {
            this.model.bind('change:recording', this.doChangeRecording, this);
            this.model.bind('change:startSec', this.doChangeExtents, this);
            this.model.bind('change:pitches', this.doChangePitches, this);
            this.model.bind('change:highHzCutoff', this.changeParams, this);
            this.model.bind('change:lowHzCutoff', this.changeParams, this);
            this.model.bind('change:highHzWrap', this.changeParams, this);
            this.model.bind('change:lowHzWrap', this.changeParams, this);
            this.model.bind('change:tolerance', this.changeParams, this);
            this.model.bind('change:energyCutoff', this.changeParams, this);
            this.model.bind('change:medianFilter', this.changeParams, this);
            this.model.bind('change:histogramBins', this.changeParams, this);
        },

        doChangeExtents: function() {
            this.load();
        },

        doChangeRecording: function() {
            this.load();
        },

        doChangePitches: function() {
            this.render();
        },

        changeParams: function() {
            this.load();
        },

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

        load: function() {
            // Load the predictions from the server
            var recordingId = window.recordingModel.get("id");
            var startSec = window.recordingModel.get("startSec");
            var endSec = window.recordingModel.get("endSec");

            var highHzCutoff = this.model.get("highHzCutoff");
            var lowHzCutoff = this.model.get("lowHzCutoff");
            var highHzWrap = this.model.get("highHzWrap");
            var lowHzWrap = this.model.get("lowHzWrap");
            var tolerance = this.model.get("tolerance");
            var energyCutoff = this.model.get("energyCutoff");
            var medianFilter = this.model.get("medianFilter");
            var histogramBins = this.model.get("histogramBins");

            var baseUrl = '/visualizations/yin/';
            var timing = "?startSec=" + startSec + "&endSec=" + endSec;
            var cutoff = "&highHzCutoff=" + highHzCutoff + "&lowHzCutoff=" + lowHzCutoff;
            var wrap = "&highHzWrap=" + highHzWrap + "&lowHzWrap=" + lowHzWrap;
            var tolerance = "&tolerance=" + tolerance;
            var energyCutoff = "&energyCutoff=" + energyCutoff;
            var medianFilter = "&medianFilter=" + medianFilter;
            var histogramBins = "&histogramBins=" + histogramBins;
            var url = baseUrl + recordingId + timing + cutoff + wrap + tolerance + energyCutoff + medianFilter + histogramBins;
            
            // Remove any existing data and show the progress bar spinner
            this.model.set("pitches", [[0,0]]);
            this.$(".spinner").show();

            var that = this;
            $.ajax({
                url : url
            }).done(function(pitches) { 
                that.$(".spinner").hide();
                that.model.set("pitches", pitches);
            });
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

    EnergyModel = Backbone.Model.extend({
        defaults : {
        },

        initialize: function() {
            var that = this;
            vent.on("extents:change", function(n){
                that.set({ "startSec": n.startSec, "endSec" : n.endSec});
            });

            vent.on("recording:change", function(recording){
                that.set("recording", recording);
            });

        },

    });


    EnergyView = Backbone.View.extend({
        el: $('#energyContainer'),

        initialize: function() {
            this.model.bind('change:recording', this.doChangeRecording, this);
            this.model.bind('change:startSec', this.doChangeExtents, this);
            this.model.bind('change:energies', this.doChangeEnergies, this);
        },

        doChangeExtents: function() {
            this.load();
        },

        doChangeRecording: function() {
            this.load();
        },

        doChangeEnergies: function() {
            this.render();
        },

        events:{ 
        },


        load: function() {
            // Load the predictions from the server
            var recordingId = window.recordingModel.get("id");
            var startSec = window.recordingModel.get("startSec");
            var endSec = window.recordingModel.get("endSec");

            var baseUrl = '/visualizations/energy/';
            var timing = "?startSec=" + startSec + "&endSec=" + endSec;
            var url = baseUrl + recordingId + timing;
            
            // Remove any existing data and show the progress bar spinner
            this.model.set("energies", [[0,0]]);
            this.$(".spinner").show();

            var that = this;
            $.ajax({
                url : url
            }).done(function(energies) { 
                that.$(".spinner").hide();
                that.model.set("energies", energies);
            });
        },

        render: function() {
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

    // Global event dispatcher
    vent = _.extend({}, Backbone.Events);

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            this.recordingModel = new RecordingModel({ id : window.recordingId, lengthSec : window.recordingLengthSec });
            // this.recordingModel.fetch();

            this.spectrogramModel = new SpectrogramModel();
            this.spectrogramView = new SpectrogramView({model : this.spectrogramModel});

            this.pitchModel = new PitchModel();
            this.pitchView = new PitchView({model : this.pitchModel});

            this.energyModel = new EnergyModel();
            this.energyView = new EnergyView({model : this.energyModel});

            // this.shuttleView = new ShuttleView({model : this.recordingModel});

            // TODO(sness) - Debugging
            window.recordingModel = this.recordingModel;
            window.pitchModel = this.pitchModel;
            window.energyModel = this.energyModel;

            vent.on("extents:change", function(n){
                var url = n.startSec.toFixed(2) + "/" + n.endSec.toFixed(2);
                app.navigate(url);
            });

        },
        
        routes: {
            "": "mainView",
            ":startSec/:endSec": "mainView",
        },

        mainView: function(startSec, endSec) {
            if (!startSec) {
                startSec = 0;
                endSec = 20.000;
            }
            this.recordingModel.set({"startSec" : parseFloat(startSec),  "endSec" : parseFloat(endSec)});
            // this.shuttleView.render();
        },


    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
