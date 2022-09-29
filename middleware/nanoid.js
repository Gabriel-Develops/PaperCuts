const { customAlphabet } = require('nanoid')

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

module.exports = nanoid