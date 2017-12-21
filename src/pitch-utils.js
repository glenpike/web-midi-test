const getPitch = (note) => {
    const G0 = 24.5; //G0 = note number 0  = 24.5Hz
    if (note > 88)
        //hurts too much if any more!
        note = 88;

    const pitch = G0 * Math.pow(2.0, 1.0 * note / 12);

    //console.log('getPitch ', note, pitch);
    return pitch;
};

module.exports = {
    getPitch,
};
