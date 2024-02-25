const fs = require('fs');
const path = require('path');

function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        let jsonData = JSON.parse(data);
        // 确保 'users' 数组存在
        if (!jsonData.users) {
            jsonData.users = []; // 如果不存在 'users'，则初始化
        }
        return jsonData;
    } catch (error) {
        console.error('读取或解析文件中的 JSON 时出错:', error);
        return { users: [] }; // 如果有错误，用一个空的 'users' 数组初始化
    }
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