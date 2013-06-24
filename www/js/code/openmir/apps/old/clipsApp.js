//
// openmirEditor - A javascript app using backbone.js that uses
// several openMir 
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {


    ClipModel = Backbone.Model.extend({
        urlRoot: 'http://openmir.sness.net:3000/api/v1/clip/',
        
    });

    ClipCollection = Backbone.Collection.extend({
        model: ClipModel,

        initialize: function() {
        },
    });

    var clipTemplate = _.template(
        '<div class="clip">' +
            '<div class="image">' + 
            '<img src="/visualizations/spectrogram/1000000?startSec=<%= startSec %>&endSec=<%= endSec %>&width=100&height=100"></div>' + 
            '<div class="name"><%= name %></div>' + 
            '</div>');

    ClipView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        doClick: function() {
            console.log("clipView.click");
        },
        
        render: function() {
            var html = clipTemplate(this.model.toJSON());
            this.setElement(html);
            return this;
        }
    });

    ClipsView = Backbone.View.extend({
        el: $('#clips'),

        initialize: function() {
        },

        events:{ 
        },

        renderOne: function(clip) {
            console.log("clipsView.renderOne");
            var clipView = new ClipView({model:clip});
            this.$el.append(clipView.render().$el);
            return this;
        },

        render: function() {
            console.log("clipsView.render");
            var that = this;
            this.collection.each(function(clip) {
                that.renderOne(clip)
            });
        }
        
    });

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            // Turn the clips into backbone models
            clips = []
            _.each(window.clipsJson, (function(cj) {
                var c = {id : cj.pk}
                _.extend(c, cj.fields);
                var clip = new ClipModel(c);
                clips.push(clip);
            }));

            this.clipCollection = new ClipCollection(clips);

            this.clipsView = new ClipsView({collection : this.clipCollection});
        },
        
        routes: {
            "": "mainView",
        },

        mainView: function() {
            this.clipsView.render();
        }

    });
    
    // Instantiate the router
    app = new AppRouter;
    Backbone.history.start();


});
