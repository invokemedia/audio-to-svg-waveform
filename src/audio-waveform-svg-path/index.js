// Converted from https://github.com/antonKalinin/audio-waveform-svg-path
// originally, that script didn't work in node
// so I have adapted it to work in a node environment

const AudioContext = require('web-audio-api').AudioContext;

function AudioSVGWaveform(arrayBuffer) {
  const audioContext = new AudioContext();

  function getPeaks(audioBuffer, channelData, peaks, channelNumber) {
    const peaksCount = 6000;
    const sampleSize = audioBuffer.length / peaksCount;
    const sampleStep = ~~(sampleSize / 10) || 1;
    const mergedPeaks = Array.isArray(peaks) ? peaks : [];

    for (let peakNumber = 0; peakNumber < peaksCount; peakNumber++) {
      const start = ~~(peakNumber * sampleSize);
      const end = ~~(start + sampleSize);
      let min = channelData[0];
      let max = channelData[0];

      for (let sampleIndex = start; sampleIndex < end; sampleIndex += sampleStep) {
        const value = channelData[sampleIndex];

        if (value > max) {
          max = value;
        }
        if (value < min) {
          min = value;
        }
      }

      if (channelNumber === 0 || max > mergedPeaks[2 * peakNumber]) {
        mergedPeaks[2 * peakNumber] = max;
      }

      if (channelNumber === 0 || min < mergedPeaks[2 * peakNumber + 1]) {
        mergedPeaks[2 * peakNumber + 1] = min;
      }
    }

    return mergedPeaks;
  }
    /**
     * @return {String} path of SVG path element
     */
  function svgPath(peaks) {
    const totalPeaks = peaks.length;

    let d = '';
        // "for" is used for faster iteration
    for (let peakNumber = 0; peakNumber < totalPeaks; peakNumber++) {
      if (peakNumber % 2 === 0) {
        d += ` M${~~(peakNumber / 2)}, ${peaks.shift()}`;
      } else {
        d += ` L${~~(peakNumber / 2)}, ${peaks.shift()}`;
      }
    }
    return d;
  }

  function getPath(audioBuffer) {
    if (!audioBuffer) {
      console.log('No audio buffer to proccess');
      return null;
    }

    const numberOfChannels = audioBuffer.numberOfChannels;
    const channels = [];

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      channels.push(audioBuffer.getChannelData(channelNumber));
    }

    const peaks = channels.reduce(
      // change places of arguments in _getPeaks call
      (mergedPeaks, channelData, ...args) => getPeaks(audioBuffer, channelData, mergedPeaks, ...args), [],
    );

    return svgPath(peaks);
  }

  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, (output) => {
      resolve(getPath(output));
    }, reject);
  });
}

module.exports = AudioSVGWaveform;
