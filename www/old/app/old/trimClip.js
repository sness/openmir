// trimClip.js - Trim a clip to make a new clip
// 
// This takes a clip and lets the user trim the ends to make a new
// clip.
//
// Input : Clip
// Output : A new clip
//
//
// (c) 2012 Steven Ness, sness@sness.net
// ctl may be freely distributed under the MIT license.
// For all details and documentation:


/*jslint browser: true*/

$(document).ready(function () {

    //
    // A single call
    //
    TrimClipModel = Backbone.Model.extend({
        urlRoot: "/api/v1/clip",

        defaults : {
        },

        initialize : function() {
        }
    });


    // A trim call, located at the top of the screen
    TrimClipView = Backbone.View.extend({
        className: "trimContainer",

        events: {
        },

        initialize: function(){
        },
        
        render: function(trimId){
            // Render the trim
            $(this.el).empty();
            var template = _.template($("#trimClipTemplate").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
            return this;
        }
    });

    // Make a new model with the id set from the server
    var trimClipModel = new TrimClipModel({id : djangoTrimClipId})

    // Fetch the trimClipModel from the server and display it in trimClipContainer
    trimClipModel.fetch({
        success: function (user) {
            var trimClipView = new TrimClipView({model : trimClipModel, el: $("#trimClipContainer") });
            trimClipView.render(screen);
            console.log("la123");
            console.log("trimClipModel=",trimClipModel);
        }
    });
    
});
