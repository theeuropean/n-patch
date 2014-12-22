describe('n-patch', function () {

  var context = new AudioContext();
  nPatch.context = context;
  var sandbox;

  beforeEach(function () {
    context.nodes = [];
    sandbox = sinon.sandbox.create();
    proxyCreateNativeNode('Gain');
    proxyCreateNativeNode('Delay');
    proxyCreateNativeNode('BiquadFilter');
    proxyCreateNativeNode('Oscillator');

    function proxyCreateNativeNode(name) {
      var createMethodName = 'create' + name;
      var createMethod = context[createMethodName];
      sandbox.stub(context, createMethodName, function () {
        var newNode = createMethod.apply(context, arguments);
        if(newNode.connect) sandbox.spy(newNode, 'connect');
        if(newNode.start) sandbox.spy(newNode, 'start');
        if(newNode.stop) sandbox.spy(newNode, 'stop');
        context.nodes.push(newNode);
        return newNode;
      });
    }
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('creates a GainNode with the patch method', function () {
    nPatch().patch('gain');
    context.createGain.should.have.been.calledOnce;
  });

  it('creates a GainNode with the gain method', function () {
    nPatch().gain();
    context.createGain.should.have.been.calledOnce;
  });

  it('creates a DelayNode with the delay method', function () {
    nPatch().delay();
    context.createDelay.should.have.been.calledOnce;
  });

  it('creates a BiquadFilterNode with the biquad method', function () {
    nPatch().biquad();
    context.createBiquadFilter.should.have.been.calledOnce;
  });

  it('creates an OscillatorNode with the osc method', function () {
    nPatch().osc();
    context.createOscillator.should.have.been.calledOnce;
  });

  it('patches two nodes together', function () {
    nPatch().gain().delay();
    context.createGain.should.have.been.calledOnce;
    context.createDelay.should.have.been.calledOnce;
    context.nodes[0].connect.should.have.been.calledWith(context.nodes[1]);
  });

  it(', when patching nodes together, input returns the first node', function () {
    nPatch().gain().delay().input.should.equal(context.nodes[0]);
  });

  it(', when patching nodes together, exposes the connect method of the last node', function () {
    var gain = context.createGain(); // this is context.nodes[0]!
    nPatch().gain().delay().connect(gain);
    context.nodes[2].connect.should.have.been.calledWith(gain);
  });

  it('exposes the nodes in a patch via a nodes property', function () {
    var p = nPatch().gain().delay();
    p.nodes.gain.should.equal(context.nodes[0]);
    p.nodes.delay.should.equal(context.nodes[1]);
  });

  it('allows specification of an alternate node name', function () {
    var p = nPatch().gain('foo').delay('bar');
    p.nodes.foo.should.equal(context.nodes[0]);
    p.nodes.bar.should.equal(context.nodes[1]);
  });

  it('adds a number to the end of type-derived names if more than one in a patch', function () {
    var p = nPatch().gain().gain();
    p.nodes.gain.should.equal(context.nodes[0]);
    p.nodes.gain1.should.equal(context.nodes[1]);
  });

  it(', when given two nodes with the same explicit name, throws an exception', function () {
    (function () {
      nPatch().gain().gain('gain');
    }).should.throw('Cannot add named node to patch because patch already contains a node with the same name');
  });

  it('can connect nodes inside a patch by name', function () {
    nPatch().delay().gain().connect('delay');
    context.nodes[1].connect.should.have.been.calledWith(context.nodes[0]);
  });

  it('can connect nodes to the context destination', function () {
    nPatch().delay().dest();
    context.nodes[0].connect.should.have.been.calledWith(context.destination);
  });

  it('can expose an AudioParam with param and expose', function () {
    nPatch().delay().param('delayTime').expose().delayTime
      .should.equal(context.nodes[0].delayTime);
  });

  it('can expose an AudioParam with a different name', function () {
    nPatch().delay().param('delayTime').expose('time').time
      .should.equal(context.nodes[0].delayTime);
  });

  it('can use just expose to expose an AudioParam if no AudioParam currently specified', function () {
    nPatch().delay().expose('delayTime').delayTime
      .should.equal(context.nodes[0].delayTime);
  });

  it('can use just expose to expose an AudioParam with a different name', function () {
    nPatch().delay().expose('delayTime', 'time').time
      .should.equal(context.nodes[0].delayTime);
  });

  it('can set an AudioParam to a value with param and set', function () {
    nPatch().delay().param('delayTime').set(1);
    context.nodes[0].delayTime.value.should.equal(1);
  });

  it('can set an AudioParam to a value with just set', function () {
    nPatch().delay().set('delayTime', 1);
    context.nodes[0].delayTime.value.should.equal(1);
  });

  it('can set a non-AudioParam property to a value with just set', function () {
    nPatch().biquad().set('type', 'highpass');
    context.nodes[0].type.should.equal('highpass');
  });

  it('can set a non-AudioParam property to a value with just set', function () {
    nPatch().biquad().set('type', 'highpass');
    context.nodes[0].type.should.equal('highpass');
  });

  it('can set params of either type with a config object in the node creation function', function () {
    nPatch().osc({ frequency: 880, type: 'sawtooth' });
    context.nodes[0].type.should.equal('sawtooth');
    context.nodes[0].frequency.value.should.equal(880);
  });

  it('can start and stop all the source nodes in a patch', function () {
    var p = nPatch().osc();
    p.start();
    p.stop();
    context.nodes[0].start.should.have.been.calledOnce;
    context.nodes[0].stop.should.have.been.calledOnce;
  });

});