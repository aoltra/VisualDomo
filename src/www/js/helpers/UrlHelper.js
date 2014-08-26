
var helpURL = {

    /* stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
    getParameterByName : function (query) {
        "use strict";
        
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            urlParams = {};
        
        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }

        return urlParams;
    }
};