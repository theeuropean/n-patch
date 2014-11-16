// This is just a scratchpad for me to play around with potential syntax.
// Anything here that actually works should be moved to a listening test or example.

function delay() {
  return nPatch()
    .delay()
      .param('delayTime').expose().set(0.5)
    .gain('feedback')
      .param('gain').expose('feedback').set(0.5)
      .connect('delay');
}

function threeOscSubtractive() {
  return nPatch()
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