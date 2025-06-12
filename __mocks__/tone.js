const triggerAttackReleaseMock = jest.fn();
const ReverbToDestinationMock = jest.fn();
const synthDisposeMock = jest.fn();
const filterDisposeMock = jest.fn();
const compressorDisposeMock = jest.fn();

function allowNewless(Constructor) {
  return function (...args) {
    if (!(this instanceof Constructor)) {
      return new Constructor(...args);
    } 
    Constructor.apply(this, args);
  };
}

function Synth(...args){
  this.dispose = jest.fn();
}

function PolySynth(...args) {
  this.triggerAttackRelease = triggerAttackReleaseMock;
  
  this.chain = jest.fn();
  this.connect = jest.fn();
  this.dispose = jest.fn();
}

function Filter(...args) {
  this.dispose = filterDisposeMock;
}
function Compressor(...args) {
  this.dispose = compressorDisposeMock;
}
function Reverb(...args) {
  this.toDestination = ReverbToDestinationMock;
  this.dispose = jest.fn();
}
function Time(...args) {
  this.toMilliseconds = jest.fn(() => 500);
}

function NoiseSynth(...args) {
  this.triggerAttackRelease = triggerAttackReleaseMock;
  this.dispose = synthDisposeMock;
  this.connect = jest.fn();
  this.volume = {
    value: 0
  };
}
function Gain(...args) {
  this.connect = jest.fn();
  this.dispose = jest.fn();
}
module.exports = {
  __esModule: true,
  Synth: allowNewless(Synth),
  PolySynth: allowNewless(PolySynth),
  Filter: allowNewless(Filter),
  Compressor: allowNewless(Compressor),
  Reverb: allowNewless(Reverb),
  Time: allowNewless(Time),
  NoiseSynth: allowNewless(NoiseSynth),
  Gain: allowNewless(Gain),

  triggerAttackReleaseMock,
  ReverbToDestinationMock,
  synthDisposeMock,
  filterDisposeMock,
  compressorDisposeMock
};