/*
    cubehash test suite
*/

const util = require("./util");
const CubeHash = require(".");
const { performance } = require("perf_hooks");
const cubeHash512 = new CubeHash();
const testVectorCubeHash = new CubeHash(80, 8, 1, 80, 512);

// test vectors from Wikipedia
console.log(`CubeHash tests.
Test vectors taken from this Wikipedia article: https://en.wikipedia.org/wiki/CubeHash
For verification, CubeHash80+8/1+80-512 is used.
For speed testing, CubeHash512 (CubeHash 16+16/32+32-512) is used.`);

// verify test vectors
console.log("Verifying test vectors...");
// first, we want to test the initial state buffer
let iv = util.encodeHex(new Uint8Array(testVectorCubeHash.initialState.buffer));
console.log(`IV correct? (should be yes) ${iv === "5df39869c73009fb108994600f1626e6f37c07360c0d8bb53d19cf57b8e741335b8034a3eff9892014c4ff315038ef2a391812fe52a440e9a293527d12ca45706e0958933470bf814aa4909adb3ec39384e9c314d0db874af21d45bcacb312521ce5ab6a3bf6f05de88abbdd0fcfd3fafb8225d546242eada52540095c3da221" ? "yes" : "no"}`);
// next, we'll test the hashes
let hash1 = util.encodeHex(testVectorCubeHash.hash(util.decodeUTF8("")));
console.log(`hash("") correct? (should be yes) ${hash1 === "90bc3f2948f7374065a811f1e47a208a53b1a2f3be1c0072759ed49c9c6c7f28f26eb30d5b0658c563077d599da23f97df0c2c0ac6cce734ffe87b2e76ff7294" ? "yes" : "no"}`);
let hash2 = util.encodeHex(testVectorCubeHash.hash(util.decodeUTF8("The quick brown fox jumps over the lazy dog")));
console.log(`hash("The quick brown fox jumps over the lazy dog") correct? (should be yes) ${hash2 === "ca942b088ed9103726af1fa87b4deb59e50cf3b5c6dcfbcebf5bba22fb39a6be9936c87bfdd7c52fc5e71700993958fa4e7b5e6e2a3672122475c40f9ec816ba" ? "yes" : "no"}`);

// speedtest
console.log("Testing speed...");
let message = util.decodeUTF8("CubeHash JS implementation by parabirb");
let x = performance.now();
let hash3 = cubeHash512.hash(message);
let y = performance.now();
console.log(`Hash took ${Math.round((y - x) * 100) / 100} ms. (less is better)`);