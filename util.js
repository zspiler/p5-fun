

export function getRandomUnicodeCharacter() {
    return Array.from(
        { length: 1 }, () => String.fromCharCode(Math.floor(Math.random() * (65536)))
    ).join('')
}

export function getRandomEmoji(seed) {
    // Define the range of Unicode characters representing emojis
    const min = 0x1F300; // Start of emoji range
    const max = 0x1F9FF; // End of emoji range

    // Initialize a PRNG with the provided seed
    const rng = new Math.seedrandom(seed);

    // Generate a random Unicode code point within the specified range
    const codePoint = Math.floor(rng() * (max - min + 1)) + min;

    // Return the emoji corresponding to the generated code point
    return String.fromCodePoint(codePoint);
}