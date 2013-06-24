//
// The model for the query
//
// openmir (c) 2013 sness@sness.net
//

define(['jquery', 'backbone'], function ($, Backbone) {
    
    var QueryModel = Backbone.Model.extend({
        defaults : {
            name : '',
            imageUrl : ''
        },
    });

    return QueryModel;
   
});
