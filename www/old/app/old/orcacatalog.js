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
    // The catalog call that we are asking the user to match
    //
    CatalogView = Backbone.View.extend({
        tagName: "div",
        className: "catalog",

        events: {
            "vmousedown img": "vmousedown",
            "vmouseup img": "vmouseup",
        },

        vmouseup: function(e) {
            $('.image').removeClass('click');
        },
        
        initialize: function() {
        },
        
        vmousedown: function(e){
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
            // console.log("CatalogListView.render");
            $(this.el).empty();
            
            var that = this;
            
            this.collection.each(function(n) {
                that.renderCatalog(n);
            });
        }
    });


    //
    // All the calls
    //
    var catalogCallCollection = new CallCollection(window.callCatalog);
    
    //
    // The call catalog
    //
    var catalogView = new CatalogListView({collection: catalogCallCollection});
    catalogView.render();
    $("#catalog").html(catalogView.el);

    $("#calls :checkbox.all").click(function (n) {
        var this_checked = $(this).attr("checked") || false;
        $("#calls :checkbox").attr("checked", this_checked);
        $("#calls :checkbox").checkboxradio("refresh");
    });

    $("#calls :checkbox").click(function (n) {
        doShowHideCalls();
    });


    $("#matrilines .ui-block-a :checkbox").click(function (n) {
        doCheckUncheckClans();
    });

    $("#matrilines .ui-block-b :checkbox").click(function (n) {
        doCheckUncheckPods();
    });

    $("#matrilines .ui-block-c :checkbox").click(function (n) {
        doShowHideCalls();
    });


    doShowHideCalls();

    function doCheckUncheckClans() {
        $("#matrilines .ui-block-b :checkbox").each( function(n) {
            $(this).attr('checked',false).checkboxradio("refresh");
        });

        // Check/uncheck members of clans
        $("#matrilines .ui-block-a :checked").each( function(n) {
            var clan = $(this).attr("class");
            if (clan === "A") {
                $(".A01").attr("checked", true);
                $(".A04").attr("checked", true);
                $(".A05").attr("checked", true);
                $(".AI").attr("checked", true);
                $(".B").attr("checked", true);
                $(".C").attr("checked", true);
                $(".I1").attr("checked", true);
                $(".I18").attr("checked", true);
                $(".H").attr("checked", true);
                $(".D").attr("checked", true);
            }
            if (clan === "G") {
                $(".G01").attr("checked", true);
                $(".I11").attr("checked", true);
                $(".I31").attr("checked", true);
            }
        });
        $("#matrilines .ui-block-b :checkbox").checkboxradio("refresh");
        doCheckUncheckPods();
    }

    function doCheckUncheckPods() {
        $("#matrilines .ui-block-c :checkbox").each( function(n) {
            $(this).attr('checked',false).checkboxradio("refresh");
        });

        $("#matrilines .ui-block-b :checked").each( function(n) {
            var pod = $(this).attr("class");
            if (pod === "A01") {
                $("#matrilines .A12").attr("checked", true);
                $("#matrilines .A30").attr("checked", true);
                $("#matrilines .A34").attr("checked", true);
                $("#matrilines .A36").attr("checked", true);
            }
            if (pod === "A04") {
                $("#matrilines .A11").attr("checked", true);
                $("#matrilines .A24").attr("checked", true);
                $("#matrilines .A35").attr("checked", true);
            }
            if (pod === "A05") {
                $("#matrilines .A08").attr("checked", true);
                $("#matrilines .A23").attr("checked", true);
                $("#matrilines .A25").attr("checked", true);
            }
            if (pod === "B") {
                $("#matrilines .B07").attr("checked", true);
            }
            if (pod === "C") {
                $("#matrilines .C06").attr("checked", true);
                $("#matrilines .C10").attr("checked", true);
            }
            if (pod === "G01") {
                $("#matrilines .G03").attr("checked", true);
                $("#matrilines .G17").attr("checked", true);
            }
            if (pod === "I11") {
                $("#matrilines .I11").attr("checked", true);
                $("#matrilines .I15").attr("checked", true);
            }
            if (pod === "I31") {
                $("#matrilines .I33").attr("checked", true);
            }
        });
        $("#matrilines .ui-block-c :checkbox").checkboxradio("refresh");

        doShowHideCalls();

    }

    function doShowHideCalls() {
        console.log("doShowHideCalls");
        
        // Hide all the calls
        // $(".call").hide();
        $(".call").css({'display':'none'});

        //
        // Show the selected calls
        //
        $("#calls :checked").each(function(n) {
            var call_class = "." + $(this).attr("class");
            // console.log("n=",call_class);
            // $(call_class).show();
            $(call_class).css({'display':'inline-block'})
        });

        //
        // Hide the unselected matrilines
        //
        var all_matrilines = []
        $("#matrilines :checkbox").each( function(n) {
            all_matrilines.push($(this).attr("class"));
        });
        
        var selected_matrilines = []
        $("#matrilines :checked").each( function(n) {
            selected_matrilines.push($(this).attr("class"));
        });

        var unselected_matrilines = _.without(all_matrilines, selected_matrilines);
        // console.log("all_matrilines=",all_matrilines);
        // console.log("selected_matrilines=",selected_matrilines);
        // console.log("unselected_matrilines=",unselected_matrilines);
        _.each(unselected_matrilines, function(n) {
            var matriline = "." + n;
            // $(matriline).hide();
            $(matriline).css({'display':'none'});
        });


    }

});


