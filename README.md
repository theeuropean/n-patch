# nPatch

A simple, opinionated wrapper library for joyful patching with the JavaScript Web Audio API.

## Roadmap

- linting
- docs
- Nodes:
  - AudioBufferSourceNode
  - MediaElementAudioSourceNode
  - AudioWorkerNode
  - PannerNode
  - StereoPannerNode
  - ConvolverNode
  - AnalyserNode
  - ChannelSplitterNode
  - ChannelMergerNode
  - DynamicsCompressorNode
  - WaveShaperNode
  - OscillatorNode
  - MediaStreamAudioSourceNode
  - MediaStreamAudioDestinationNode
- `start` and `stop` methods that go to all source nodes
- autostart option on sources, defaults to true
- JSON Configuration with `program` method
- Routing audio to params
- Create own internal context
- `destination` method
- Make `set` & `expose` work with non-param values
- `from` method
- Have patch accept an existing native node, patch or factory
- `note`, `noteOn` and `noteOff` methods
- `gate`, `gateOn`, `gateOff` and `trig` methods
- `env` method for attaching envelopes seamlessly to audio params
- Node cardinality
- `poly` method - voice manager for everything connected underneath it. Need a clever way to differentiate between shared messages and allocated messages.