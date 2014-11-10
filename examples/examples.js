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
    .patch('delay')
      .expose('delayTime', { default: 0.5 })
    .patch('gain', { as: 'feedback' })
      .expose('gain', { as: 'feedback', default: 0.5 })
      .connect('delay');
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