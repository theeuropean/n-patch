// var c = new AudioContext();
// nPatch.context = c;

// var delay = nPatch()
//   .delay()
//     .expose('delayTime')
//       .default(0.5)
//   .gain('feedback')
//     .expose('gain')
//       .as('feedback')
//       .default(0.5)
//     .connect('delay');

// var d = delay.gain().set('gain', 0.3)();
// d.delayTime.value = 0.25;
// d.feedback.value = 0.8;

// d.connect(c.destination);
// var t = tone(c);
// t.connect(d);

// function tone(context) {
//   var osc = context.createOscillator();
//   var gainNode = context.createGain();
//   osc.frequency.setValueAtTime(220, 0);
//   osc.type = 'sawtooth';
//   osc.connect(gainNode);
//   gainNode.gain.setValueAtTime(0, 0);
//   gainNode.gain.exponentialRampToValueAtTime(1, 0.1);
//   gainNode.gain.linearRampToValueAtTime(0, 0.5);    
//   osc.start();

//   function connect(dest) {
//     gainNode.connect(dest);
//   }

//   return {
//     connect: connect
//   };
// }

function delay() {
  return nPatch
    .delay()
      .param('delayTime').expose().set(0.5)
    .gain('feedback')
      .param('gain').expose('feedback').set(0.5)
      .connect('delay');
}

function threeOscSubtractive() {
  return nPatch
    .poly(6)
      .multi(3)
        .osc()
          .expose('waveform')
          .expose('detune')
          .expose('slope')
        .gain()
          .expose('gain')
      .mix()
      .biquad()
        .set('type', 'lowpass')
        .param('cutoff')
          .expose()
          .map(nPatch.cvToFreq)
          .set(1)
          .adsr()
            .expose('filterEnv') // .adsr() === .env(nPatch.adsr)
      .gain()
        .param('gain')
          .adsr()
            .expose('volEnv')
    .mix();
}

// function delay() {
//   return nPatch()
//     .delay()
//       .expose('delayTime')
//         .default(0.5)
//     .gain('feedback')
//       .expose('gain')
//         .as('feedback')
//         .default(0.5)
//       .connect('delay')
//     .render();
// }