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
            'currentTimeSecEvent': 'doCurrentTimeSecEvent',
        },

        doCurrentTimeSecEvent: function(e, currentTimeSec) {
            vent.trigger("currentTimeSec:change", currentTimeSec);
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

    AuditoryImageModel = Backbone.Model.extend({
        defaults : {
            graphXLabel : 3000,
        },

        initialize: function() {
            var that = this;
            vent.on("currentTimeSec:change", function(currentTimeSec){
                that.set({ "currentTimeSec" : currentTimeSec});
            });

        },

    });

    AuditoryImageView = Backbone.View.extend({
        el: $('#auditoryImageContainer'),

        initialize: function() {
            this.model.bind('change:recording', this.doChangeRecording, this);
            this.model.bind('change:currentTimeSec', this.doChangeCurrentTimeSec, this);
            this.model.bind('change:graphXLabel', this.changeParams, this);
        },

        doChangeCurrentTimeSec: function() {
            console.log("AuditoryImageView doChangeCurrentTimeSec=" + this.model.get("currentTimeSec"));
            // this.load();
        },

        changeParams: function() {
            this.load();
        },

        events: { 
            "change input:text[name=graphXLabel]" : "graphXLabelChanged",
        },

        graphXLabelChanged: function() {
            var graphXLabel = $('input:text[name=graphXLabel]').val();
            this.model.set({graphXLabel : graphXLabel});
        },

        load: function() {
            // console.log("AuditoryImageView load");
        },

        render: function() {
            console.log("AuditoryImageView render");
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

            this.auditoryImageModel = new AuditoryImageModel();
            this.auditoryImageView = new AuditoryImageView({model : this.auditoryImageModel});

            // TODO(sness) - Debugging
            window.recordingModel = this.recordingModel;
            window.auditoryImageModel = this.auditoryImageModel;

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
