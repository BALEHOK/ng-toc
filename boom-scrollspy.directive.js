angular.module('btoc')
.directive('bScrollspy', ['spyAPI', 'duScrollOffset', '$timeout', '$rootScope', function(spyAPI, duScrollOffset, $timeout, $rootScope) {
  'use strict';

  var Spy = function(targetElementOrId, $scope, $element, offset) {
    if(angular.isElement(targetElementOrId)) {
      this.target = targetElementOrId;
    } else if(angular.isString(targetElementOrId)) {
      this.targetId = targetElementOrId;
    }
    this.$scope = $scope;
    this.$element = $element;
    this.offset = offset;
  };

  Spy.prototype.getTargetElement = function() {
    if (!this.target && this.targetId) {
      this.target = document.getElementById(this.targetId) || document.getElementsByName(this.targetId)[0];
    }
    return this.target;
  };

  Spy.prototype.getTargetPosition = function() {
    var target = this.getTargetElement();
    if(target) {
      return target.getBoundingClientRect();
    }
  };

  Spy.prototype.flushTargetCache = function() {
    if(this.targetId) {
      this.target = undefined;
    }
  };

  return {
    scope: {
      targetId: '=bScrollspy'
    },
    link: function ($scope, $element, $attr) {
      var href = $attr.ngHref || $attr.href;
      var targetId = $scope.targetId;
      if(!targetId) return;

      // Run this in the next execution loop so that the scroll context has a chance
      // to initialize
      $timeout(function() {
        var spy = new Spy(targetId, $scope, $element, -($attr.offset ? parseInt($attr.offset, 10) : duScrollOffset));
        spyAPI.addSpy(spy);

        $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
        var deregisterOnStateChange = $rootScope.$on('$stateChangeSuccess', spy.flushTargetCache.bind(spy));
        $scope.$on('$destroy', function() {
          spyAPI.removeSpy(spy);
          deregisterOnStateChange();
        });
      }, 0, false);
    }
  };
}]);