(function() {
    'use strict';

    angular
        .module('btoc')
        .directive('tocSource', TocSource)
        .directive('tocTarget', TocTarget);

    var tocItems = [];

    function TocSource () {
        var directive = {
            priority: 100,
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          var headers = angular.element(element).find('h2');
          tocItems = [];

          for (var i = 0; i < headers.length; i++) {
            var h = headers[i];
            var id = 'section' + i;

            h.setAttribute('id', id);

            tocItems.push({
              id: id,
              caption: h.innerHTML
            });
          }
        }
    }

    function TocTarget () {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          scope.tocItems = tocItems;
          
          scope.$watchCollection(
            function(){
              return tocItems;
            },
            function(){
              scope.tocItems = tocItems;
            });
        }
    }
})();