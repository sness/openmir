//
// orcaMatch : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//

//
// GUID - Globally unique identifier for session
//
function guidCookie() {
    var cookie = new jecookie('guid');
    cookie.load();
    if (cookie.data.guid === undefined) {
        cookie.data.guid = guidGenerator();
        cookie.save();
    }
    return cookie.data.guid;
}

//
// Make Ajax requests work with CSRF
//
// https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
//
$(document).ajaxSend(function(event, xhr, settings) {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});


function guidGenerator() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


$(document).ready(function () {
    
    //
    // A single question
    //
    Question = Backbone.Model.extend({
    });

    //
    // A collection of questions
    //
    QuestionCollection = Backbone.Collection.extend({
        model: Question,

        initialize: function (models, options) {
        },
        
    });

    //
    // The question call that we are asking the user to match
    //
    QuestionView = Backbone.View.extend({
        tagName: "li",
        className: "question",

        events: {
            "mousedown button": "mousedown",
        },
        
        mousedown: function(e){
            $(this.el).find('button').removeClass('selected');
            this.model.set("response",$(e.target).attr('class'));
            $(e.target).addClass('selected');
        },

        initialize: function() {
        },

        render: function(){
            $(this.el).empty();
            var template = _.template($("#question_template").html());
            var html = template(this.model.toJSON());
            $(this.el).append(html);
        }  
    });

    QuestionListView = Backbone.View.extend({
        tagName: "ul",

        initialize: function(){
            _.bindAll(this, "renderQuestion");
        },
        
        renderQuestion: function(model){
            var questionView = new QuestionView({model: model});
            questionView.render();
            $(this.el).append(questionView.el);
        },
        
        render: function(){
            $(this.el).empty();
            this.collection.each(this.renderQuestion);
        }
    });

    //
    // All the questions
    //
    var question_calls = new QuestionCollection(window.surveyQuestions);
                 
    //
    // The questions at the bottom of the page
    //
    var question_view = new QuestionListView({collection: question_calls});
    question_view.render();
    $("#survey").html(question_view.el);

    //
    // When the user clicks sumbit, send the form back to the server
    //
    $("#submit").bind('mousedown', function(e) {
        data = {};
        var done = true;
        question_calls.each(function (n) {
            var response = n.get("response");
            if (response === "") {
                $("#info").html("Please respond to all the questions first...");
                done = false;
            }
            data[n.get("question")] = n.get("response");
        });
        if (done) {
            data['guid'] = guidCookie();
            $.post('/survey/submit', JSON.stringify(data));
            
            // Redirect the user to the next phase of the app
            $("#survey").hide();
            $("#submit").hide();
            $("#donesurvey").show();
        }
    });

});
