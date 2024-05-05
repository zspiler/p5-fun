function getComplementaryColor(color) {
    // Convert the color to HSL (Hue, Saturation, Lightness) format
    let hsl = hexToHSL(color);

    // Calculate the complementary hue by adding 180 degrees (or subtracting 180 if over 360)
    let complementaryHue = (hsl.h + 180) % 360;

    // Convert the complementary hue back to RGB format
    let complementaryRGB = hslToRGB({ h: complementaryHue, s: hsl.s, l: hsl.l });

    return rgbToHex(complementaryRGB);
}

function getAnalogousColors(color) {
    let hsl = hexToHSL(color);
    let analogousColors = [];

    // Generate two analogous colors by shifting the hue slightly
    let hue1 = (hsl.h + 30) % 360;
    let hue2 = (hsl.h - 30 + 360) % 360;

    // Convert the hues back to RGB format
    let rgb1 = hslToRGB({ h: hue1, s: hsl.s, l: hsl.l });
    let rgb2 = hslToRGB({ h: hue2, s: hsl.s, l: hsl.l });

    analogousColors.push(rgbToHex(rgb1));
    analogousColors.push(rgbToHex(rgb2));

    return analogousColors;
}

// Helper functions for color conversion
function hexToHSL(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s, l: l };
}

function hslToRGB(hsl) {
    let h = hsl.h / 360;
    let s = hsl.s;
    let l = hsl.l;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function rgbToHex(rgb) {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

export function hexToRgb(hex) {
    return {
        r: parseInt(hex.substring(1, 3), 16),
        g: parseInt(hex.substring(3, 5), 16),
        b: parseInt(hex.substring(5, 7), 16),
    };
}

export function generatePalette(baseColor) {
    let palette = [];

    // Add the base color to the palette
    palette.push(baseColor);

    // Generate complementary colors
    let complementaryColor = getComplementaryColor(baseColor);
    palette.push(complementaryColor);

    // Generate additional colors based on the complementary color
    let analogousColors = getAnalogousColors(complementaryColor);
    palette = palette.concat(analogousColors);

    return palette;
}


export function randomRgb() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
}

export function randomHex() {
    let rgb = randomRgb();
    return rgbToHex(rgb);
}