/*
    utilities for testing purposes
    from dchest's tweetnacl-util-js
    public domain
*/

let util = {};

util.decodeUTF8 = function (s) {
    if (typeof s !== 'string') throw new TypeError('expected string');
    var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
};

util.encodeHex = function (arr) {
    return Buffer.from(arr).toString('hex');
};

module.exports = util;