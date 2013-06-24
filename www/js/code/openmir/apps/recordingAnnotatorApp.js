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
        urlRoot: '/api/v1/recording/',

        defaults : {
            audioState : '0',
        },

        initialize: function() {
            this.bind('playPause', this.playPauseAudio);
            this.bind('change', this.doChange);

            var that = this;
            vent.on('extents:change', function(n){
                that.set({ 'startSec': n.startSec, 'endSec' : n.endSec});
            });

            this.audio = new Audio();

            var that = this;
            window.setInterval(function(){
                var audioState = that.get('audioState');
                if (audioState == '1') {
                    that.set('currentTimeSec', that.audio.currentTime);
                }
            },100);
        },

        doChange: function(e) {
            vent.trigger('recording:change', this);
        },

        seek: function(newTimeSec) {
            this.audio.currentTime = newTimeSec;
            var audioState = this.get('audioState');
        },

        currentTimeSecChanged: function() {
            var currentTimeSec = this.get('currentTimeSec');
        },

        parse: function(response) {
            this.audio.setAttribute('src',response.url);
            // this.audio.load();
            return response;
        },

        playPauseAudio: function() {
            var audioState = this.get('audioState');
            if (audioState == '1') {
                this.set('audioState', '0');
                this.audio.pause();
            } else {
                this.set('audioState', '1');
                var currentTime = this.get('currentTimeSec');
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
            recording.trigger('playPause');
        },

        clickPageForward: function() {
            var lengthSec = this.model.get('endSec') - this.model.get('startSec');
            var newStartSec = this.model.get('startSec') + lengthSec;
            var newEndSec = this.model.get('endSec') + lengthSec;
            var url = newStartSec + '/' + newEndSec;
            app.navigate(url, {trigger : true});
        },

        clickPageBackward: function() {
            var lengthSec = this.model.get('endSec') - this.model.get('startSec');
            var newStartSec = this.model.get('startSec') - lengthSec;
            var newEndSec = this.model.get('endSec') - lengthSec;
            var url = newStartSec + '/' + newEndSec;
            app.navigate(url, {trigger : true});
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($('#shuttleTemplate').html());
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
            vent.on('recording:change', function(recording){
                that.set('recording', recording);
            });

            vent.on('clips:load', function(clips){
                that.set('clips', clips);
            });

        },
    });

    SpectrogramView = Backbone.View.extend({
        el: $('#spectrogramContainer'),

        initialize: function() {
            this.model.bind('change:recording', this.render, this);
            this.model.bind('change:clips', this.loadClips, this);

            vent.on('catalogClip:update', function(clip){
                $('#spectrogram').trigger('catalogClip:update', clip.toJSON());
            });

            vent.on('classifiers:load', function(classifiers){
                console.log('SpectrogramView classifiers:load');
                $('#spectrogram').trigger('classifiers:load', classifiers);
            });

        },

        events:{
            'scrollEvent': 'scrollEvent',
            'saveEvent': 'saveEvent'
        },

        scrollEvent: function(e, startSec, endSec) {
            vent.trigger('extents:change', { 'startSec' : startSec, 'endSec' : endSec});
        },

        loadClips: function() {
            $('#spectrogram').trigger('clips:load', [this.model.get('clips')]);
        },

        saveEvent: function(e,changedClips) {
            vent.trigger('clips:update', changedClips);
        },

        render: function() {
            $('#spectrogramControlsContainer').empty();
            var template = _.template($('#spectrogramControlsTemplate').html());
            var html = template(this.model.toJSON());
            $('#spectrogramControlsContainer').append(html);

            var spectrogramUrl = '/visualizations/spectrogram/' + this.model.get('recording').get('id');
            $('#spectrogram').recordingPlugin({
                recordingId : this.model.get('recording').id,
                spectrogramUrl : spectrogramUrl,
                recordingLengthSec : this.model.get('recording').get('lengthSec'),
                winSize : this.model.get('winSize'),
                startSec : this.model.get('recording').get('startSec'),
                endSec : this.model.get('recording').get('endSec')
            });

        }
        
    });

    ClipModel = Backbone.Model.extend({
        urlRoot: '/api/v1/clip/',
        
    });

    ClipCollection = Backbone.Collection.extend({
        model: ClipModel,

        initialize: function() {
            this.bind('sync', this.doSync);
            var that = this;

            vent.on('clips:update', function(clips){
                that.updateClips(clips);
            });
        },

        updateClips: function(changedClips) {
            var that = this;
            _.each(changedClips.clips, function(c) {
                var clip = new ClipModel(c);
                that.add(clip, {merge: true});
            });

            var that = this;
            this.each(function(clip) {
                if (!clip.get("recording")) {
                    clip.set("recording", window.recordingId);
                }

                // TODO(sness) - If we create a clip in the
                // recordingAnnotatorSpectrogramPlugin and then save it, propogate
                // the new id back to the recordingAnnotatorSpectrogramPlugin.
                if (clip.hasChanged()) {
                    clip.save();
                }
            });

        },

        doSync: function() {
            vent.trigger('clips:load', this.toJSON());
        }

    });

    CatalogModel = Backbone.Model.extend({
        
    });

    CatalogCollection = Backbone.Collection.extend({
        url: '/napi/v1/catalogs',

        model: CatalogModel,

        initialize: function() {
        },

    });

    var catalogTemplate = _.template('<div class="catalog"><%= name %></div>');

    CatalogView = Backbone.View.extend({
        events: {
            'click' : 'doClick'
        },

        doClick: function() {
            vent.trigger('catalog:change', this.model.id);
        },

        initialize: function(){
        },

        render: function() {
            var html = catalogTemplate(this.model.toJSON());
            this.setElement(html);
            return this;
        }
    });


    CatalogsView = Backbone.View.extend({
        el: $('#catalogsContainer'),

        initialize: function() {
            this.collection.bind('sync', this.render, this);
        },

        events:{ 
        },

        renderOne: function(catalog) {
            var catalogView = new CatalogView({model:catalog});
            this.$el.append(catalogView.render().$el);
            return this;
        },

        render: function() {
            var that = this;
            this.$el.empty();
            this.collection.each(function(catalog) {
                that.renderOne(catalog)
            });
        }
        
    });




    CatalogClipModel = Backbone.Model.extend({
        urlRoot: '/napi/v1/catalogClip',
        
    });

    CatalogClipsCollection = Backbone.Collection.extend({
        model: ClipModel,

        initialize: function() {
            var that = this;
            vent.on('catalog:change', function(catalogId){
                that.url = '/napi/v1/catalogClips?catalog=' + catalogId;
                that.fetch();                
            });
        },

    });

    var catalogClipDetailTemplate = _.template(
        '<div class="detailClip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    CatalogClipDetailView = Backbone.View.extend({
        el: $('#catalogClipDetailContainer'),

        initialize: function(){

            this.model.bind('change', this.render, this);            

            var that = this;
            vent.on('catalogClip:update', function(clip){
                that.model.set(clip.attributes);
            });
        },

        render: function() {
            $(this.el).empty();
            var html = catalogClipDetailTemplate(this.model.toJSON());
            $(this.el).append(html);
            return this;
        }
    });


    var catalogClipTemplate = _.template(
        '<div class="clip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    CatalogClipView = Backbone.View.extend({
        events: {
            'click' : 'doClick'
        },

        doClick: function() {
            vent.trigger('catalogClip:update', this.model);
        },

        initialize: function(){
        },

        render: function() {
            var html = catalogClipTemplate(this.model.toJSON());
            this.setElement(html);
            return this;
        }
    });


    CatalogClipsView = Backbone.View.extend({
        el: $('#catalogClipsContainer'),

        initialize: function() {
            this.collection.bind('sync', this.render, this);
        },

        events:{ 
            'click' : 'doClick'
        },

        renderOne: function(catalogClip) {
            var catalogClipView = new CatalogClipView({model:catalogClip});
            this.$el.append(catalogClipView.render().$el);
            return this;
        },

        render: function() {
            var that = this;
            this.$el.empty();
            this.collection.each(function(catalogClip) {
                that.renderOne(catalogClip)
            });
        }
        
    });

    //
    // Classifiers
    //
    Classifier = Backbone.Model.extend({
    });
    
    ClassifierCollection = Backbone.Collection.extend({
        model: Classifier,
        
        url : '/napi/v1/classifiers',

        doSync: function() {
            vent.trigger('clips:load', this.toJSON());
        }
        
    });

    ClassifierView = Backbone.View.extend({
        events: {
            'click' : 'doClick'
        },
        
        doClick: function() {
            // Send an event to the SpectrogramView to load the
            // classifications for the currently visible region.
            vent.trigger('classifiers:load', this.model.id);
        },

        initialize: function() {
        },

        render: function() {
            var template = _.template( $('#classifierTemplate').html(), this.model.toJSON() );
            $(this.el).append(template);
        }
    });

    ClassifiersView = Backbone.View.extend({
        el: $('#classifiers'),

        initialize: function() {
            this.collection.bind('sync', this.render, this);
        },

        render: function() {
            $(this.el).empty();
            console.log("ClassifiersView render");
            _.each(this.collection.models, function(n) {
                var model = this.collection.get(n);
                var classifierView = new ClassifierView({model: model});
                classifierView.render();
                $(this.el).append(classifierView.el);
            }, this);
        }
    });


    // Global event dispatcher
    vent = _.extend({}, Backbone.Events);

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            this.recordingModel = new RecordingModel({ id : window.recordingId, lengthSec : window.recordingLengthSec });

            // Load the clips for this recording
            this.clipCollection = new ClipCollection();
            this.clipCollection.url = '/napi/v1/clips?recording=' + window.recordingId;
            this.clipCollection.fetch();

            // Load the catalogClips for this recording
            this.catalogClipsCollection = new CatalogClipsCollection();
            this.catalogClipsCollection.url = '/napi/v1/catalogClips?catalog=' + window.catalogId;
            this.catalogClipsCollection.fetch();
            this.catalogClipsView = new CatalogClipsView({collection : this.catalogClipsCollection});

            // The detail view for a catalog
            this.catalogClipDetailModel = new CatalogClipModel();
            this.catalogClipDetailView = new CatalogClipDetailView({model : this.catalogClipDetailModel});

            // The catalogs
            this.catalogCollection = new CatalogCollection();
            this.catalogCollection.fetch();
            this.catalogsView = new CatalogsView({collection : this.catalogCollection});

            // The spectrogram of a recording
            this.spectrogramModel = new SpectrogramModel();
            this.spectrogramView = new SpectrogramView({model : this.spectrogramModel});

            // The classifiers
            this.classifierCollection = new ClassifierCollection();
            this.classifierCollection.fetch();
            this.classifiersView = new ClassifiersView({collection : this.classifierCollection});

            // TODO(sness) - Debugging
            window.recordingModel = this.recordingModel;
            window.spectrogramModel = this.spectrogramModel;
            window.clipCollection = this.clipCollection;
            window.catalogClipsCollection = this.catalogClipsCollection;
 
            vent.on('extents:change', function(n){
                var url = n.startSec.toFixed(2) + '/' + n.endSec.toFixed(2);
                app.navigate(url);
            });

        },
        
        routes: {
            '': 'mainView',
            ':startSec/:endSec': 'mainView',
        },

        mainView: function(startSec, endSec) {
            if (!startSec) {
                startSec = 0;
                endSec = 20.000;
            }
            this.recordingModel.set({'startSec' : parseFloat(startSec),  'endSec' : parseFloat(endSec)});
        }

    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
