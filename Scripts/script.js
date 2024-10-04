const hexInput = document.getElementById("hexInput");
const opacityRange = document.getElementById("opacityRange");
const opacityLabel = document.getElementById("opacityLabel");
const inputColor = document.querySelector('.input-color');
const alteredColor = document.querySelector('.altered-color');
const alteredColorText = document.querySelector('.altered-color-text');
const switchInput = document.getElementById("switchInput");
const lightenTitle = document.querySelector('.lighten-title');
const darkenTitle = document.querySelector('.darken-title');

switchInput.addEventListener('change', function() {
    if (switchInput.checked) {
        darkenTitle.classList.add('selected');
        lightenTitle.classList.remove('selected');
    } else {
        darkenTitle.classList.remove('selected');
        lightenTitle.classList.add('selected');
    }
});
// check if hex code is valid
function isHexValid(hex) {
    // Regular expression to match valid 3 or 6 character hex codes, with optional '#'
    const hexRegex = /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(hex);
};

// convert hex to rgb (should work with 3 or 6 value hex code) 
// use parseInt("", 16) to convert a hex value to a decimal value
// should return an object with 3 properties - r,g,and b
function convertHexToRGB(hex) {
    // check new hex value is valid
    if (!isHexValid(hex)) {
        return null;
    }

    let strippedHex = hex.replace('#', '');
    let r, g, b;

    if (strippedHex.length === 3) {
        // Handle shorthand notation (e.g., "#03F" -> "#0033FF")
        r = parseInt(strippedHex[0] + strippedHex[0], 16);
        g = parseInt(strippedHex[1] + strippedHex[1], 16);
        b = parseInt(strippedHex[2] + strippedHex[2], 16);
    } else if (strippedHex.length === 6) {
        // Handle full hex notation (e.g., "#0033FF")
        r = parseInt(strippedHex.substring(0, 2), 16);
        g = parseInt(strippedHex.substring(2, 4), 16);
        b = parseInt(strippedHex.substring(4, 6), 16);
    }
    
    // Return RGB values as an object or string
    return {r,g,b}
};

// convert rgb to hex 
// takes in 3 parameters - r, g, b
// for each r, g and b create a hex pair that is 2 characters long 
// return hex value starting with a #
function convertRGBToHex(r, g, b) {
    let hexOne, hexTwo, hexThree;

    hexOne = ("0" + r.toString(16)).slice(-2);
    hexTwo = ("0" + g.toString(16)).slice(-2);
    hexThree = ("0" + b.toString(16)).slice(-2);

    return `#${hexOne}${hexTwo}${hexThree}`
}

// increase rgb value by opacity percentage
// takes in rgb value as a string and opacity percentage 
// returns new rgb value
function increaseRGBByOpacity(r, g, b, opacity) {
    // Ensure opacity is a decimal between 0 and 1
    opacity = Math.min(Math.max(opacity, 0), 1);

    // Increase each RGB component by the opacity factor
    const newR = Math.min(Math.round(r + (255 - r) * opacity), 255);
    const newG = Math.min(Math.round(g + (255 - g) * opacity), 255);
    const newB = Math.min(Math.round(b + (255 - b) * opacity), 255);

    return {newR, newG, newB};
};

// create the altered colour function 
// this accepts a hex value and a percentage
// convert the hex value to rgb 
// increase rgb by appropriate percentage
// use the r,g,b values to convert to a hex value
// return the hex value
function alterColor(hex, opacity) {
    const {r,g,b} = convertHexToRGB(hex);
    const {newR, newG, newB} = increaseRGBByOpacity(r, g, b, opacity);
    let newHex = convertRGBToHex(newR, newG, newB);

    return newHex
};

hexInput.addEventListener("keyup", function() {
    let hexValue = hexInput.value;
    let newColor;
    
    // check new hex value is valid
    if (!isHexValid(hexValue)) {
        return;
    }

    // update input color background with new hex value
    const strippedHex = hexValue.replace('#', '');
    inputColor.style.backgroundColor = "#" + strippedHex;

    // update altered color background with new hex value
    const opacity = opacityRange.value / 100;
    newColor = alterColor(hexValue, opacity);
    alteredColor.style.backgroundColor = newColor;
    alteredColorText.innerText = `Altered Color: ${newColor}`; 
});

opacityRange.addEventListener("input", function() {
    let newOpacity = opacityRange.value / 100;
    let hexValue = hexInput.value;
    let newColor;

    // update opacity label with selected percentage
    opacityLabel.textContent = opacityRange.value;

    // check if hex is valid
    if (!isHexValid(hexValue)) {
        // just update opacity if no hex value entered
        alteredColor.style.opacity = newOpacity;
    } else {
        // get the altered hex value 
        newColor = alterColor(hexValue, newOpacity);

        // update altered color background 
        alteredColor.style.backgroundColor = newColor;
        alteredColorText.innerText = `Altered Color: ${newColor}`;
    }
});

