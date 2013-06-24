// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "openMirSpectrogram",
        defaults = {
            startSec : 0,
            endSec : 50.000,
            lowHz : 0,
            highHz : 8000,
            spectrogramWidth : 1000,
            spectrogramHeight : 200,
            spectrogramXOffset : 100,
            spectrogramYOffset : 0,
            axesXMarginRight : 100,
            axesYMarginBottom : 100
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        // Raphael paper element
        this._paper = null;

        // UI elements
        this._slider = null;
        this._spectrogram = null;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var that = this;

			this._paper = Raphael(this.element, this.options.spectrogramWidth + this.options.spectrogramXOffset + this.options.axesXMarginRight, 
                                  this.options.spectrogramHeight + this.options.axesYMarginBottom);
            
            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('currentTimeSecEvent', function(event, currentTimeSec) {
                that._currentSec = currentTimeSec;
                that.updateSlider();
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('changePredictionsEvent', function(event, predictions) {
                that.options.predictions = predictions;
                that.drawPredictions();
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('startSecEvent', function(event, startSec, endSec) {
                that.options.startSec = startSec;
                that.options.endSec = endSec;
                that.draw();
            });

            // Send a seekSecEvent on a double click
            $(this.element).dblclick(function(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                var audioPosSec = ((that.options.lengthSec / (that.options.spectrogramWidth)) * (x - that.options.spectrogramXOffset)) + that.options.startSec;
                $(that.element).trigger('seekSecEvent', [audioPosSec]);
            });

            this.draw();
        },

        draw: function() {
            this.options.lengthSec = this.options.endSec - this.options.startSec;
            this.options.lengthHz = this.options.highHz - this.options.lowHz;
            this.options.pixelsPerSec = this.options.spectrogramWidth / this.options.lengthSec;
            this.options.pixelsPerHz = this.options.spectrogramHeight / this.options.lengthHz;

            this._paper.clear();
            this.drawSpectrogram();
            this.drawClips();
            this.drawPredictions();
            this.drawSlider();
            this.drawAxes();
        },

        drawSlider: function() {
            this._slider = this._paper.path("M0.5,0.5L0.5,200.5").
                translate(this.options.spectrogramXOffset,this.options.spectrogramYOffset).
                attr({stroke : "#00ff00"});
            
        },

        updateSlider: function() {
            var startSec = this.options.startSec;
            var pixelsPerSec = this.options.spectrogramWidth / this.options.lengthSec;
            var sliderPosition = ((this._currentSec - startSec) * pixelsPerSec) + this.options.spectrogramXOffset;
            if (this._slider) {
                this._slider.transform("t" + sliderPosition + ",0");
            }
        },

        drawSpectrogram: function() {
            // var server = this.options.openMirServer;
            var spectrogramUrl = this.options.spectrogramUrl

            var startSec = this.options.startSec;
            var endSec = this.options.endSec;

            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;
            
            var contrast = "50";
            var spectrogramOptions = "?startSec=" + startSec + "&endSec=" + endSec + "&contrast=" + contrast;
            spectrogramOptions += "&spectrumtype=magnitude&width=1000&height=200&lowHz=" + lowHz + "&highHz=" + highHz;

            var url = spectrogramUrl + spectrogramOptions;
            this._spectrogram = this._paper.image(url,this.options.spectrogramXOffset,this.options.spectrogramYOffset,
                                                  this.options.spectrogramWidth,this.options.spectrogramHeight);


        },

        drawAxes: function() {
            // Y-axis
            var a = this._paper.text(30,100,"Hz");
            var a = this._paper.text(70,5,this.options.highHz);
            var a = this._paper.text(70,200,this.options.lowHz);
            var a = this._paper.path("M99.5,0.5L99.5,200.5");

            // X-axis
            var a = this._paper.text(580,225 + this.options.spectrogramYOffset ,"sec");
            var a = this._paper.text(100,215 + this.options.spectrogramYOffset , this.options.startSec);
            var a = this._paper.text(1100,215 + this.options.spectrogramYOffset , this.options.endSec);
            var a = this._paper.path("M99.5,200.5L1100.5,200.5");
        },
        
        drawClips: function() {
            var startSec = this.options.startSec;
            var endSec = this.options.endSec;

            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;

            var pixelsPerSec = this.options.pixelsPerSec;
            var pixelsPerHz = this.options.pixelsPerHz;

            for (var i = 0; i < this.options.clips.length; i++) {
                var clip = this.options.clips[i];
                if ((clip.startSec > startSec) && (clip.endSec < endSec)) {
                    var x = (clip.startSec - startSec) * pixelsPerSec;
                    var y = (highHz - clip.highHz) * pixelsPerHz;

                    x = x + 0.5;
                    y = y + 0.5;

                    var width = (clip.endSec - clip.startSec) * pixelsPerSec;
                    var height = (clip.highHz - clip.lowHz) * pixelsPerHz;
                    this._paper.rect(x,y,width,height).attr({stroke : "#33ffff", fill : "#33ffff", "fill-opacity" : 0.05 }).translate(this.options.spectrogramXOffset,this.options.spectrogramYOffset);
                }
            };
        },

        drawPredictions: function() {
            if (!this.options.predictions) {
                return;
            }

            var startSec = this.options.startSec;
            var endSec = this.options.endSec;

            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;

            var pixelsPerSec = this.options.pixelsPerSec;
            var pixelsPerHz = this.options.pixelsPerHz;

            for (var i = 0; i < this.options.predictions.length; i++) {
                var prediction = this.options.predictions[i];
                if ((prediction.startSec > startSec) && (prediction.endSec < endSec)) {
                    var x = (prediction.startSec - startSec) * pixelsPerSec;
                    var y = 0.5;

                    var width = (prediction.endSec - prediction.startSec) * pixelsPerSec;
                    var height = this.options.spectrogramHeight;
                    var opacity = prediction.confidence * 0.5;

                    // Hardcode the colors for now
                    var fill = "#ff0000";
                    if (prediction.name == "o") {
                        fill = "#00ff00";
                    }
                    if (prediction.name == "v") {
                        fill = "#0000ff";
                    }
                    if (prediction.name == "b") {
                        opacity = 0;
                    }

                    this._paper.rect(x,y,width,height).attr({stroke : "#33ffff", "stroke-opacity" : 0, fill : fill, "fill-opacity" : opacity }).translate(this.options.spectrogramXOffset,this.options.spectrogramYOffset);
                }
            };

        },


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
