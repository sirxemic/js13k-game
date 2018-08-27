export let TheAudioContext = new AudioContext()
export let TheAudioDestination = TheAudioContext.createDynamicsCompressor()
TheAudioDestination.knee.setValueAtTime(40, 0)
TheAudioDestination.threshold.setValueAtTime(-12, 0)

TheAudioDestination.connect(TheAudioContext.destination)

export let TheReverbDestination

export function setReverbDestination (reverb) {
  TheReverbDestination = reverb
  TheReverbDestination.connect(TheAudioDestination)
}