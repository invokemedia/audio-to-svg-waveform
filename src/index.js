const AudioSVGWaveform = require('./audio-waveform-svg-path/index.js');

const SVGO = require('svgo');
const zlib = require('zlib');
const fs = require('fs');
const Readable = require('stream').Readable;
const color = process.env.SVG_STROKE || '#000';

const svgo = new SVGO(/*{ custom config object }*/);

// put the path into a fake svg
function buildSVG(path) {
  return new Promise((resolve) => {
    const tempsvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg viewBox="0 0 200 81" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;"><g transform="matrix(0.0334504,0,0,81,0,40.5)"><path d="${path}" fill="none" stroke="${color}" height="100%" width="100%" x="0" y="0" /></g></svg>`;
    resolve(tempsvg);
  });
}

// only create the gzipped output - no other temp files created!
function writeStream(fileout, result) {
  return new Promise((resolve, reject) => {
    const data = new Readable();
    data.push(result.data);
    data.push(null);
    data
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(fileout))
      .on('finish', () => resolve('Done'))
      .on('error', err => reject(err));
  });
}

function audioToSvgWaveform(audioin, fileout) {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(audioin);
      const filebuf = new Uint8Array(file).buffer;
      const trackWaveform = AudioSVGWaveform(filebuf);

      const newfile = fileout || `${audioin}.svg.gz`;

      trackWaveform
        .then(buildSVG)
        .then(data => svgo.optimize(data))
        .then(result => writeStream(newfile, result))
        .then(resolve)
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = audioToSvgWaveform;
