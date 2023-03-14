"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFolder = exports.saveFile = void 0;
const fs_1 = require("fs");
const Read_1 = require("./Read");
function saveFile(folder, filename, data, type = "base64") {
    (0, Read_1.ExistFolder)(folder, (err, path) => {
        if (err) {
            console.log(`The folder ${folder} not exist.`);
            return;
        }
        (0, fs_1.writeFileSync)(`${folder}/${filename}`, data, type);
    });
}
exports.saveFile = saveFile;
function newFolder(path, cb) {
    (0, Read_1.ExistFolder)(path, (err, folder) => {
        if (err) {
            (0, fs_1.mkdirSync)(folder);
        }
        cb && cb(err, folder);
    });
}
exports.newFolder = newFolder;
