"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyBase64 = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const temp_1 = require("../utils/temp");
const Read_1 = require("./Read");
const SaveAt_1 = require("./SaveAt");
class FileData {
    constructor({ mimetype, size, originalFilename, filepath, saveAt }) {
        this.data = (0, fs_1.readFileSync)(filepath, "base64");
        this.type = mimetype,
            this.size = size,
            this.filenameOriginal = originalFilename;
        this.SetFolder(saveAt);
    }
    Upload(filename, type) {
        (0, SaveAt_1.saveFile)(this.uploadFolder, filename || this.filenameOriginal, this.data, type || "base64");
    }
    SetFolder(uploadFolder) {
        (0, Read_1.ExistFolder)(uploadFolder, (err, path) => {
            if (err) {
                console.error(`The ${uploadFolder} not exist.`);
                return;
            }
            this.uploadFolder = path;
        });
    }
}
exports.default = FileData;
function CopyBase64(base64Url, filename, uploadFolder = temp_1.temporaryPath) {
    const isStringUrl = /^data:.*;base64,/;
    let name;
    if (!isStringUrl.test(base64Url)) {
        console.log("This string is not a base64 string url, please use: 'data:[mimetype];base64,'");
        return null;
    }
    const b64Arr = base64Url.split(";base64,");
    const ext = b64Arr[0].replace("data:", "").split("/")[1];
    const data = b64Arr[1];
    const buffer = Buffer.from(data, 'base64');
    const size = buffer.byteLength;
    if (!filename) {
        name = `tmp-${Date.now()}-${Math.random().toString(16)}.${ext}`;
    }
    else if (!path_1.default.extname(filename)) {
        name = `tmp-${filename}.${ext}`;
    }
    else {
        name = `tmp-${filename}`;
    }
    try {
        (0, fs_1.writeFileSync)(`${temp_1.temporaryPath}/${name}`, data, "base64");
    }
    catch (error) {
        return null;
    }
    return new FileData({
        mimetype: b64Arr[0].replace("data:", ""),
        filepath: `${temp_1.temporaryPath}/${name}`,
        size,
        originalFilename: name,
        saveAt: uploadFolder
    });
}
exports.CopyBase64 = CopyBase64;
