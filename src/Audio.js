import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Audio/Context'

export function playSample (sample, volume = 1, toReverb = false) {
  let source = TheAudioContext.createBufferSource()
  source.buffer = sample

  if (toReverb) {
    let gainNode = TheAudioContext.createGain()
    gainNode.gain.value = volume * 2
    source.connect(gainNode)
    gainNode.connect(TheReverbDestination)
  }

  if (volume !== 1) {
    let gainNode = TheAudioContext.createGain()
    gainNode.gain.setValueAtTime(volume, 0)
    source.connect(gainNode)
    source.onended = () => gainNode.disconnect(TheAudioDestination)
    gainNode.connect(TheAudioDestination)
  } else {
    source.connect(TheAudioDestination)
  }

  source.start()
}
