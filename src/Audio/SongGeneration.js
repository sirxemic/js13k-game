import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Context'
import { showProgress } from '../utils'

export function addSoundToBuffer (sourceData, targetData, offset) {
  if (!Array.isArray(sourceData)) {
    sourceData = [sourceData]
  }

  if (!Array.isArray(targetData)) {
    targetData = [targetData]
  }

  for (let i = 0; i < targetData.length; i++) {
    const sourceDataBuffer = sourceData[i % sourceData.length]
    const targetDataBuffer = targetData[i % targetData.length]

    const maxJ = Math.min(offset + sourceDataBuffer.length, targetDataBuffer.length)
    for (let j = offset; j < maxJ; j++) {
      targetDataBuffer[j] += sourceDataBuffer[j - offset]
    }
  }
}

export function addNotes (notes, output, instrument, bpm) {
  const bufferCache = {}
  notes.forEach(note => {
    let key = note.slice(1).join('|')
    if (!bufferCache[key]) {
      bufferCache[key] = instrument(getFrequencyForTone(note[1]), ...note.slice(2))
    }
    addSoundToBuffer(
      bufferCache[key],
      output,
      getOffsetForBeat(note[0], bpm)
    )
  })
}

export function getOffsetForBeat (n, bpm) {
  return Math.round(TheAudioContext.sampleRate * n * 60 / bpm)
}

export function getFrequencyForTone (n) {
  return 440 * Math.pow(2, n / 12)
}

export function repeatNotes (x, length, repeat) {
  const result = []
  for (let i = 0; i < repeat; i++) {
    x.forEach(([b, ...args]) => {
      result.push([b + length * i, ...args])
    })
  }
  return result
}

export function addOctave (notes) {
  for (let i = 0, l = notes.length; i < l; i++) {
    let [offset, note, ...rest] = notes[i]
    notes.push([offset, note + 12, ...rest])
  }
  return notes
}

export function zipRhythmAndNotes (rhythm, notes) {
  return rhythm.map((beat, index) => {
    return [beat, notes[index]]
  })
}

export function offsetNotes (notes, amount) {
  for (let note of notes) {
    note[0] += amount
  }
  return notes
}

export async function createChannel (trackFunction, sampleCount, bpm) {
  const channel = TheAudioContext.createBufferSource()
  channel.loop = true

  const buffer = TheAudioContext.createBuffer(1, sampleCount, TheAudioContext.sampleRate)
  trackFunction(buffer.getChannelData(0), bpm)

  channel.buffer = buffer

  await showProgress()

  return channel
}

export class Song {
  constructor (channels) {
    let master = TheAudioContext.createGain()

    this.channels = channels.map(channel => {
      let sourceNode = channel.source
      let gainNode = TheAudioContext.createGain()
      gainNode.gain.value = channel.volume

      sourceNode.connect(gainNode)
      gainNode.connect(master)

      if (channel.sendToReverb) {
        let gain = TheAudioContext.createGain()
        gain.gain.value = channel.sendToReverb
        gainNode.connect(gain)
        gain.connect(TheReverbDestination)
      }

      return {
        source: sourceNode,
        volumeParam: gainNode.gain
      }
    })

    master.connect(TheAudioDestination)
  }

  setVolume (channel, volume, time = 1) {
    this.channels[channel].volumeParam.linearRampToValueAtTime(volume, TheAudioContext.currentTime + time)
  }

  play () {
    this.channels.forEach(channel => {
      channel.source.start()
    })
  }
}
