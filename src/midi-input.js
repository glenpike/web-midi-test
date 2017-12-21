/*
    Very simplistic module for listing, getting MIDI devices.
    Will also allow mapping of an input to
    See https://webaudio.github.io/web-midi-api
    & https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess
*/

// Store our MIDI inputs / outputs here.
// We don't listen for disconnect, which could happen!
let inputs;
let outputs;

// Asks the browser for a list of devices, stores the
// results and returns iterators to loop through these.
const listMidiDevices = () =>
    // Get lists of available MIDI controllers
    navigator.requestMIDIAccess().then(function(access) {
        inputs = access.inputs;
        outputs = access.outputs;
        return {
            // Returning generators - we can only iterate them once!
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
            inputs: inputs.values(),
            outputs: outputs.values(),
        };
    });

// Get the input & output for a specific device ID
const getMidiDevice = (id) => {
    if (!inputs && !outputs) {
        console.log('no inputs or outputs ');
        return null;
    }
    const device = {};
    for (const input of inputs.values()) {
        if (id && input.id === id) {
            // console.log('found input ', input);
            device.input = input;
        }
    }
    for (const output of outputs.values()) {
        console.log('output ', output);
        if (id && output.id === id) {
            // console.log('found output ', output);
            device.output = output;
        }
    }
    return device;
};

// Based on https://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer
// We map our messages to functions in our map.
const initMIDIInput = (input, map) => {
    console.log('initMIDIInput input ', input);
    const onMIDIMessage = (event) => {
        const byte0 = event.data[0] & 0xf0;
        switch (byte0) {
            case 0xf0:
                return;
            case 0x90:
                if (event.data[2] != 0 && map.noteOn) {
                    // if velocity != 0, this is a note-on message
                    map.noteOn(event.data[1], event.data[2]);
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                if (map.noteOff) {
                    map.noteOff(event.data[1]);
                }
                return;
            case 0xb0: //continuous controller.
                const byte1 = event.data[1] & 0xff;
                console.log(`byte1 ${byte1} (${byte1.toString(16)})`)
                if (map[byte1]) {
                    map[byte1](event.data[2]);
                    return;
                }
            default:
                let str = `MIDI message ${byte0} [${event.data.length} bytes]:`;
                for (let i = 0; i < event.data.length; i++) {
                    str += ` 0x${event.data[i].toString(16)}`;
                }
                console.log(str);
                return;
        }
    };
    input.onmidimessage = onMIDIMessage;
};

module.exports = {
    listMidiDevices,
    getMidiDevice,
    initMIDIInput,
};
