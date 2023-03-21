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
/**
 * Class representing a file uploaded by a user.
 * @implements {FileDataBase}
 */
class FileData {
    /**
     * Creates a new instance of the `FileData` class.
     * @param {{mimetype: string | null, size: number, originalFilename: string | null, filepath: string, saveAt?: string}} options - An object containing properties to initialize the instance with. The `mimetype` property specifies the MIME type of the file. The `size` property specifies the size of the file in bytes. The `originalFilename` property specifies the original name of the file. The `filepath` property specifies where on disk to find the file data. The optional `saveAt` property specifies where to save uploaded files.
     */
    constructor({ mimetype, size, originalFilename, filepath, saveAt }) {
        this.data = (0, fs_1.readFileSync)(filepath, "base64");
        this.type = mimetype,
            this.size = size,
            this.filenameOriginal = originalFilename;
        this.SetFolder(saveAt);
    }
    /**
    * Uploads a file to the specified folder.
    * @param {string} [filename] - The name of the file to be uploaded. If not provided, the original name will be used
    * @param {BufferEncoding} [type] - The encoding type of the file. Defaults to "base64"
    * @returns {string} The path of the uploaded file
    * @example
    * app.post("/save", async(req, res)=>{
    *   const {id, nome} = req.body;
    *   const {foto} = req.files || {}
    *
    *   const exist = TesteCol.findOne({id});
    *
    *   if(exist){
    *       return res.send(`O id ${id} já foi registrado.`)
    *   }
    *
    *   const dirPhoto = foto.Upload()
    *
    *   TesteCol.insertOne({
    *       nome,
    *       id,
    *       foto: dirPhoto
    *   })
    *
    *   res.send("Teste")
    * })
    */
    Upload(filename, type) {
        (0, SaveAt_1.saveFile)(this.uploadFolder, filename || this.filenameOriginal, this.data, type || "base64");
        return `${this.uploadFolder}/${filename || this.filenameOriginal}`;
    }
    /**
     * Sets the upload folder for future uploads.
     * @param {string} uploadFolder - The path of the upload folder
     */
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
/**
  * Copies a base64 string to a local file.
  * @param {string} base64Url - The base64 string representing the contents of the file.
  * @param {string} [filename] - The name of the file to create. If not provided, a temporary filename will be generated.
  * @param {string} [uploadFolder=temporaryPath] - The path of the folder where the file will be saved. By default it is the temp folder.
  * @returns {(FileData|null)} Returns a FileData object with information about the created file, or null in case of an error.
  */
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
