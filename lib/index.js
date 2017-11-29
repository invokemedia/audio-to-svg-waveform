'use strict';

var AudioSVGWaveform = require('./audio-waveform-svg-path/index.js');

var SVGO = require('svgo');
var zlib = require('zlib');
var fs = require('fs');
var Readable = require('stream').Readable;

var svgo = new SVGO();

// put the path into a fake svg
function buildSVG(path) {
  return new Promise(function (resolve) {
    var tempsvg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg viewBox="0 0 200 81" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;"><g transform="matrix(0.0334504,0,0,81,0,40.5)"><path d="' + path + '" fill="none" stroke="#000" height="100%" width="100%" x="0" y="0" /></g></svg>';
    resolve(tempsvg);
  });
}

// only create the gzipped output - no other temp files created!
function writeStream(fileout, result) {
  return new Promise(function (resolve, reject) {
    var data = new Readable();
    data.push(result.data);
    data.push(null);
    data.pipe(zlib.createGzip()).pipe(fs.createWriteStream(fileout)).on('finish', function () {
      return resolve('Done');
    }).on('error', function (err) {
      return reject(err);
    });
  });
}

function main(audioin, fileout) {
  // replace this with a fs.createReadStream?
  var filebuf = new Uint8Array(fs.readFileSync(audioin)).buffer;
  var trackWaveform = AudioSVGWaveform(filebuf);

  return new Promise(function (resolve, reject) {
    trackWaveform.then(buildSVG).then(function (data) {
      return svgo.optimize(data);
    }).then(function (result) {
      return writeStream(fileout, result);
    }).then(resolve).catch(reject);
  });
}

main('./test-song-2.mp3', './temp/output.svg.gz');

// module.exports = main;