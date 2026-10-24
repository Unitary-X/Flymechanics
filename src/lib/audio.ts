import { motionState } from './scroll'

/**
 * Cabin audio (spec 21.4): opt-in, off by default, made entirely in the browser (no audio files, so no licences):
 * a low cabin hum whose low-pass filter opens with the page progress, a soft chime at each chapter change, and a
 * faint whoosh on chapter changes. No speech and no music. Volume ramps over 400 ms. Nothing starts until the
 * visitor presses the toggle, because browsers block sound before a user gesture.
 */
class CabinAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private timer = 0
  on = false

  private build() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return false
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // Hum: looping noise through a low-pass filter, plus a very low tone.
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02 // brown noise: soft rumble
      data[i] = last * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 260
    const hum = ctx.createGain()
    hum.gain.value = 0.55
    noise.connect(filter).connect(hum).connect(master)
    noise.start()

    const tone = ctx.createOscillator()
    tone.type = 'sine'
    tone.frequency.value = 86
    const toneGain = ctx.createGain()
    toneGain.gain.value = 0.05
    tone.connect(toneGain).connect(master)
    tone.start()

    this.ctx = ctx
    this.master = master
    this.filter = filter
    return true
  }

  /** Turn on (needs a user gesture) or off. Returns the new state. */
  async toggle(): Promise<boolean> {
    if (this.on) return this.set(false)
    return this.set(true)
  }

  async set(next: boolean): Promise<boolean> {
    if (next) {
      if (!this.ctx && !this.build()) return false
      await this.ctx!.resume()
      this.master!.gain.cancelScheduledValues(this.ctx!.currentTime)
      this.master!.gain.linearRampToValueAtTime(0.16, this.ctx!.currentTime + 0.4)
      // The filter opens as the flight climbs.
      window.clearInterval(this.timer)
      this.timer = window.setInterval(() => {
        if (!this.ctx || !this.filter) return
        const f = 220 + motionState.progress * 1500 + Math.abs(motionState.velocity) * 900
        this.filter.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.25)
      }, 120)
      this.on = true
    } else if (this.ctx && this.master) {
      window.clearInterval(this.timer)
      this.master.gain.cancelScheduledValues(this.ctx.currentTime)
      this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4)
      const ctx = this.ctx
      window.setTimeout(() => {
        if (!this.on) void ctx.suspend()
      }, 450)
      this.on = false
    }
    return this.on
  }

  /** Soft two-note chime plus a faint whoosh at a chapter change. */
  chapter() {
    if (!this.on || !this.ctx || !this.master) return
    const ctx = this.ctx
    const t = ctx.currentTime
    ;[784, 1175].forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(0, t + i * 0.09)
      g.gain.linearRampToValueAtTime(0.2 - i * 0.07, t + i * 0.09 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.9)
      o.connect(g).connect(this.master!)
      o.start(t + i * 0.09)
      o.stop(t + i * 0.09 + 1)
    })
    const whoosh = ctx.createBufferSource()
    const wb = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate)
    const wd = wb.getChannelData(0)
    for (let i = 0; i < wd.length; i++) wd[i] = (Math.random() * 2 - 1) * Math.sin((i / wd.length) * Math.PI)
    whoosh.buffer = wb
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(400, t)
    bp.frequency.exponentialRampToValueAtTime(2200, t + 0.7)
    const wg = ctx.createGain()
    wg.gain.value = 0.12
    whoosh.connect(bp).connect(wg).connect(this.master)
    whoosh.start(t)
  }

  suspend() {
    if (this.on) void this.set(false)
  }
}

export const cabinAudio = typeof window === 'undefined' ? (null as unknown as CabinAudio) : new CabinAudio()
