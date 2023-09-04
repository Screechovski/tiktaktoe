const fs = require('fs');
const path = require('path');

const frontFile = path.join(__dirname, '../frontend/src/common.ts');
const backFile = path.join(__dirname, '../backend/src/common.ts');

let isCopying = false;

function copyFile(source, destination) {
    isCopying = true;
    fs.copyFile(source, destination, (err) => {
        if (err) console.error("ERROR: ", err)
        else console.log("Front copied to back")
        isCopying = false;
    });
}

fs.watch(backFile, (eventType, filename) => {
    if (filename && eventType === 'change' && !isCopying) {
        copyFile(backFile, frontFile);
    }
});

fs.watch(frontFile, (eventType, filename) => {
    if (filename && eventType === 'change' && !isCopying) {
        copyFile(frontFile, backFile);
    }
});
