describe('affix directive', function () {

  var $compile,
      $rootScope,
      $window,
      body,
      affixElt;

  beforeEach(module('btoc'));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$window_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
  }));

  beforeEach(function () {
    affixElt = angular.element(
      '<div class="content" style="min-height: 9000px;">' +
        '<div id="nav-wrapper">' +
          '<nav id="nav" affix affix-match-parent-width="true">' +
            '<ul>' +
              '<li>Section 1</li>' +
              '<li>Section 2</li>' +
              '<li>Section 3</li>' +
            '</ul>' +
          '</nav>' +
        '</div>' +
      '</div>' +
      '<div class="footer" style="min-height: 2000px;">' +
        'footer content' +
      '</div>');

    body = $window.document.body;
    body.appendChild(affixElt[0]);

    $compile(affixElt)($rootScope);
  });

  afterEach(function () {
    body.removeChild(affixElt[0]);
  });

  it('should set affix-top class when initialized', function () {
    var navElt = affixElt.find('nav');
    expect(navElt.hasClass('affix-top')).toBeTruthy();
    expect(navElt.hasClass('affix')).toBeFalsy();
    expect(navElt.hasClass('affix-bottom')).toBeFalsy();
  });

  it('should set affix class when scrolled', function (done) {
    $window.scrollTo(10, 100);

    setTimeout(function(){
      var navElt = affixElt.find('nav');
      expect(navElt.hasClass('affix-top')).toBeFalsy();
      expect(navElt.hasClass('affix')).toBeTruthy();
      expect(navElt.hasClass('affix-bottom')).toBeFalsy();
      done();
    }, 10);
  });

  it('should set affix-bottom class when scrolled to bottom', function (done) {
    $window.scrollTo(10, 8990);

    setTimeout(function(){
      var navElt = affixElt.find('nav');
      expect(navElt.hasClass('affix-top')).toBeFalsy();
      expect(navElt.hasClass('affix')).toBeFalsy();
      expect(navElt.hasClass('affix-bottom')).toBeTruthy();
      done();
    }, 10);
  });
});