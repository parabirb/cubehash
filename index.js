/*
    pure JS cubehash implementation
    public domain, written by parabirb 2021
*/

class CubeHash {
    // defaults are for CubeHash512, recommended by djb
    constructor(i = 16, r = 16, b = 32, f = 32, h = 512) {
        // set our cubehash type
        this.i = i;
        this.r = r;
        this.b = b;
        this.f = f;
        this.h = h;
        // start our state pre-round
        this.initialState = new Uint32Array(32);
        this.initialState[0] = h / 8;
        this.initialState[1] = b;
        this.initialState[2] = r;
        // apply i rounds to it
        for (let j = 0; j < i; j++) this.round(this.initialState);
    }
    // ROTL
    #ROTL(a, b) {
        return (a << b) | (a >>> (32 - b));
    }
    // cubehash round
    round(state) {
        // add 0jklm into 1jklm for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i + 16] += state[i];
        }
        // rotate 0jklm upwards by 7 bits for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i] = this.#ROTL(state[i], 7);
        }
        // swap 00klm with 01klm for each k, l, m
        for (let i = 0; i < 8; i++) {
            let tmp = state[i];
            state[i] = state[i + 8];
            state[i + 8] = tmp;
        }
        // xor 1jklm into 0jklm for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i] ^= state[i + 16];
        }
        // swap 1jk0m with 1jk1m for each j, k, m
        for (let i = 0; i < 8; i++) {
            // do some bit manipulation to get 1jk0m
            // (12 is 0b1100 in binary)
            let jk0m = (((i << 1) & 12) | (i & 1)) + 16;
            let tmp = state[jk0m];
            state[jk0m] = state[jk0m + 2];
            state[jk0m + 2] = tmp;
        }
        // add 0jklm into 1jklm for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i + 16] += state[i];
        }
        // rotate 0jklm upwards by 11 bits for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i] = this.#ROTL(state[i], 11);
        }
        // swap 0j0lm with 0j1lm for each j, l, m
        for (let i = 0; i < 8; i++) {
            // do some bit manipulation to get 0j0lm
            let j0lm = ((i & 4) << 1) | (i & 3);
            let tmp = state[j0lm];
            state[j0lm] = state[j0lm + 4];
            state[j0lm + 4] = tmp;
        }
        // xor 1jklm into 0jklm for each j, k, l, m
        for (let i = 0; i < 16; i++) {
            state[i] ^= state[i + 16];
        }
        // swap 1jkl0 with 1jkl1 for each j, k, l
        for (let i = 0; i < 8; i++) {
            // bit manipulation to get 1jkl0
            let jkl0 = (i << 1) + 16;
            let tmp = state[jkl0];
            state[jkl0] = state[jkl0 + 1];
            state[jkl0 + 1] = tmp;
        }
    }
    // the hash implementation
    hash(m) {
        // set our initial message object to null
        let message = null;
        // initialize our message object to a certain girth (lenny)
        if (m.length % this.b !== 0) {
            // we want the minimum number of bytes to get to a multiple of b bytes
            message = new Uint8Array(Math.ceil(m.length / this.b) * this.b);
        }
        else {
            // same thing here, except we want to get to the next multiple
            message = new Uint8Array(m.length + this.b);
        }
        // put our message m into the padded message object
        for (let i = 0; i < m.length; i++) {
            message[i] = m[i];
        }
        // set the byte after the message to 128, the rest will all be zeroes
        message[m.length] = 128;
        // create a state and its uint8array counterpart
        let state = new Uint32Array([...this.initialState]);
        let uint8State = new Uint8Array(state.buffer);
        // for each input block
        let inputBlocks = message.length / this.b;
        for (let i = 0; i < inputBlocks; i++) {
            // for each byte in the input block
            let iTimesB = i * this.b;
            for (let j = 0; j < this.b; j++) {
                // XOR the state with the byte
                uint8State[j] ^= message[iTimesB + j];
            }
            // transform the state through r rounds
            for (let j = 0; j < this.r; j++) this.round(state);
        }
        // xor 1 into the last state word
        state[31] ^= 1;
        // transform the state through f rounds
        for (let i = 0; i < this.f; i++) this.round(state);
        // return the first h/8 bytes of the state
        return uint8State.slice(0, this.h / 8);
    }
    // cubemac implementation (see https://cubehash.cr.yp.to/submission2/tweak2.pdf)
    mac(message, key) {
        // our key is 64 bytes
        if (key.length !== 64) {
            throw new Error("Key length must be 64 bytes (512 bits).");
        }
        // we just concat the key and message then hash it
        return this.hash(new Uint8Array([...key, ...message]));
    }
}

// export CubeHash if in CJS, otherwise set window.CubeHash to CubeHash
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = CubeHash;
}
else {
    window.CubeHash = CubeHash;
}