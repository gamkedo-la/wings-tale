// a very small pixel font
// made with love by mcfunkypants
// inspired by cc0 work by binarymoon

const pixelfontw = 3;
const pixelfonth = 6;
const charspacing = 1;
const linespacing = 8;
const pixelfontchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:?!-_\'#\"\\/<>()@";
var pixelfontimage = new Image(); 

// this is a 240x6 pixel 4 color .PNG file
// loads instantly - no waiting for onload()
// and takes up only 552 bytes of js. sweet!
pixelfontimage.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAGCAQAAABXl9sdAAABZElEQVRIx71WC5KFIAzjsLn/FXjzVoUkDYqzO4vjD6G0SVpsHb3/nN/rce+jx95a69aOnta+9/EVxWa1T3Pz9bJ7WObm79zHvqxH37Xd8UdchMgVYy998xnXrNXa0//qlaOkEZ93jHec3+o0f3bYJnQ6coe2tbt6VckMQAnGIRdcsK4pF4lG8XEEe+JTPxXoSlSNLtHnzz5C0gyT0CprWksyz3PRAlEHa5gBCEgPprISqflMvuXKkaRYocmyU3vP4kvAWp0De8WifKofnqWJ+jWpyk5bF9u0oMOWZlm/ZMnKAvmAPTrHF7DQcgRL8YG3gjvfiKTutazC6iKo3qUq87x5yEqgPL4jOwXMuwcZ890FgZ5CkhYoV7SWUM85Wc9LdA/lKGUwdnzTDcQlU+vYrEb2X8I9ELFC9+nTcutCbSrtKxlUBOoe/PYP5FftFNTD8fZ3aMJKweLOi3dHySL8BRL/d3wA3ztcx/A4sgoAAAAASUVORK5CYII=";

function micro_pixel_font(txt,x,y) {
    if (!txt) return;
    if (!x) x = 0;
    if (!y) y = 0;
    x = Math.round(x); // to prevent antialiasing
    y = Math.round(y);
    var ox = 0; // offset for each letter
    var oy = 0; // for each line
    var c = ""; // current character
    var num = 0; // current spritemap sprite number
    for (var i=0; i<txt.length; i++) {
        c = txt[i];
        if (c=="\n") { // new line
            ox = 0;
            oy += linespacing;
        }
        num = pixelfontchars.indexOf(c);
        if (num>=0) { // found?
            cx = num*pixelfontw;
            context.drawImage(pixelfontimage,cx,0,pixelfontw,pixelfonth,x+ox,y+oy,pixelfontw,pixelfonth);
        }
        ox += pixelfontw + charspacing;
    }
}

