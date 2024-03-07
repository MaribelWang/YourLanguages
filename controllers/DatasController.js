const fs = require('fs');
const path = require('path');

function readData(filePath) { 
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
function writeData(data, filePath) {
    const updatedJsonData = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, updatedJsonData, 'utf-8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Data added to JSON file successfully.');
    });
}

function generateUniqueId (){
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomPart}`;
}

module.exports = { readData, writeData, generateUniqueId};