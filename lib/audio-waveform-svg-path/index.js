'use strict';

// Converted from https://github.com/antonKalinin/audio-waveform-svg-path
// originally, that script didn't work in node
// so I have adapted it to work in a node environment

var AudioContext = require('web-audio-api').AudioContext;

function AudioSVGWaveform(arrayBuffer) {
  var audioContext = new AudioContext();

  function getPeaks(audioBuffer, channelData, peaks, channelNumber) {
    var peaksCount = 6000;
    var sampleSize = audioBuffer.length / peaksCount;
    var sampleStep = ~~(sampleSize / 10) || 1;
    var mergedPeaks = Array.isArray(peaks) ? peaks : [];

    for (var peakNumber = 0; peakNumber < peaksCount; peakNumber++) {
      var start = ~~(peakNumber * sampleSize);
      var end = ~~(start + sampleSize);
      var min = channelData[0];
      var max = channelData[0];

      for (var sampleIndex = start; sampleIndex < end; sampleIndex += sampleStep) {
        var value = channelData[sampleIndex];

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
    var totalPeaks = peaks.length;

    var d = '';
    // "for" is used for faster iteration
    for (var peakNumber = 0; peakNumber < totalPeaks; peakNumber++) {
      if (peakNumber % 2 === 0) {
        d += ' M' + ~~(peakNumber / 2) + ', ' + peaks.shift();
      } else {
        d += ' L' + ~~(peakNumber / 2) + ', ' + peaks.shift();
      }
    }
    return d;
  }

  function getPath(audioBuffer) {
    if (!audioBuffer) {
      console.log('No audio buffer to proccess');
      return null;
    }

    var numberOfChannels = audioBuffer.numberOfChannels;
    var channels = [];

    for (var channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      channels.push(audioBuffer.getChannelData(channelNumber));
    }

    var peaks = channels.reduce(
    // change places of arguments in _getPeaks call
    function (mergedPeaks, channelData) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return getPeaks.apply(undefined, [audioBuffer, channelData, mergedPeaks].concat(args));
    }, []);

    return svgPath(peaks);
  }

  return new Promise(function (resolve, reject) {
    audioContext.decodeAudioData(arrayBuffer, function (output) {
      resolve(getPath(output));
    }, reject);
  });
}

module.exports = AudioSVGWaveform;