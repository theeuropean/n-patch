### First release

- listening tests
- Nodes:
  - AudioBufferSourceNode
  - PannerNode
  - StereoPannerNode
  - DynamicsCompressorNode
  - WaveShaperNode
  - OscillatorNode
- autostart option on sources, defaults to true
- JSON Configuration with `program` method
- Routing audio to params
- Create own context
- `destination` method
- `from` method
- Have patch accept an existing native node, patch or factory
- `note`, `noteOn` and `noteOff` methods
- `gate`, `gateOn`, `gateOff` and `trig` methods
- `env` method for seamlessly attaching gate-aware envelopes to audio params
- linting
- docs

### Future

- Nodes:
  - ChannelSplitterNode
  - ChannelMergerNode
  - MediaElementAudioSourceNode
  - AudioWorkerNode
  - AnalyserNode
  - ConvolverNode
  - MediaStreamAudioSourceNode
  - MediaStreamAudioDestinationNode  
- Node cardinality
- `poly` method - voice manager for everything connected underneath it. Need a clever way to differentiate between shared messages and allocated messages.

### After that

- Optional 'nPatch-extended' patch collection. Should automatically attach itself to nPatch if included.

### Far distant future 

- Automated audio tests comparing output to an expect output file!