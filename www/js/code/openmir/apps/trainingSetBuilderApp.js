//
// trainingSetBuilder - A javascript app using backbone.js that uses
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    CatalogClipModel = Backbone.Model.extend({
        urlRoot: '/api/v1/clip/',
    });

    CatalogClipCollection = Backbone.Collection.extend({
        model: CatalogClipModel,
    });

    var clipTemplate = _.template(
        '<div class="clip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="id"><%= id %></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    CatalogClipView = Backbone.View.extend({
        events: {
            "mousedown" : "doMousedown"
        },

        initialize: function(){
        },

        doMousedown: function(ev) {
            if ($(this.el).hasClass("selected")) {
                return false;
            }
            if (ev.shiftKey) {
                $(this.el).addClass("selected");
            } else {
                $(".selected").removeClass("selected");
                $(this.el).addClass("selected");
            }
            return false;
        },
        
        render: function() {
            var html = clipTemplate(this.model.toJSON());
            this.setElement(html);
            $(this.el).draggable({ revert : "invalid", 
                                   revertDuration: 1, 
                                   drag: function(e, ui) {
                                       $('.selected').css({
                                           top : ui.position.top,
                                           left: ui.position.left
                                       });
                                   }
                                 });
            $(this.el).data("backbone-view", this);
            $(this.el).data("left", $(this.el).position().left);
            $(this.el).data("top", $(this.el).position().top);
            return this;
        }
    });

    CatalogClipsView = Backbone.View.extend({
        el: $('#clips'),

        initialize: function() {
            this.collection.bind('reset', this.render, this);
        },

        events:{ 
            "mousedown" : "doMousedown"
        },

        doMousedown: function() {
            $(".selected").removeClass("selected");
        },


        renderOne: function(clip) {
            var clipView = new CatalogClipView({model:clip});
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
                var clips = parseDjangoJsonCatalogClips(clipsJson)
                window.clips.reset(clips);
            });
            
        }

    });
    
    ControlsView = Backbone.View.extend({
        events: { 
            'keyup input': 'doChange',
            'click .selectAll' : 'doSelectAll'
        },

        doSelectAll : function() {
            $("#clips .clip").addClass("selected");
        },

        doChange: function() {
            var recording = $('input:text[name=recording]').val();
            var clips = $('input:text[name=clips]').val();
            this.model.set({clips: clips, recording : recording});
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#controlsTemplate").html());
            $(this.el).append(template(this.model.toJSON()));
        }

    });

    function parseDjangoJsonCatalogClips(clipsJson) {
        // Turn the clips into backbone models
        var clips = []
        _.each(clipsJson, (function(cj) {
            var c = {id : cj.pk}
            _.extend(c, cj.fields);
            var clip = new CatalogClipModel(c);
            clips.push(clip);
        }));
        return clips;
    }

    TrainingSetClipModel = Backbone.Model.extend({
    });

    TrainingSetClipList = Backbone.Collection.extend({
        model: TrainingSetClipModel,
    });

    TrainingSetModel = Backbone.Model.extend({
        urlRoot: '/api/v1/trainingSet/',

        addClipList: function(clipList) {
            this.get("clipLists").push(clipList);
            // clipList.bind('add', this.onChildAdd, this);
            // clipList.bind('remove', this.onChildRemove, this);
        },

        // TODO(sness) - Now that we can add a lot of calls at once,
        // this fires many times when we add them, which causes
        // problems.  Changed this to a save button, which also
        // doesn't feel right.

        // onChildAdd: function(thisModel) {
        //     console.log("onChildAdd");
        //     this.save();
        // },

        // onChildRemove: function(thisModel) {
        //     this.save();
        // }
    });

    var trainingSetClipTemplate = _.template(
        '<div class="clip">' +
            '<div class="close"><p>X</p></div>' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/<%= recording %>?startSec=<%= startSec %>&endSec=<%= endSec %>&height=100&highHz=8000"></div>' + 
            '<div class="id"><%= id %></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    TrainingSetClipView = Backbone.View.extend({
        events: {
            "click .close" : "doCloseClick"
        },

        doCloseClick: function() {
            // this.model.destroy();
            this.model.collection.remove(this.model);
        },

        render: function() {
            var html = trainingSetClipTemplate(this.model.toJSON());
            this.setElement(html);
            return this;
        }

    });

    TrainingSetClipListView = Backbone.View.extend({
        className : "trainingSetClipList",

        initialize: function() {
            this.collection.bind('add', this.render, this);
            this.collection.bind('remove', this.testRemove, this);
        },

        testRemove: function() {
            this.render();
        },
        
        renderOne: function(clip) {
            var trainingSetClipView = new TrainingSetClipView({model:clip});
            this.$el.append(trainingSetClipView.render().$el);
            return this;
        },

        render: function() {
            this.$el.empty();

            this.collection.each(function(clip) {
                this.renderOne(clip);
            }, this);


            var that = this;
            $(this.el).droppable({
                drop: function(ev, ui){
                    var selected = $(".selected").each( function() {
                        $(this).draggable('option','revert',true);

                        $(this).animate({
                            "left": $("#draggable").data("left"),
                            "top": $("#draggable").data("top")
                        }, 1);

                        $(this).removeClass("selected");
                        var model = $(this).data("backbone-view").model;
                        that.collection.add(model.clone());
                    });


                    // // Get reference to dropped view's model
                    // var model = $(ui.draggable).data("backbone-view").model;
                    // ui.draggable.draggable('option','revert',true);
                    // that.collection.add(model.clone())
                },
            });

            return this;
        }
        
    });

    TrainingSetView = Backbone.View.extend({ 
        events: {
            "change input:text" : "doInputChanged",
            "click .save" : "doSave"
        },

        doSave: function() {
            console.log("saving");
            this.model.save();
            // var clipLists = this.model.get("clipLists");
            // for (var i=0 ; i < clipLists.length; i++) {
            //     clipLists[i].save();
            // }
        },

        doInputChanged: function(e) {
            var clipListNames = this.model.get("clipListNames");
            var index = parseInt(e.target.name, 10);
            var value = e.target.value;
            clipListNames[index] = value;
            this.model.save();
        },

        renderOne: function(clipList) {
            var trainingSetClipListView = new TrainingSetClipListView({ collection : clipList});
            var html = trainingSetClipListView.render().$el;
            return html;
        },

        render: function() {
            this.$el.empty();

            $(this.el).append(_.template($("#trainingSetView").html()));

            var clipListTemplate = _.template($("#clipListTemplate").html());
            
            var clipLists = this.model.get("clipLists");
            var clipListNames = this.model.get("clipListNames");

            for (var i=0 ; i < clipLists.length; i++) {
                this.$el.append(clipListTemplate({ label : clipListNames[i], index : i }));
                this.$el.append(this.renderOne(clipLists[i]));
            }

            return this;
        }
    });

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            // Parse the trainingSet
            this.trainingSetModel = new TrainingSetModel({id : window.trainingSetJson.id});
            this.trainingSetModel.set("clipLists", []);

            var clipListNames = [];
            var that = this;
            _.each(window.trainingSetJson.clipLists, function(cl) {
                var clips = []
                _.each(cl.clips, function(c) {
                    var clip = new TrainingSetClipModel(c);
                    clips.push(clip);
                });
                trainingSetClipList = new TrainingSetClipList(clips);
                that.trainingSetModel.addClipList(trainingSetClipList);
                clipListNames.push(cl.name);
            });
            this.trainingSetModel.set("clipListNames", clipListNames);

            this.trainingSetView = new TrainingSetView({el : $('#trainingSet'), model: this.trainingSetModel});

            // TODO(sness) - For debugging
            window.trainingSetModel = this.trainingSetModel;

            // Parse the clip catalog
            parsedCatalogClips = parseDjangoJsonCatalogClips(window.clipsJson);
            this.clips = new CatalogClipCollection(parsedCatalogClips);
            window.clips = this.clips;
            this.clipsView = new CatalogClipsView({collection : this.clips});
            this.controls = new ControlsModel();
            this.controlsView = new ControlsView({model : this.controls, el : $("#controls")});
        },
        
        routes: {
            "": "mainView",
        },

        mainView: function() {
            this.clipsView.render();
            this.controlsView.render();
            this.trainingSetView.render();
        }

    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
