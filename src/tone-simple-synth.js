/*
    Simple FM Synth using Tone.js
    https://tonejs.github.io/docs/r11/FMSynth
*/

const getPitch = require('./pitch-utils.js').getPitch;
const Tone = require('tone');

const polyphony = 5;
const notesOn = {};

const oscs = {};

const shapes = ['sine', 'square', 'sawtooth', 'triangle'];

const valToShape = (val) => {
    const index = Math.floor(val * shapes.length);
    return shapes[index];
};

const controls = {
    harmonicity: 8,
    modulationIndex: 10,
    modulatorShape: 'triangle',
    carrierShape: 'sine',
};

const controlFuncs = {
    modulationIndex: (val) => val * 100.0,
    harmonicity: (val) => Math.pow(2, val * 6.375),
    modulatorShape: valToShape,
    carrierShape: valToShape,
};

const getControls = () => controls;
const getNotes = () => Object.keys(notesOn);

const setControl = (name, value) => {
    const ourValue = controlFuncs[name](value);
    const currValue = controls[name];
    controls[name] = ourValue;
    console.log(`setControl ${name}=${ourValue} (${value})`);
    for (var note in notesOn) {
        if (name === 'harmonicity' || name === 'modulationIndex') {
            notesOn[note][name].value = ourValue;
        } else if (ourValue !== currValue) {
            noteOff(note);
            noteOn(note);
        }
    }
};

const noteOn = (note) => {
    if (Object.keys(notesOn).length === polyphony) {
        console.log(`Already playing the maximum ${polyphony} notes`);
        return;
    }
    if (notesOn[note]) {
        return;
    }
    notesOn[note] = createNote(note);
    console.log(`creating oscillator for ${note}`, notesOn);
};

const createNote = (note) => {
    const frequency = getPitch(note);
    const { carrierShape, modulatorShape } = controls;
    const osc = new Tone.FMOscillator(frequency, carrierShape, modulatorShape);
    osc.toMaster();
    osc.harmonicity.value = controls.harmonicity;
    osc.modulationIndex.value = controls.modulationIndex;
    osc.start();
    return osc;
};

const noteOff = (note) => {
    const oscillator = notesOn[note];
    // We get multiple noteOff messages so may have destroyed the oscillator;
    if (!oscillator) {
        return;
    }
    oscillator.stop();
    oscillator.disconnect();
    delete notesOn[note];
};

module.exports = {
    setControl,
    noteOff,
    noteOn,
};
