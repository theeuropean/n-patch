describe('n-patch', function () {

  var context = new AudioContext();
  nPatch.context = context;
  var sandbox;

  beforeEach(function () {
    context.nodes = [];
    sandbox = sinon.sandbox.create();
    var _createGain = context.createGain;
    sandbox.stub(context, 'createGain', function () {
      var newNode = _createGain.apply(context, arguments);
      sandbox.spy(newNode, 'connect');
      context.nodes.push(newNode);
      return newNode;
    });
    var _createDelay = context.createDelay;
    sandbox.stub(context, 'createDelay', function () {
      var newNode = _createDelay.apply(context, arguments);
      sandbox.spy(newNode, 'connect');
      context.nodes.push(newNode);
      return newNode;
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  //   // stubCreateNode('Oscillator');
  //   // stubCreateNode('BiquadFilter');

  it('creates a gain with the patch method', function () {
    nPatch.patch('gain');
    context.createGain.should.have.been.calledOnce;
  });

  it('creates a gain with the gain method', function () {
    nPatch.gain();
    context.createGain.should.have.been.calledOnce;
  });

  it('creates a delay with the delay method', function () {
    nPatch.delay();
    context.createDelay.should.have.been.calledOnce;
  });

  it('patches two nodes together', function () {
    nPatch.gain().delay();
    context.createGain.should.have.been.calledOnce;
    context.createDelay.should.have.been.calledOnce;
    context.nodes[0].connect.should.have.been.calledWith(context.nodes[1]);
  });

  it(', when patching nodes together, input returns the first node', function () {
    nPatch.gain().delay().input.should.equal(context.nodes[0]);
  });

  it(', when patching nodes together, exposes the connect method of the last node', function () {
    var gain = context.createGain(); // this is context.nodes[0]!
    nPatch.gain().delay().connect(gain);
    context.nodes[2].connect.should.have.been.calledWith(gain);
  });

  it('exposes the nodes in a patch via a nodes property', function () {
    var p = nPatch.gain().delay();
    p.nodes.gain.should.equal(context.nodes[0]);
    p.nodes.delay.should.equal(context.nodes[1]);
  });

  it('allows specification of an alternate node name', function () {
    var p = nPatch.gain('foo').delay('bar');
    p.nodes.foo.should.equal(context.nodes[0]);
    p.nodes.bar.should.equal(context.nodes[1]);
  });

  it('adds a number to the end of type-derived names if more than one in a patch', function () {
    var p = nPatch.gain().gain();
    p.nodes.gain.should.equal(context.nodes[0]);
    p.nodes.gain1.should.equal(context.nodes[1]);
  });

  it(', when given two nodes with the same explicit name, throws an exception', function () {
    (function () {
      nPatch.gain().gain('gain');
    }).should.throw('Cannot add named node to patch because patch already contains a node with the same name');
  });

  it('can connect nodes inside a patch by name', function () {
    nPatch.delay().gain().connect('delay');
    context.nodes[1].connect.should.have.been.calledWith(context.nodes[0]);
  });

});