# Introduction

A very simple example of using Web MIDI.
The program lists any connected MIDI input devices and allows you to select one.
The selected MIDI device has some controls mapped to a [Tone.js]() synth.

Cribbed from examples at [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess)
& [Web MIDI Spec](https://webaudio.github.io/web-midi-api)

Written in ~ES6 JavaScript

Currently, you can control the FM synth with the following continuous controllers.

10 (0xa) Pan -> 'harmonicity'
1  (0x1) Modulation -> 'modulationIndex'
11 (0xb) Expression -> 'modulatorShape'
91 (0x5b) Effect 1 Depth (Reverb amount) -> 'carrierShape'

You can change this by adjusting the control numbers which are keys of the 'map' object in main.js L14:
```JavaScript
const map = {
    noteOn: noteOn,
    noteOff: noteOff,
    0xa: makeControl('harmonicity'),
    0x1: makeControl('modulationIndex'),
    0xb: makeControl('modulatorShape'),
    0x5b: makeControl('carrierShape'),
};
```

# Usage

Run `npm install` to install required dependencies.

Then run `npm run dev` to bundle the contents src for browser and start a simple http server on port 8080.
(Will also watch for changes to src files and rebuild / [livereload](https://github.com/livereload/livereload-extensions))

Connect a MIDI input device and load up the page in your browser.  The device should show up in the list.
Select this and then play the keys / fiddle with the controllers.
