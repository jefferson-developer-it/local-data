"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFolder = exports.saveFile = void 0;
const fs_1 = require("fs");
const Read_1 = require("./Read");
/**
 * Saves a file in a specified folder.
 * @param {string} folder - The path of the folder where the file should be saved.
 * @param {string} filename - The name of the file to save.
 * @param {string | Buffer} data - The data to be saved to the file.
 * @param {BufferEncoding} [type="base64"] - The encoding type of the data. Default is "base64".
 *
 * @example
 * saveFile('./myFolder', 'data.txt', 'Hello World!', 'utf8');
 */
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
/**
 * Creates a new folder at the specified path if it doesn't exist.
 * @param {string} path - The path where the new folder should be created.
 * @param {(err: boolean, local: string) => void} [cb] - An optional callback function that is called after folder creation. It takes a boolean error and the path of the created folder as arguments.
 *
 * @example
 * newFolder('./myFolder', (err, local) => {
 *   if (err) {
 *     console.log(`The folder ${local} was created.`);
 *   } else {
 *     console.log(`The folder ${local} already exists.`);
 *   }
 * });
 */
function newFolder(path, cb) {
    (0, Read_1.ExistFolder)(path, (err, folder) => {
        if (err) {
            (0, fs_1.mkdirSync)(folder);
        }
        cb && cb(err, folder);
    });
}
exports.newFolder = newFolder;
