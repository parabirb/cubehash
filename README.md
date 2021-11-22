# cubehash
## DISCLAIMER
THIS LIBRARY IS MEANT AS A REFERENCE IMPLEMENTATION. A *REFERENCE IMPLEMENTATION*. I AM NOT AN EXPERIENCED CRYPTOGRAPHER AND I CANNOT GUARANTEE THAT THIS LIBRARY IS SECURE. **DO NOT USE THIS FOR ANYTHING IMPORTANT! YOU HAVE BEEN WARNED.**

## introduction
cubehash is an ARX cryptographic hash function by DJB, which was submitted to the SHA-3 competition but did not make it to the finalists. i found it rather interesting and wanted to write an implementation of it. currently, the cryptanalysis seems rather promising (although there hasn't been much since the early 2010s). cubehash is simple to implement and has some nice features, like being able to change the number of rounds, size of input blocks, digest length, etc. however, there seems to be no good implementation of cubehash in JS. this library is meant as a reference for future JS implementations of cubehash. this implementation has no dependencies and is well commented for future reference.

## installation
browser:
* put something along the lines of `<script src="https://cdn.jsdelivr.net/npm/node-cubehash/index.js">` in your code. `window.CubeHash` will be set to the CubeHash class.

node:
* `npm i --save node-cubehash` will install cubehash for you.

## usage
the `module.exports` of this library (or `window.CubeHash` if you include `index.js` in the browser) is a class called `CubeHash`. its methods are provided below for reference.

* `constructor()` - sets the parameters for CubeHash512, or CubeHash16+16/32+32-512, and precomputes the initialization vector. this is a sane default and no further configuration is required after creating the object.
* `constructor(Number i, Number r, Number b, Number f, Number h)` - sets the parameters for CubeHashi+r/b+f-h and precomputes the initialization vector (to know what this means, [click here](https://cubehash.cr.yp.to/index.html)). **NOTE THAT NO INPUT CHECKING IS DONE ON THE PARAMETERS AND YOU SHOULD VERIFY THAT THEY ARE CORRECT YOURSELF.** i should be a member of the set {1,2,3,...}, r should be a member of the set {1,2,3,...}, b should be a member of the set {1,2,3,...,128}, f should be a member of the set {1,2,3,...}, and h should be a member of the set {8,16,24,...,512}.
* `Uint8Array hash(Uint8Array m)` - returns the hash for `m` with the parameters specified in the constructor.
* `Uint8Array mac(Uint8Array message, Uint8Array key)` - returns the CubeMAC with key `key` and message `message` with the parameters specified in the constructor. the key must be 512 bits (64 bytes). for more information, [click here](https://cubehash.cr.yp.to/submission2/tweak2.pdf).

reference usage:
```JS
// require cubehash
const CubeHash = require("node-cubehash");
// create a new cubehash object. cubehash512 by default.
const cubehash512 = new CubeHash();

// create a message uint8array
let message = new Uint8Array(Buffer.from("cubehash"));
// compute our hash
let rawHash = cubehash512.hash(message);
// log our hash as base64
console.log(Buffer.from(rawHash).toString("base64"));
```

## testing
run `npm test` or `node test` to run the test suite. the test suite includes a speedtest and verifies the output based on certain test vectors ([found here](https://en.wikipedia.org/wiki/CubeHash)).

## code
most implementations of cubehash seem to be rather scarcely commented. this implementation *is* well commented. for further reference, read the [specification](https://cubehash.cr.yp.to/index.html).
