import { TheAudioContext } from '../Context'
import { Song, createChannel } from '../SongGeneration'

import createPlucksTrack from './Song1/Plucks'
import createBassTrack from './Song1/Bass'
import createStringsTrack from './Song1/Strings'
import createSnareTrack from './Song1/Snares'
import createKickTrack from './Song1/Kicks'
import createHiHatTrack from './Song1/HiHats'

import { decibelsToAmplitude } from '../Utility'

export default async function createSong () {
  const bpm = 120
  const trackBeatCount = 32 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const [
    channelPlucks,
    channelBass,
    channelStrings,
    channelSnare,
    channelKick,
    channelHihat
  ] = await Promise.all([
    createPlucksTrack,
    createBassTrack,
    createStringsTrack,
    createSnareTrack,
    createKickTrack,
    createHiHatTrack
  ].map(func => createChannel(func, sampleCount, bpm)))

  return new Song(
    [
      { source: channelPlucks, volume: decibelsToAmplitude(-14), sendToReverb: 1 },
      { source: channelBass, volume: decibelsToAmplitude(-14), sendToReverb: 1 },
      { source: channelStrings, volume: decibelsToAmplitude(-14), sendToReverb: 1 },
      { source: channelSnare, volume: decibelsToAmplitude(-7.1), sendToReverb: decibelsToAmplitude(-6) },
      { source: channelKick, volume: decibelsToAmplitude(-4.9), sendToReverb: 0 },
      { source: channelHihat, volume: decibelsToAmplitude(-23), sendToReverb: 0 }
    ]
  )
}
