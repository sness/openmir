//
// orcaMatch : An orca call matching game written using Backbone.js
// and jCatalog
//
// sness@sness.net (c) 2012 GPLv3
//

$(document).ready(function () {

    // The name of this application, used when
    window.appName = "orcaCatalog";

    //
    // A single call
    //
    Call = Backbone.Model.extend({
        defaults : {
        },
    });

    //
    // A collection of calls
    //
    CallCollection = Backbone.Collection.extend({
        model: Call,

        initialize: function (models, options) {
        },
        
    });

    //
    // A single call
    //
    CallName = Backbone.Model.extend({
        defaults : {
        },
    });

    //
    // A collection of calls
    //
    CallNameCollection = Backbone.Collection.extend({
        model: CallName,

        initialize: function (models, options) {
        },
        
    });

    //
    // A single matriline
    //
    MatrilineName = Backbone.Model.extend({
        defaults : {
        },
    });

    //
    // A collection of matrilines
    //
    MatrilineNameCollection = Backbone.Collection.extend({
        model: MatrilineName,

        initialize: function (models, options) {
        },
        
    });

    //
    // The catalog call that we are asking the user to match
    //
    CatalogView = Backbone.View.extend({
        tagName: "div",
        className: "catalog",

        events: {
            "mousedown img": "mousedown",
            "mouseup img": "mouseup",
        },

        mouseup: function(e) {
            $('.image').removeClass('click');
        },
        
        initialize: function() {
        },
        
        mousedown: function(e){
            this.$el.find('.image').addClass('click');
            playAudio(this.model.get("audio"));
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#catalog_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    CatalogListView = Backbone.View.extend({
        tagName: "div",
        
        initialize: function(){
            _.bindAll(this, "renderCatalog");
        },
        
        renderCatalog: function(model){
            var catalogView = new CatalogView({model: model});
            catalogView.render();
            $(this.el).append(catalogView.el);
        },
        
        render: function(){
            console.log("CatalogListView.render");
            $(this.el).empty();
            
            var that = this;

            // The active calls
            var activeCallCollection = callNameCollection.where({state: "active"});
            var activeCalls = [];
            _.each(activeCallCollection, (function(n) {
                activeCalls.push(n.get("name"));
            }));

            // The active matrilines
            var activeMatrilineCollection = matrilineNameCollection.where({state: "active"});
            var activeMatrilines = [];
            _.each(activeMatrilineCollection, (function(n) {
                activeMatrilines.push(n.get("name"));
            }));
            
            this.collection.each(function(n) {
                if ((_.include(activeCalls, n.get("name"))) ||
                    (_.include(activeMatrilines, n.get("matriline")))) {
                    console.log("n=",n);
                    that.renderCatalog(n);
                }
            });
        }
    });

    //
    // The call call that we are asking the user to match
    //
    CallView = Backbone.View.extend({
        tagName: "button",
        className: "btn",

        events: {
            "mousedown": "mousedown",
        },

        mousedown: function(e) {
            if (this.model.get("state") === "inactive") {
                this.model.set("state","active");
            } else {
                this.model.set("state","inactive");
            }
            doUpdateCatalog();
        },
        
        initialize: function() {
            this.model.set("state","inactive");
        },
        
        render: function(){
            $(this.el).empty();
            var template = _.template($("#call_select_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    CallListView = Backbone.View.extend({
        tagName: "div",
        className: "btn-group",
        
        initialize: function(){
            $(this.el).attr({
                'data-toggle' : 'buttons-checkbox',
            });

            _.bindAll(this, "renderCall");
        },
        
        renderCall: function(model){
            var callView = new CallView({model: model});
            callView.render();
            $(this.el).append(callView.el);
        },
        
        render: function(){
            $(this.el).empty();

            var that = this;
            this.collection.each(function(n) {
                that.renderCall(n);
            });

        }
    });


    //
    // The matriline matriline that we are asking the user to match
    //
    MatrilineView = Backbone.View.extend({
        tagName: "button",
        className: "btn",

        events: {
            "mousedown": "mousedown",
        },

        mousedown: function(e) {
            if (this.model.get("state") === "inactive") {
                this.model.set("state","active");
            } else {
                this.model.set("state","inactive");
            }
            doUpdateCatalog();
        },
        
        initialize: function() {
            this.model.set("state","inactive");
        },
        
        render: function(){
            $(this.el).empty();
            var template = _.template($("#matriline_select_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    MatrilineListView = Backbone.View.extend({
        tagName: "div",
        className: "btn-group",
        
        initialize: function(){
            $(this.el).attr({
                'data-toggle' : 'buttons-checkbox',
            });

            _.bindAll(this, "renderMatriline");
        },
        
        renderMatriline: function(model){
            var matrilineView = new MatrilineView({model: model});
            matrilineView.render();
            $(this.el).append(matrilineView.el);
        },
        
        render: function(){
            $(this.el).empty();

            var that = this;
            this.collection.each(function(n) {
                that.renderMatriline(n);
            });

        }
    });


    //
    // All the calls
    //
    var catalogCallCollection = new CallCollection(window.callCatalog);

    // console.log("catalogCallCollection=",catalogCallCollection);

    //
    // The unique names of calls
    //

    // TODO(sness) - There is probably a way to do this in one line of
    // code.  We just want all the unique call names
    var allRawCallNames = [];
    catalogCallCollection.each(function(n) {
        allRawCallNames.push(n.get("name"));
    });
    var rawCallNames = _.uniq(allRawCallNames);
    var sortedCallNames = _.sortBy(rawCallNames, function(n) { return n });
    var callNameModels = [];
    _.each(sortedCallNames, function(n) {
        item = new CallName({"name" : n});
        callNameModels.push(item);
    });

    // Make a collection of those names
    var callNameCollection = new CallNameCollection(callNameModels);

    //
    // The unique names of matrilines
    //

    // TODO(sness) - There is probably a way to do this in one line of
    // code.  We just want all the unique matriline names
    var allRawMatrilineNames = [];
    catalogCallCollection.each(function(n) {
        allRawMatrilineNames.push(n.get("matriline"));
    });
    var rawMatrilineNames = _.uniq(allRawMatrilineNames);
    var sortedMatrilineNames = _.sortBy(rawMatrilineNames, function(n) { return n });
    var matrilineNameModels = [];
    _.each(sortedMatrilineNames, function(n) {
        item = new MatrilineName({"name" : n});
        matrilineNameModels.push(item);
    });

    // Make a collection of those names
    var matrilineNameCollection = new MatrilineNameCollection(matrilineNameModels);
    
    //
    // The catalog at the top of the page
    //
    var catalogView = new CatalogListView({collection: catalogCallCollection});
    catalogView.render();
    $("#catalog").html(catalogView.el);

    //
    // The radio buttons to select the diffent calls
    //
    var callView = new CallListView({collection: callNameCollection});
    callView.render();
    $("#call_select").html(callView.el);

    //
    // The radio buttons to select the diffent matrilines
    //
    var matrilineView = new MatrilineListView({collection: matrilineNameCollection});
    matrilineView.render();
    $("#matriline_select").html(matrilineView.el);

    function doUpdateCatalog() {
        console.log("doUpdateCatalog");
        // callNameCollection.each(function(n) {
        //     console.log("n.state=",n.get("state"));
        // });
        // console.log("callNameCollection=",callNameCollection);
        // console.log("activeNames=",activeNames);
        catalogView.render();
    }

});


