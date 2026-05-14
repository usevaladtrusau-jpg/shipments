const crypto = require('crypto');

const generatePseudoRandomLetters = () => {
    const INIT_CHAR = 65; // A
    const ABC_DEPTH = 26;
    const CRYPTO_START = 0;

    return String.fromCharCode(INIT_CHAR + crypto.randomInt(CRYPTO_START + ABC_DEPTH));
}

const generatePseudoRandomNumbers = () => {
    const CRYPTO_START = 0;
    const CRYPTO_END = 10;

    return crypto.randomInt(CRYPTO_START, CRYPTO_END);
}

const generateCuid = () => {
    const EMPTY_STRING = '';
    const letters = Array.from({length: 3}, generatePseudoRandomLetters).join(EMPTY_STRING);
    const numbers = Array.from({length: 3}, generatePseudoRandomNumbers).join(EMPTY_STRING);
    const lastNumber = generatePseudoRandomNumbers();

    return `${letters}${numbers}-${lastNumber}`;
}

module.exports = {generateCuid}