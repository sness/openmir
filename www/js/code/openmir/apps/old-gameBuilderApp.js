//
// openmirEditor - A javascript app using backbone.js that uses
// several openMir 
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    ClipModel = Backbone.Model.extend({
        urlRoot: '/api/v1/clip/',
    });

    ClipCollection = Backbone.Collection.extend({
        model: ClipModel,
    });

    var clipTemplate = _.template(
        '<div class="clip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    ClipView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        initialize: function(){
        },

        doClick: function() {
        },
        
        render: function() {
            var html = clipTemplate(this.model.toJSON());
            this.setElement(html);
            $(this.el).draggable({ revert : "invalid", revertDuration: 1 });
            $(this.el).data("backbone-view", this);
            return this;
        }
    });

    ClipsView = Backbone.View.extend({
        el: $('#clips'),

        initialize: function() {
            this.collection.bind('reset', this.render, this);
        },

        events:{ 
            "click" : "doClick"
        },

        doClick: function() {
        },


        renderOne: function(clip) {
            var clipView = new ClipView({model:clip});
            this.$el.append(clipView.render().$el);
            return this;
        },

        render: function() {
            var that = this;
            this.$el.empty();
            this.collection.each(function(clip) {
                that.renderOne(clip)
            });
        }
        
    });

    LevelClipModel = Backbone.Model.extend({
    });

    LevelModel = Backbone.Model.extend({
        urlRoot: '/api/v1/level/',

        includeChild: function (child) {
            child.bind('change', this.onChildChange, this);
        },

        parse: function(data) {
            this.id = data.id;
        },

        onChildChange: function (child) {
            this.trigger('change', 'childChange');
        }

    });

    LevelCollection = Backbone.Collection.extend({
        model: LevelModel,

        initialize: function() {
            this.bind('add', this.doAdd, this);            
            this.bind('change', this.doChange, this);            
        },

        doAdd: function() {
        },

        doChange: function() {
            this.each(function(level) {
                if (level.get("queryClip").hasChanged() ||
                    level.get("correctReferenceClip").hasChanged() ||
                    level.get("otherReferenceClip1").hasChanged() ||
                    level.get("otherReferenceClip2").hasChanged() ||
                    level.get("otherReferenceClip3").hasChanged()) {
                    level.save(null, { 
                        success:function(a,b,c) { 
                        },
                        error:function(a,b,c) { 
                        }

                    });
                }
            });

        },
    });

    var levelClipTemplate = _.template(
        '<div class="levelClip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    LevelClipView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        render: function() {
            if (this.model.get("id")) {
                var html = levelClipTemplate(this.model.toJSON());
            } else {
                var html = '<div class="levelClip"><div class="image"><img src=""></div><div class="name">&nbsp;</div></div>';
            }
            this.setElement(html);
            var that = this;
            $(this.el).droppable({
                drop: function(ev, ui){
                    // Get reference to dropped view's model
                    var model = $(ui.draggable).data("backbone-view").model;
                    ui.draggable.draggable('option','revert',true);
                    that.model.set({id: model.get("id"), 
                                    name : model.get("name"), 
                                    startSec : model.get("startSec"), 
                                    endSec : model.get("endSec"),
                                    recording : model.get("recording")
                                   });
                },
            });
            return this;
        }
    });


    LevelView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
        },

        doClick: function() {
        },
        
        render: function() {
            this.$el.empty();
            var queryClipView = new LevelClipView({model: this.model.get("queryClip")});
            this.$el.append(queryClipView.render().$el);

            var correctReferenceClipView = new LevelClipView({model: this.model.get("correctReferenceClip")});
            this.$el.append(correctReferenceClipView.render().$el);

            var otherReferenceClip1View = new LevelClipView({model: this.model.get("otherReferenceClip1")});
            this.$el.append(otherReferenceClip1View.render().$el);

            var otherReferenceClip2View = new LevelClipView({model: this.model.get("otherReferenceClip2")});
            this.$el.append(otherReferenceClip2View.render().$el);

            var otherReferenceClip3View = new LevelClipView({model: this.model.get("otherReferenceClip3")});
            this.$el.append(otherReferenceClip3View.render().$el);

            return this;
        }
    });

    var levelCollectionAddTemplate = _.template('<button type="button" class="add">Add Level</button>');
    
    LevelCollectionView = Backbone.View.extend({
        el: $('#levelBuilder'),

        events:{ 
            "click .add" : "addLevel"
        },

        addLevel: function() {
            var queryClip = new LevelClipModel();
            var correctReferenceClip = new LevelClipModel();
            var otherReferenceClip1 = new LevelClipModel();
            var otherReferenceClip2 = new LevelClipModel();
            var otherReferenceClip3 = new LevelClipModel();
            
            var level = new LevelModel({
                gameId : window.gameId,
                queryClip : queryClip, 
                correctReferenceClip : correctReferenceClip,
                otherReferenceClip1 : otherReferenceClip1,
                otherReferenceClip2 : otherReferenceClip2,
                otherReferenceClip3 : otherReferenceClip3});

            level.includeChild(queryClip);
            level.includeChild(correctReferenceClip);
            level.includeChild(otherReferenceClip1);
            level.includeChild(otherReferenceClip2);
            level.includeChild(otherReferenceClip3);
            this.collection.add(level);
        },

        initialize: function() {
            this.collection.bind('add', this.render, this);
        },

        renderOne: function(level) {
            var levelView = new LevelView({model:level});
            this.$el.append(levelView.render().$el);
            return this;
        },

        render: function() {
            this.$el.empty();

            // Add level button
            var html = levelCollectionAddTemplate();
            this.$el.append(html);

            // Render all levels
            var that = this;
            this.collection.each(function(level) {
                that.renderOne(level)
            });
            
        }
        
    });

    ControlsModel = Backbone.Model.extend({
        defaults : {
            recording : "",
            clips : ""
        },

        initialize: function() {
            this.bind('change', this.doChange);
        },

        doChange: function() {
            // Send a request to the server to get all the selected clips'
            var url = "/api/v1/filterClips?recording=" + this.get("recording") 
                + "&clips=" + this.get("clips");
            $.getJSON(url, function(clipsJson) { 
                var clips = parseDjangoJsonClips(clipsJson)
                window.clips.reset(clips);
            });
            
        }

    });
    
    ControlsView = Backbone.View.extend({
        events: { 
            'keyup input': 'doChange',
        },

        doChange: function() {
            var recording = $('input:text[name=recording]').val();
            var clips = $('input:text[name=clips]').val();
            this.model.set({clips: clips, recording : recording});
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#controlsTemplate").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }

    });

    function parseDjangoJsonClips(clipsJson) {
        // Turn the clips into backbone models
        var clips = []
        _.each(clipsJson, (function(cj) {
            var c = {id : cj.pk}
            _.extend(c, cj.fields);
            var clip = new ClipModel(c);
            clips.push(clip);
        }));
        return clips;
    }

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            parsedClips = parseDjangoJsonClips(window.clipsJson);

            this.clips = new ClipCollection(parsedClips);
            window.clips = this.clips;
            this.clipsView = new ClipsView({collection : this.clips});
            
            // Turn the levels into backbone models
            levels = []
            _.each(window.levelsJson, (function(lj) {
                var queryClip = new LevelClipModel(lj.queryClip);
                var correctReferenceClip = new LevelClipModel(lj.correctReferenceClip);
                var otherReferenceClip1 = new LevelClipModel(lj.otherReferenceClip1);
                var otherReferenceClip2 = new LevelClipModel(lj.otherReferenceClip2);
                var otherReferenceClip3 = new LevelClipModel(lj.otherReferenceClip3);
                
                var level = new LevelModel({
                    id : lj.id,
                    gameId : lj.gameId,
                    queryClip : queryClip, 
                    correctReferenceClip : correctReferenceClip,
                    otherReferenceClip1 : otherReferenceClip1,
                    otherReferenceClip2 : otherReferenceClip2,
                    otherReferenceClip3 : otherReferenceClip3});
                    
                    level.includeChild(queryClip);
                    level.includeChild(correctReferenceClip);
                    level.includeChild(otherReferenceClip1);
                    level.includeChild(otherReferenceClip2);
                    level.includeChild(otherReferenceClip3);
                    levels.push(level);
                })); 
                
                this.levelCollection = new LevelCollection(levels);
                window.levelCollection = this.levelCollection;
                this.levelCollectionView = new LevelCollectionView({collection : this.levelCollection});
                
                this.controls = new ControlsModel();
                this.controlsView = new ControlsView({model : this.controls, el : $("#controls")});
            },
            
            routes: {
                "": "mainView",
            },
            
            mainView: function() {
                this.clipsView.render();
                this.levelCollectionView.render();
                this.controlsView.render();
            }
            
    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
