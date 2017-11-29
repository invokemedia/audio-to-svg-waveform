import audioToSvgWaveform from '../src/index.js';

const fs = require('fs');

let chai = require('chai');

chai.should();
const expect = chai.expect;

describe('Main', () => {
  it('Can create a compressed SVG file from an audio file', () => {
    audioToSvgWaveform('./test/infile.mp3', './test/infile.svg.gz')
      .then(() => {
          console.log('complete!');
          expect(fs.existsSync('./test/infile.svg.gz')).to.equal(true);
      })
      .catch((err) => {
          return err;
      });
  })
  it('Can create an output file without a specified output', () => {
    audioToSvgWaveform('./test/infile.mp3')
      .then(() => {
          console.log('complete!');
          expect(fs.existsSync('./test/infile.mp3.svg.gz')).to.equal(true);
      })
      .catch((err) => {
          return err;
      });
  })
  it('Will fail when no file is added', () => {
    audioToSvgWaveform(null, './test/infile.svg.gz')
      .catch((err) => {
          expect(err).to.be.a('object');
      });
  })
});
