// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "openMirEditor",
        defaults = {
            openMirServer: "http://openmir.sness.net:8888",
            openMirRecordingApi: "/api/v1/recording/",
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this._recording = null;
        this._raphael = null;
        this._playState = 0; // 0 - Paused, 1 - Play
        this._audio = null; 

        // UI elements
        this._slider = null;
        this._spectrogram = null;
        this._playShape = null;
        this._pauseShape = null;

        // The start and end of this recording (in seconds)
        this._startTime = 0.0;
        this._endTime = 50.0;
        this._lengthTime = this._endTime - this._startTime;

        // The size of the spectrogram image
        this._imageWidth = 1000;
        this._imageHeight = 200;

        // Spectrogram parameters
        this._lowHz = 0;
        this._highHz = 8000;

        // Slider
        this._imageYOffset = 30;

        this._base = null;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this._base = this;
            this._audio = new Audio();
            this._audio.setAttribute("src","http://media.openmir.sness.net:80/data/openmir/2005/449A.mp3");
            // this._audio.setAttribute("src","http://media.openmir.sness.net:80/data/openmir/2005/loon.mp3");
            this._audio.load(); 
            this.getRecording();
            this.createTimer();
        },

        createTimer: function() {
            var base = this;
            window.setInterval(function(){
                var currentTime = base._audio.currentTime;
                base._currentTime = currentTime;
                base.updateSlider(currentTime);
            },100);

        },

        // Construct the URL for getting the recording from the openMir server
        getRecordingUrl: function() {
            var server = this.options.openMirServer;
            var recordingApi = this.options.openMirRecordingApi;
            var audioFile = this.options.audioFile;
            var recordingUrl = server + recordingApi + "?url=" + audioFile;
            //console.log("recordingUrl=" + recordingUrl);
            return recordingUrl;
        },

        // Use $.ajax to get the recording from the openMir server
        getRecording: function() {
            //console.log("here");
            var base = this;
            $.ajax({
                url : this.getRecordingUrl(),
                dataType: "jsonp",
                success:function(json){
                    //console.log("Success");
                    base._recording = json.objects[0];
                    console.log(base._recording);
                        
                    base.draw();
                },
                error:function(){
                    //console.log("Error");
                }
            });
        },

        draw: function() {
            // Create raphael canvas
			this._raphael = Raphael(this.element, 1000, 250);

            this.drawSpectrogram();
            this.drawClips();

            // TODO(sness) - We should draw the buttons before we get
            // the recording data back from the server.  However, we
            // want the buttons to be on top, and this doesn't work
            // with Raphael.  Maybe some other framework allows you to
            // specify z-order.
            this.drawPlayPause();
            this.drawRewind();
            this.drawSlider();

        },


        drawSlider: function() {
            this._slider = this._raphael.path("M0.5,30.5L3.5,30.5L3.5,230.5L0.5,230.5,L0.5,30.5");
            //console.log("this._slider");
            //console.log(this._slider);
        },

        updateSlider: function() {
            // //console.log("updateSlider this._currentTime = " + this._currentTime);
            var sliderPosition = (this._imageWidth / this._lengthTime) * this._currentTime;
            // this._slider.attr({pathX: 200, pathY: 300});
            // var temp = this._slider.clone();
            // temp.translate(100,0);
            // this._slider.animate({path: temp.attr('path')}, 1000);
            // temp.remove();
            if (this._slider) {
                this._slider.transform("t" + sliderPosition + ",0");
            }
        },

        drawPlayPause: function() {
            //console.log("drawPlayPause");
            base = this;
            this._playShape = this._raphael.path("M6.684,25.682L24.316,15.5L6.684,5.318V25.682z").hover(
                function(e) {
                    this.attr({fill: "grey"});
                },
                function(e) {
                    this.attr({fill: "black"});
                }).attr(
                    {fill: '#000'}
                );
            this._pauseShape = this._raphael.path("M5.5,5.5L10.5,5.5L10.5,25.5L5.5,25.5L5.5,5.5ZM15.5,5.5L20.5,5.5L20.5,25.5,L15.5,25.5L15.5,5.5Z").hover(
                function(e) {
                    this.attr({fill: "grey"});
                },
                function(e) {
                    this.attr({fill: "black"});
                }).attr(
                    {fill: '#000'}
                ).hide();
            this._playShape.click(function(e) {
                //console.log("play click");
                base.doPlay();
            });
            this._pauseShape.click(function(e) {
                //console.log("pause click");
                base.doPause();
            });
        },

        drawRewind: function() {
            //console.log("drawRewind");
            base = this;
            var rewindShape = this._raphael.path("M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z")
                .transform("t50,0")
                .hover(
                    function(e) {
                        this.attr({fill: "grey"});
                    },
                    function(e) {
                        this.attr({fill: "black"});
                    }).attr(
                        {fill: '#000'}
                    );
            rewindShape.click(function(e) {
                //console.log("rewind click");
                base.doRewind();
            });
        },

        doPlay: function() {
            //console.log("playing audio");
            base._playState = 1;
            this._playShape.hide();
            this._pauseShape.show();
            this._audio.play(); 
        },

        doPause: function() {
            //console.log("pausing audio");
            base._playState = 0;
            this._playShape.show();
            this._pauseShape.hide();
            this._audio.pause(); 
        },

        doRewind: function() {
            //console.log("rewinding audio");
            this._audio.currentTime = 0; 
        },

        drawSpectrogram: function() {
            //console.log("drawSpectrogram");
            var server = this.options.openMirServer;
            var spectrogramUrl = this._recording.spectrogram

            // TODO(sness) - Change to samples
            var startMs = parseInt(this._startTime * 1000.0, 10);
            var endMs = parseInt(this._endTime * 1000.0, 10);

            var lowHz = this._lowHz;
            var highHz = this._highHz;

            var spectrogramOptions = "?startMs=" + startMs + "&endMs=" + endMs + "&spectrumtype=magnitude&width=1000&height=200&lowHz=" + lowHz + "&highHz=" + highHz;

            var url = server + spectrogramUrl + spectrogramOptions;
            this._spectrogram = this._raphael.image(url,0,30,1000,200);

            var base = this;
            this._spectrogram.dblclick(function(e) {
                var x = e.layerX;
                var y = e.layerY - base._imageYOffset;

                var audioPos = (base._lengthTime / base._imageWidth) * x;

                //console.log("x=" + x);
                //console.log("base._lengthTime=" + base._lengthTime);
                //console.log("base._imageWidth=" + base._imageWidth);
                //console.log("audioPos=" + audioPos);

                base.doChangeAudioPos(audioPos, base);
            });
        },

        drawClips: function() {
            console.log("doDrawClips");
            for (var i = 0; i < this._recording.clips.length; i++) {
                console.log(this._recording.clips[i]);
            };
        },


        doChangeAudioPos: function(audioPos, base) {
            //console.log("Changing audioPos to " + audioPos);
            base.doPause(); 
            base._audio.currentTime = audioPos;
            base.doPlay(); 
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
