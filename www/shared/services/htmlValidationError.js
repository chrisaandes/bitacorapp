'use strict';

app.factory('htmlValidationError', function() {
    return {
        convert: function(errorData) {
            var htmlValidationError = '<h5 class="color-white">Error Validation</h5><ul>';
            angular.forEach(errorData,function (value, key) {
                htmlValidationError +='<li>';
                htmlValidationError += value;
                htmlValidationError +='</li>';
            });
            htmlValidationError +='</ul>';
            return htmlValidationError;
        }
    };
});