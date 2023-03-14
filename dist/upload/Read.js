"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistFolder = void 0;
const fs_1 = require("fs");
function ReadFile(path) {
    return (0, fs_1.readFileSync)(path, "base64");
}
exports.default = ReadFile;
function ExistFolder(path, callback) {
    const existFolder = (0, fs_1.existsSync)(path);
    callback(!existFolder, path);
}
exports.ExistFolder = ExistFolder;
