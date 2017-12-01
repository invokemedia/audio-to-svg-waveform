# Audio To SVG Waveform

> Convert an audio file to a compressed (gzip) SVG waveform

This module uses a converted version of [antonKalinin/audio-waveform-svg-path](https://github.com/antonKalinin/audio-waveform-svg-path) that runs in Node instead of in the browser.

### Usage

```js
const audioToSvgWaveform = require('audio-to-svg-waveform');

audioToSvgWaveform('./infile.mp3', './output.svg.gz')
  .then(() => console.log('complete!'))
  .catch(console.error)
```

### Output

![screenshot of the waveform output](/screenshot.png)

The default stroke color is set to `#000` but you can override with `SVG_STROKE` environment variable. But that can be changed with CSS when the file is included inline.

### Babel.js

The current, stable version of [node.js](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V6.md#6.3.1) supports [95%](http://node.green/) ES6 [features](https://github.com/lukehoban/es6features). 

Also, we build npm modules to run on older versions of Node.js.

We will use Babel.js with [ES2015 preset](http://babeljs.io/docs/plugins/preset-es2015/) to compile ES6 code to ES5.

### Coding style

Airbnb has an excellent [style guide](https://github.com/airbnb/javascript) for ES6. We will follow the guide and adhere to the recommended coding style.

### ESLint

We will use ESLint with Airbnb style and pre-parse our code to detect violations of the style.

 
## Quick Start
1. Make sure you have recent, stable version of node (>= 6.1.0).

```
nave use stable
node -v
```
2. Clone or download this repo.

3. Get latest releases of the tools

```
npm update --save
```

## Commands
### Test
```
npm run test
```

### Lint
```
npm run lint
```

### Build
```
npm run build
```

### Run
#### ES6 code via babel
```
npm run dev
```

#### ES5 code (Transpiled)
```
npm run build

node lib/
```
or
```
npm start
```

## Code Directories

./src - source code, stays in git repo.

./lib - transpiled ES5 code, not saved in git, gets published to npm.

## License

  [MIT](LICENSE)
