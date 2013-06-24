// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "recordingAnnotatorSpectrogramPlugin",
        defaults = {
            lowHz : 0,
            highHz : 8000,
            spectrogramLengthSec : 5,
            windowLengthSec : 20,
            windowWidthPx : 1000,
            windowHeightPx : 200,
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

            this.startSec = 0;
            this.endSec = this.startSec + this.options.windowLengthSec;

            this._windowPxPerSec = this.options.windowWidthPx / this.options.windowLengthSec;
            this._windowSecPerPx = this.options.windowLengthSec / this.options.windowWidthPx;
            this._recordingWidthPx = this._windowPxPerSec * this.options.recordingLengthSec;

            this._spectrogramWidthPx = this._windowPxPerSec * this.options.spectrogramLengthSec;
            
            this._scrollLeftPx = 0;

            this._classifiers = [];

            $(this.element).append("<div id='spectrogramViewer'></div>");

            this._dragRectFill = {stroke : "none", fill: "#337", "fill-opacity": 0.3};

            var el = $("#spectrogramViewer")[0];
			this._paper = Raphael(el, this._recordingWidthPx, 220);

            this.createClips(this.options.clips);
            this.buildSpectrogramArray();

            $('#spectrogramViewer').scroll($.throttle( 500, function() {
                that._scrollLeftPx = $('#spectrogramViewer').scrollLeft();
                that.draw();
            }));

            $('#spectrogramViewer').on("mouseup", function(e) {
                that._clipAction = false;

                // If a dragger stopped being dragged, save the clip
                // back to the backbone app.
                if (that._clipNeedsSaving) {
                    that.saveClips();
                    that._clipNeedsSaving = false;
                }

            });

            $('#spectrogramViewer').on("mousedown", function(e) {
                if (that._currentClip && that._currentClip.active) {
                    that._currentClip.active = false
                    that.drawClip(that,that._currentClip);
                }

                if (!that._clipAction) {
                    that._mousedragInitPx = e.offsetX;
                    that._mousedragInitSec = e.offsetX * that._windowSecPerPx;
                    if (that._dragRect) {
                        that._dragRect.remove();
                    }
                    that._dragRect = that._paper.rect(that._mousedragInitPx,0.5,1,199).
                        attr({stroke : "none", fill: "#000", "fill-opacity": 0.7});
               }
            });

            $('#spectrogramViewer').on("mousemove", function(e) {
                if (that._clipAction == "leftDraggerMouseDown") {
                    var clip = that._currentClip;
                    var startSec = e.offsetX * that.options.windowSecPerPx;
                    clip.startSec = startSec;

                    if (clip.startSec > clip.endSec) {
                        clip.startSec = clip.endSec;
                    }
                    that.drawClip(that,clip);

                } else if (that._clipAction == "rightDraggerMouseDown") {
                    var clip = that._currentClip;
                    var endSec = e.offsetX * that.options.windowSecPerPx;
                    clip.endSec = endSec;

                    if (clip.endSec < clip.startSec) {
                        clip.endSec = clip.startSec;
                    }

                    that.drawClip(that,clip);

                } else {
                    // If the mousebutton is down when doing a mousemove,
                    // then draw a selection rectangle.
                    if (e.which == 1) {
                        if (!that._mousedown) {
                            that._mousedragInitPx = e.offsetX;
                            that._mousedragInitSec = e.offsetX * that.options.windowSecPerPx;
                            that._mousedown = true;
                        }
                        that._mousedragCurrPx = e.offsetX;
                        that._mousedragCurrSec = e.offsetX * that.options.windowSecPerPx;
                        var rectWidth = that._mousedragCurrPx - that._mousedragInitPx;

                        if (that._dragRect) {
                            that._dragRect.remove();
                        }

                        if (rectWidth > 0) {
                            that._dragRect = that._paper.rect(that._mousedragInitPx,0.5,rectWidth,199).attr(that._dragRectFill);
                        } else {
                            var rectWidth = that._mousedragInitPx - that._mousedragCurrPx;
                            that._dragRect = that._paper.rect(that._mousedragCurrPx,0.5,rectWidth,199).attr(that._dragRectFill);
                        }
                    }

                    if (e.which == 0) {
                        if (that._mousedown) {
                            that._mousedown = false;
                        }
                    }
                }
            });

            $(document).keypress(function(e) {
                // Whenever the user presses return, unselect the
                // current clip and save the state back to the
                // backbone model.
                if (e.keyCode == 13) {
                    if (that._currentClip) {
                        that._currentClip.active = false;
                        that.drawClip(that,that._currentClip);
                    }
                    that._currentClip = false;
                    that.saveClips();
                    return;
                }

                // If we have clicked on a clip label, change the label.
                if (that._currentClip && that._currentClip.active) {

                    if (!that._currentTypingName) {
                        that._currentTypingName = "";
                    }
                    that._currentTypingName += String.fromCharCode(e.keyCode);
                    that._currentClip.name = that._currentTypingName;
                    that.drawClip(that,that._currentClip);
                }

                // If we are currently dragging a selection window,
                // make a clip from the current selection extents.
                if (that._dragRect) {
                    if (that._mousedragInitSec < that._mousedragCurrSec) {
                        var startSec = that._mousedragInitSec;
                        var endSec = that._mousedragCurrSec;
                    } else {
                        var startSec = that._mousedragCurrSec;
                        var endSec = that._mousedragInitSec;
                    }
                    that._currentTypingName = String.fromCharCode(e.keyCode);
                    var clip = {
                        startSec : startSec,
                        endSec : endSec,
                        lowHz : 0,
                        highHz : 22050,
                        name : that._currentTypingName
                    }
                    that._currentClip = clip;
                    that._currentClip.active = true;
                    that._clips.push(clip);
                    that.drawClip(that,that._currentClip);
                    that._dragRect.remove();
                    that._dragRect = false;
                }
            });

            // The backspace/delete key needs to be handled separately
            // from other keys.
            $(document).keydown(function(e) {
                if (that._currentClip && that._currentClip.active) {
                    if (e.keyCode == 8) {
                        // If we delete the last character, delete the
                        // clip.
                        if (that._currentTypingName.length == 0) {
                            console.log("deleting clip");
                            console.log(that._currentClip);
                            var currentClipIndex = that._clips.indexOf(that._currentClip);
                            console.log("currentClipIndex=" + currentClipIndex);
                            that.deleteClip(that._currentClip.id);
                            that._clips.splice(currentClipIndex, 1);
                            that.clear();
                            that.draw();
                            return;
                        }

                        that._currentTypingName = that._currentTypingName.substring(0, that._currentTypingName.length - 1)
                        that._currentClip.name = that._currentTypingName;
                        that.drawClip(that,that._currentClip);

                    }
                }
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('loadClassifierEvent', function(event, classifierId) {
                that._classifierId = classifierId;
                that.loadClassifier();
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('currentTimeSecEvent', function(event, currentTimeSec) {
                that._currentSec = currentTimeSec;
                that.updateSlider();
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('startSecEvent', function(event, startSec, endSec) {
                that.options.startSec = startSec;
                that.options.endSec = endSec;
                that.draw();
            });

            // When a winSizeEvent is received, update the spectorgram
            $(this.element).on('winSizeEvent', function(event, winSize) {
                that.options.winSize = winSize;
                that.draw();
            });

            // When a newClips event is called, delete the existing
            // clips and create them again.
            $(this.element).on('newClips', function(event, newClips) {
                that.createClips(newClips);
                that.clear();
                that.draw();
            });

            // Send a seekSecEvent on a double click
            $(this.element).dblclick(function(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                var audioPosSec = ((that.options.lengthSec / (that.options.windowWidthPx)) * (x)) + that.options.startSec;
                $(that.element).trigger('seekSecEvent', [audioPosSec]);
            });

            this.draw();
        },
        
        buildSpectrogramArray: function() {

            this._spectrograms = [];

            var currentStartSec = 0;
            var currentEndSec = currentStartSec + this.options.spectrogramLengthSec;

            var done = false;
            while(!done) {

                if (currentEndSec > this.options.recordingLengthSec) {
                    done = true;
                }

                var spectrogram = {
                    startSec : currentStartSec,
                    endSec : currentEndSec,
                    image : null
                }
            
                this._spectrograms.push(spectrogram);
                currentStartSec = currentEndSec;
                currentEndSec = currentEndSec + this.options.spectrogramLengthSec;
            }

        },

        clear: function() {
            for (var i = 0; i < this._spectrograms.length; i++) {
                this._spectrograms[i].image = null;
            }

            for (var i = 0; i < this._clips.length; i++) {
                this._clips[i].drawn = null;
            }

            this._paper.clear();
        },

        draw: function() {
            this.options.lengthSec = this.options.endSec - this.options.startSec;
            this.options.lengthHz = this.options.highHz - this.options.lowHz;
            this.options.pixelsPerSec = this.options.windowWidthPx / this.options.lengthSec;
            this.options.pixelsPerHz = this.options.windowHeightPx / this.options.lengthHz;

            console.log("draw");
            this.drawSpectrograms();
            this.drawClips();
        },

        drawSpectrograms: function() {
            var visibleStartSec = this._windowSecPerPx * this._scrollLeftPx;
            var visibleEndSec = visibleStartSec + this.options.windowLengthSec;

            var spectrogramLengthSec = this.options.spectrogramLengthSec;
            var startIndex = Math.floor(visibleStartSec / spectrogramLengthSec);
            var endIndex = Math.floor(visibleEndSec / spectrogramLengthSec);

            // if (endIndex > this._spectrograms.length - 1) {
            //     endIndex = this._spectrograms.length - 1;
            // }

            for (var i = startIndex; i <= endIndex; i++) {
                if (this._spectrograms[i].image == null) {
                    this.drawSpectrogram(i);
                }
            }
        },

        drawClassifiers: function() {
            var startSec = this._windowSecPerPx * this._scrollLeftPx;
            var endSec = startSec + this.options.windowLengthSec;

            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;

            var lengthSec = endSec - startSec;
            var pixelsPerSec = this.options.windowWidthPx / lengthSec;

            for (var i = 0; i < this._classifiers.length; i++) {
                var classifier = this._classifiers[i];
                if ((classifier.startSec >= startSec) && (classifier.endSec <= endSec)) {
                    var x = ((classifier.startSec - startSec) * pixelsPerSec) + this._scrollLeftPx;
                    var y = 0.5;

                    var width = (classifier.endSec - classifier.startSec) * pixelsPerSec;
                    var height = this.options.windowHeightPx;
                    var opacity = classifier.confidence * 0.5;

                    // Hardcode the colors for now
                    var fill = "#ff0000";
                    if (classifier.name.charAt(0) == "o") {
                        fill = "#00ff00";
                    }
                    if (classifier.name.charAt(0) == "v") {
                        fill = "#0000ff";
                    }
                    if (classifier.name.charAt(0) == "b") {
                        fill = "#00ffff";
                    }

                    this._paper.rect(x,y,width,height).attr({stroke : "#33ffff", "stroke-opacity" : 0, fill : fill, "fill-opacity" : opacity }).translate(this.options.spectrogramXOffset,this.options.spectrogramYOffset);
                }
            };

        },

        loadClassifier: function() {
            if (!this._classifierId) {
                return;
            }

            var startSec = this._windowSecPerPx * this._scrollLeftPx;
            var endSec = startSec + this.options.windowLengthSec;

            // Load data from server for the predictions this classifier makes about this region
            var url = "/classifiers/predict/" + this._classifierId;
            url += "?recordingId=" + this.options.recordingId + "&startSec=" + startSec + "&endSec=" + endSec;

            var that = this;

            $.ajax({
                url : url,
                dataType: 'json'
            }).done(function(classifiers) { 
                that._classifiers = classifiers;
                that.clear();
                that.drawSpectrograms();
                that.drawClassifiers();
                that.drawClips();
            });
        },

        drawSpectrogram: function(i) {

            var spectrogramUrl = this.options.spectrogramUrl
            var startSec = this._spectrograms[i].startSec;
            var endSec = this._spectrograms[i].endSec;
            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;
            var winSize = this.options.winSize;
            var contrast = "50";
            var spectrogramOptions = "?startSec=" + startSec + "&endSec=" + endSec + "&contrast=" + contrast;
            spectrogramOptions += "&spectrumtype=magnitude&width=500&height=200&lowHz=" + lowHz + "&highHz=" + highHz;
            spectrogramOptions += "&winSize=" + winSize;
            
            var url = spectrogramUrl + spectrogramOptions;
            var startPx = startSec * this._windowPxPerSec;
            this._spectrograms[i].image = this._paper.image(url,startPx,0,this._spectrogramWidthPx,this.options.windowHeightPx);

            // X-axis
            var label = startSec + "s";
            this._spectrograms[i].xAxisLine = this._paper.text(startPx,210.5  , label).attr({font: "12px Helvetica"});
            if (startSec == 0) {
                this._spectrograms[i].xAxisLine.attr({'text-anchor': 'start'});
            }
            this._spectrograms[i].xAxisStartLabel = this._paper.path("M" + startPx + ",200.5L" + startPx + ",205.5");
            this._spectrograms[i].xAxisEndLabel = this._paper.path("M" + startPx + ",200.5L" + (startPx + this._spectrogramWidthPx) + ",200.5");


            // If we have loaded a spectrogram, redraw any clips that
            // we've drawn over.
            for (var i = 0; i < this._clips.length; i++) {
                if (((this._clips[i].startSec > startSec) || (this._clips[i].endSec > startSec)) &&
                    ((this._clips[i].startSec < endSec) || (this._clips[i].endSec < endSec))) {
                    this._clips[i].drawn = null;
                }
            }
        },

        createClips: function(newClips) {

            var that = this;
            this._clips = [];

            for (var i = 0; i < newClips.length; i++) {
                var clip = newClips[i];
                this.setOrigClipInfo(clip);
                this._clips.push(clip);
            };
        },

        setOrigClipInfo: function(clip) {
            clip.origStartSec = clip.startSec;
            clip.origEndSec = clip.endSec;
            clip.origName = clip.name;
        },
        
        clipChanged: function(clip) {
            if ((clip.startSec == clip.origStartSec) &&
                (clip.endSec == clip.origEndSec) &&
                (clip.name == clip.origName)) {
                return false;
            } else {
                return true;
            }
        },

        drawClip: function(that,clip) {
            var startX = clip.startSec * that._windowPxPerSec;
            var endX = clip.endSec * that._windowPxPerSec;
            var width = (clip.endSec - clip.startSec) * that._windowPxPerSec;
            startX = startX + 0.5;
            endX = endX + 0.5;
            var height = 199;

            if (clip.drawn) {
                clip.leftMarker.remove();
                clip.rightMarker.remove();
                clip.leftDragger.remove();
                clip.rightDragger.remove();
                clip.bar.remove();
                clip.label.remove();
                clip.labelBox.remove();
            }
            clip.leftMarker = that._paper.path("M " + startX + ",0 L " + startX +"," + height);
            clip.rightMarker = that._paper.path("M " + endX + ",0 L " + endX +"," + height);

            clip.leftDraggerPath = "M " + startX + ",93 L " + (startX + 7) + ",100 L" + (startX) + ",107";
            clip.leftDragger = that._paper.path(clip.leftDraggerPath).attr({fill : "#ddf"});

            clip.rightDraggerPath = "M " + endX + ",93 L " + (endX - 7) + ",100 L" + (endX) + ",107";
            clip.rightDragger = that._paper.path(clip.rightDraggerPath).attr({fill : "#ddf"});

            clip.leftDragger.mousedown(function(e) {
                that._clipAction = "leftDraggerMouseDown";
                that._currentClip = clip;
                that._clipNeedsSaving = true;
            });

            clip.leftDragger.mouseup(function(e) {
                that._clipAction = false;
            });

            clip.rightDragger.mousedown(function(e) {
                that._clipAction = "rightDraggerMouseDown";
                that._currentClip = clip;
                that._clipNeedsSaving = true;
            });

            clip.rightDragger.mouseup(function(e) {
                that._clipAction = false;
            });

            if (width-20 > 0) {
                clip.bar = that._paper.rect(startX+10,99.5,width-20,2).attr({fill : "#ddf"});
            }

            // Just draw the label in approximately the right place to get the bounding box.
            var labelStartX = startX + 20.5;
            var labelStartY = 90.5;
            clip.label = that._paper.text(0, 0, clip.name);
            var labelWidth = clip.label.getBBox().width;
            var labelHeight = clip.label.getBBox().height;
            clip.label.remove();

            // Calculate the correct position of the label and box and draw them.
            var labelStartX = startX + ((width - labelWidth) / 2);
            if (Math.floor(labelStartX) == labelStartX) {
                labelStartX += 0.5;
            }
            var labelStartY = 90.5;
            clip.labelBox = that._paper.rect(labelStartX - 5, labelStartY - 7, labelWidth + 10, labelHeight + 2)

            if (clip.active) {
                clip.labelBox.attr({fill : "#ff0"});
            } else {
                clip.labelBox.attr({fill : "#fff"});
            }

            clip.label = that._paper.text(labelStartX, labelStartY, clip.name).attr({'text-anchor':'start'});

            var labelClick = function(e) {
                // Unselect the last clip that was selected
                if (that._currentClip) {
                    that._lastClip = that._currentClip;
                    that._lastClip.active = false;
                }
                if (that._lastClip) {
                    that.drawClip(that,that._lastClip);
                }

                that._currentTypingName = clip.name;

                that._currentClip = clip;
                clip.active = true;
                that.drawClip(that,clip);

                e.stopPropagation();
            };

            clip.labelBox.mousedown(function(e) {
                labelClick(e);
            });

            clip.label.mousedown(function(e) {
                labelClick(e);
            });

            clip.drawn = true;
        },

        drawClips: function() {
            var that = this;
            var visibleStart = that._scrollLeftPx * this._windowSecPerPx;
            var visibleEnd = (that._scrollLeftPx + this.options.windowWidthPx) * this._windowSecPerPx;
            _.each(this._clips, function(clip) {
                if (((clip.startSec > visibleStart) || (clip.endSec > visibleStart)) &&
                    ((clip.startSec < visibleEnd) || (clip.endSec < visibleEnd))) {
                    if (!clip.drawn) {
                        that.drawClip(that,clip);
                    }
                }
            });
        },

        deleteClip: function(clipId) {
            console.log("recordingAnnotatorSpectrogramPlugin delete clipId=" + clipId);
            $(this.element).trigger('deleteEvent', {clipId : clipId});
        },

        saveClips: function() {
            console.log("saveClips function");
            // Just save back changed clips and only their essential
            // information to the backbone app and server.
            var that = this;
            var changedClips = [];
            _.each(this._clips, function(c) {
                if (that.clipChanged(c)) {
                    var clip = { startSec : c.startSec, endSec : c.endSec, id: c.id, name: c.name}
                    changedClips.push(clip);
                    that.setOrigClipInfo(c);
                }
            });
            $(this.element).trigger('saveEvent', {clips : changedClips});
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
