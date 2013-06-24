    //
    // A table with the clips in it
    //
    var clipsTableHeaderTemplate=_.template(
        "<th>" +
            "<td class='name'>Name</td>" +
            "<td class='startSec'>Start (sec)</td>" +
            "<td class='endSec'>End (sec)</td>" +
            "</th>");

    var clipsTableRowTemplate=_.template(
        "<tr>" +
            "<td class='name'><%= name %></td>" +
            "<td class='startSec'><%= startSec %></td>" +
            "<td class='endSec'><%= endSec %></td>" +
            "</tr>");

    ClipsTableRowView = Backbone.View.extend({
        events: {
            "click" : "doClick"
        },

        doClick: function() {
        },
        
        render: function() {
            var html = clipsTableRowTemplate(this.model.toJSON());
            this.setElement($(html));
            return this;
        }
    });

    ClipsTableView = Backbone.View.extend({
        el: $('#clipTable'),

        events: { 
        },

        renderRow: function(clip) {
            var row = new ClipsTableRowView({model:clip});
            this.$el.append(row.render().$el);
            return this;
        },

        render: function(){
            var that = this;
            this.collection.each(function(clip) {
                that.renderRow(clip)
            });
        }
    });





