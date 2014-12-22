describe('n-patch listening tests', function () {
  this.timeout(0); // Tells mocha not to timeout

  it('makes sounds', function (done) {
    var context = new AudioContext();
    nPatch.context = context;
    var promise;
    var playsCount = 0;

    play('a 440 Hz sinewave', function () {
      return nPatch().osc({ frequency: 440 }).dest().start();
    }, 1);

    play('an 880 Hz sinewave', function () {
      return nPatch().osc({ frequency: 880 }).dest().start();
    }, 1);

    play('an 880 Hz sinewave with an echo', function () {
      return nPatch()
        .osc({ frequency: 880 })
        .delay({ delayTime: 0.3 })
        .gain({ gain: 0.5 })
        .connect('delay')
        .dest()
        .start();
    }, 10);

    promise.then(function () {
      done();
    });

    function play(descr, setup, durationInSecs, teardown) {
      playsCount++;
      var thisCount = playsCount;
      promise = promise ? promise.then(executor) : executor();

      function executor() {
        return new Promise(function (resolve) {
          console.log('Playing sound ' + thisCount + ': ' + descr);
          var patcher = setup();
          setTimeout(function () {
            if(teardown) {
              teardown(patcher);
            }
            else {
              patcher.stop();
            }
            resolve();
          }, durationInSecs * 1000);
        });
      }
    }

  });

});