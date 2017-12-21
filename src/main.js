// Import our dependencies
const midiInput = require('./midi-input.js');
const synth = require('./tone-simple-synth.js');

// extract the functions we're using for synt
const { setControl, noteOn, noteOff } = synth;

// normalise MIDI controller values to 0<=n<=1.0
const makeControl = (name) => (val) => {
    setControl(name, val / 128.0);
};

// Create a map of MIDI inputs to our synth controls
const map = {
    noteOn: noteOn,
    noteOff: noteOff,
    0xa: makeControl('harmonicity'),
    0x1: makeControl('modulationIndex'),
    0xb: makeControl('modulatorShape'),
    0x5b: makeControl('carrierShape'),
};

// Get the dropdown box from the HTML doc & disable it.
const inputList = document.querySelector('.js-midi-device');
inputList.disabled = true;

// Get a list of MIDI inputs and add these to dropdown
midiInput.listMidiDevices().then((devices) => {
    let htmlStr = '<option value="none">Select</option>';
    const { inputs } = devices;
    for (const input of inputs) {
        htmlStr += `<option value=${input.id}>${input.name}</option>`;
    }
    inputList.innerHTML = htmlStr;
});
inputList.disabled = false;

// When an input is selected, get the device for it and ask
// the midiInput to map our controls.
inputList.addEventListener('change', (event) => {
    const inputId = inputList.selectedOptions[0].value;
    if (inputId !== 'none') {
        const device = midiInput.getMidiDevice(inputId);
        if (device && device.input) {
            // wire up...
            midiInput.initMIDIInput(device.input, map);
        }
    }
});
