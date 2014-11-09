describe('n-patch', function () {

  var context;

  beforeEach(function () {
    context = {};
    stubCreateNode('Gain');
    stubCreateNode('Delay');
    stubCreateNode('Oscillator');
    stubCreateNode('BiquadFilter');
    nPatch.context = context;

    function stubCreateNode(nodeType) {
      context['create' + nodeType] =
        sinon.stub().returns({});
    }
  });

  it('creates a delay', function () {
    nPatch().delay()();
    context.createDelay.should.have.been.calledOnce;
  });

  it('creates a gain', function () {
    nPatch().gain()();
    context.createGain.should.have.been.calledOnce;
  });

  it('creates an osc', function () {
    nPatch().osc()();
    context.createOscillator.should.have.been.calledOnce;
  });

  it('creates a biquad', function () {
    nPatch().biquad()();
    context.createBiquadFilter.should.have.been.calledOnce;
  });

});