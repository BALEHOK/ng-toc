(function() {
    'use strict';

    angular
        .module('btoc')
        .directive('affix', ['$window', '$document', Affix]);

    /* @ngInject */
    function Affix ($window, $document) {
        var RESET = 'affix affix-top affix-bottom';

        var directive = {link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $target = $document.find('body');
            var $element = element;

            var widthTarget = null;

            var offset = 0;

            if (attrs.affixOffsetBottom){
                offset = offset || {};
                offset.bottom = attrs.affixOffsetBottom;
            }
            if (attrs.affixOffsetBottomElements){
                offset = offset || {};
                offset.bottom = getOffsetFunc(offset.bottom || 0, attrs.affixOffsetBottomElements.split(';'));
            }

            if (attrs.affixOffsetTop) {
                offset = offset || {};
                offset.top = attrs.affixOffsetTop;
            }
            if (attrs.affixOffsetTopElements){
                offset = offset || {};
                offset.top = getOffsetFunc(offset.top || 0, attrs.affixOffsetTopElements.split(';'));
            }

            if (attrs.affixMatchParentWidth){
                widthTarget = $element.parent()[0];
            }

            var affixed = null,
                unpin = null,
                pinnedOffset = null;

            $target
                .on('click', checkPositionWithEventLoop);

            angular.element($window)
                .on('scroll', checkPosition)
                .on('resize', onResize);

            checkPosition();

            function getOffsetFunc(offsetCorrection, offsetElements){
                return function(){
                    var offsetHeight = +offsetCorrection;
                    for (var i = 0; i != offsetElements.length; i++) {
                        offsetHeight += $document.find(offsetElements[i])[0].offsetHeight;
                    };
                    return offsetHeight;
                };
            }

            function getState (scrollHeight, height, offsetTop, offsetBottom) {
                var scrollTop = $target[0].scrollTop;
                var position = jQoffset($element);
                var targetHeight = $target[0].offsetHeight;

                if (offsetTop !== null && affixed === 'top') {
                    return scrollTop < offsetTop ? 'top' : false;
                }

                if (affixed === 'bottom') {
                    if (offsetTop !== null) {
                        return (scrollTop + unpin <= position.top) ? false : 'bottom';
                    }
                    
                    return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom';
                }

                var initializing = affixed === null;
                var colliderTop = initializing ? scrollTop : position.top;
                var colliderHeight = initializing ? targetHeight : height;

                if (offsetTop !== null && scrollTop <= offsetTop) {
                    return 'top';
                }

                if (offsetBottom !== null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) {
                    return 'bottom';
                }

                return false;
            }

            function getPinnedOffset () {
                if (pinnedOffset) {
                    return pinnedOffset;
                }

                $element.removeClass(RESET).addClass('affix');

                var scrollTop = $target[0].scrollTop;
                var position = jQoffset($element);

                return (pinnedOffset = position.top - scrollTop);
            }

            function checkPositionWithEventLoop () {
                setTimeout(checkPosition, 1);
            }

            function checkPosition () {
                var height = $element[0].offsetHeight;
                var offsetTop;
                var offsetBottom;

                var doc = $document[0];
                var scrollHeight = Math.max(
                     doc.body.scrollHeight,  doc.documentElement.scrollHeight,
                     doc.body.offsetHeight,  doc.documentElement.offsetHeight,
                     doc.body.clientHeight,  doc.documentElement.clientHeight
                );

                if (typeof offset !== 'object') {
                    offsetBottom = offsetTop = offset;
                } else {
                    if (typeof offset.top === 'function') {
                        offsetTop = offset.top($element);
                    } else {
                        offsetTop = +offset.top || 0;
                    }

                    if (typeof offset.bottom === 'function') {
                        offsetBottom = offset.bottom($element);
                    } else {
                        offsetBottom = +offset.bottom || 0;
                    }
                }     

                var affix = getState(scrollHeight, height, offsetTop, offsetBottom);

                if (affixed !== affix) {
                    if (unpin !== null) {
                        $element.css('top', '');
                    }

                    var affixType = 'affix' + (affix ? '-' + affix : '');

                    affixed = affix;
                    unpin = affix == 'bottom' ? getPinnedOffset() : null;

                    $element
                        .removeClass(RESET)
                        .addClass(affixType);

                    setTargetWidth();
                }

                if (affix === 'bottom') {
                    $element.css('top', scrollHeight - height - offsetBottom + 'px');
                }
            }

            function onResize(){
                pinnedOffset = false;
                setTargetWidth();
            }

            function setTargetWidth(){
                if (widthTarget){
                    $element.css('max-width', widthTarget.offsetWidth + 'px');
                }
            }
        }

        // see original offset() at jQuery https://github.com/jquery/jquery/blob/master/src/offset.js
        function jQoffset(element) {
            var docElem, win, rect, doc,
                elem = element[0];

            if ( !elem ) {
                return;
            }

            // Support: IE<=11+
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error
            if ( !elem.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            rect = elem.getBoundingClientRect();

            // Make sure element is not hidden (display: none)
            if ( rect.width || rect.height ) {
                doc = elem.ownerDocument;
                docElem = doc.documentElement;

                return {
                    top: rect.top + $window.pageYOffset - docElem.clientTop,
                    left: rect.left + $window.pageXOffset - docElem.clientLeft
                };
            }

            // Return zeros for disconnected and hidden elements (gh-2310)
            return rect;
        }
    }
})();