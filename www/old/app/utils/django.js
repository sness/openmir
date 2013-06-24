//
// Utility functions Django
//

define(['jquery', ], function ($) {
    
    // Highlight the active Bootstrap menu.
    $('.nav a[href*="' + location.pathname.split("/")[1] + '"]').parent().addClass('active');

});
