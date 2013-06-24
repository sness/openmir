//
// orcaMatch : An orca call matching game written using Backbone.js
// and jQuery
//
// sness@sness.net (c) 2012 GPLv3
//


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
            "xdown button": "xdown",
        },
        
        xdown: function(e){
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
    $("#submit").bind('xdown', function(e) {
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
            $("#donesurvey").show();
        }
    });

});