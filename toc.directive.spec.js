describe('toc directive', function () {

  var $compile,
      $rootScope;

  beforeEach(module('btoc'));
  beforeEach(module('btford.markdown'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should fetch h2 items to target element\' scope', function () {
    var sourceElt = angular.element('<div toc-source><h1>not included in toc</h1><h2>toc header</h2><p>content</p></div>');
    $compile(sourceElt)($rootScope);
    
    var targetElt = angular.element('<div toc-target></div>');
    $compile(targetElt)($rootScope);

    expect(targetElt.scope().tocItems.length).toBe(1);
  });

  it('should support integration with markdown directive', function () {
    var sourceElt = angular.element('<div toc-source btf-markdown>## markdown header ##</div>');
    $compile(sourceElt)($rootScope);
    
    var targetElt = angular.element('<div toc-target></div>');
    $compile(targetElt)($rootScope);

    expect(targetElt.scope().tocItems.length).toBe(1);
  });

  it('should add id to h2 item', function () {
    var sourceElt = angular.element('<div toc-source><h2>toc header</h2></div>');
    $compile(sourceElt)($rootScope);

    expect(sourceElt.html()).toBe('<h2 id="section0">toc header</h2>');
  });
});