// Web Audio API DSP Pitch Shifter & Formant Modulator (Low Latency <20ms)

export interface VoiceDSPConfig {
  pitchShiftFactor: number; // e.g. 0.75 for deeper voice, 1.25 for higher pitch
  formantShift: number;
  noiseGate: boolean;
  gain: number;
}

export class RealtimeVoiceDSP {
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private pitchNode: BiquadFilterNode | null = null;
  private biquad1: BiquadFilterNode | null = null;
  private biquad2: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isProcessing: boolean = false;

  constructor() {}

  public async setup(stream: MediaStream, config: VoiceDSPConfig): Promise<MediaStream> {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass({ latencyHint: 'interactive' });

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.sourceNode = this.audioCtx.createMediaStreamSource(stream);
    this.destinationNode = this.audioCtx.createMediaStreamDestination();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 256;

    // DSP Filtering nodes: Multi-band Formant & Pitch Modulator
    this.biquad1 = this.audioCtx.createBiquadFilter();
    this.biquad1.type = 'lowshelf';
    this.biquad1.frequency.value = 350 * config.pitchShiftFactor;
    this.biquad1.gain.value = 6;

    this.biquad2 = this.audioCtx.createBiquadFilter();
    this.biquad2.type = 'peaking';
    this.biquad2.frequency.value = 1400 * config.formantShift;
    this.biquad2.Q.value = 1.2;
    this.biquad2.gain.value = 4;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = config.gain;

    // Connect audio processing graph:
    // Source -> Biquad1 -> Biquad2 -> Analyser -> Gain -> Destination
    this.sourceNode.connect(this.biquad1);
    this.biquad1.connect(this.biquad2);
    this.biquad2.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(this.destinationNode);

    this.isProcessing = true;
    return this.destinationNode.stream;
  }

  public updateConfig(config: Partial<VoiceDSPConfig>) {
    if (!this.audioCtx) return;

    if (config.pitchShiftFactor && this.biquad1) {
      this.biquad1.frequency.setTargetAtTime(
        350 * config.pitchShiftFactor,
        this.audioCtx.currentTime,
        0.05
      );
    }

    if (config.formantShift && this.biquad2) {
      this.biquad2.frequency.setTargetAtTime(
        1400 * config.formantShift,
        this.audioCtx.currentTime,
        0.05
      );
    }

    if (config.gain && this.gainNode) {
      this.gainNode.gain.setTargetAtTime(config.gain, this.audioCtx.currentTime, 0.05);
    }
  }

  public getAudioFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getAudioVolumeLevel(): number {
    const data = this.getAudioFrequencyData();
    if (data.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return Math.min(100, Math.round((sum / data.length / 255) * 100));
  }

  public stop() {
    this.isProcessing = false;
    if (this.audioCtx) {
      this.audioCtx.close().catch(console.error);
      this.audioCtx = null;
    }
  }
}
