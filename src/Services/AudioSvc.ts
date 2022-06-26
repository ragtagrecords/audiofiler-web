import { guess } from 'web-audio-beat-detector';

const guessTempo = async (audioFile: File) => {
  const audioContext = new AudioContext();

  // I think we could increase speed here by not including the entire song in the buffer
  // Should really only need like 20 seconds or so to determine bpm
  // Not sure how to trim yet, not too experienced with buffers - Jarvis
  const buffer = await audioFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(buffer);

  try {
    let { bpm } = await guess(audioBuffer);

    // Put tempo in reasonable range
    if (bpm < 60) {
      bpm *= 2;
    } else if (bpm > 140) {
      bpm /= 2;
    }
    return bpm;
  } catch (err) {
    console.log(err);
    return 0;
  }

  // This works, but seems to be less accurate than guess
  /*
  analyze(audioBuffer)
    .then((tempo) => {
      console.log('Anaylze result');
      console.log(tempo);
    })
    .catch((err) => {
      console.log("Couldn't anaylze audio");
      console.log(err);
    });
  */
};

export default guessTempo;
