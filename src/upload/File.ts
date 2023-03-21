import { File } from "formidable";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { FileDataBase } from "../utils/interface";
import { temporaryPath } from "../utils/temp";
import { ExistFolder } from "./Read";
import { saveFile } from "./SaveAt";

/**
 * Class representing a file uploaded by a user.
 * @implements {FileDataBase}
 */
export default class FileData implements FileDataBase{   
    type: string | null;
    size: number;
    filenameOriginal: string | null;    
    uploadFolder: string | undefined;
    data: string | Buffer;

    /**
     * Creates a new instance of the `FileData` class.
     * @param {{mimetype: string | null, size: number, originalFilename: string | null, filepath: string, saveAt?: string}} options - An object containing properties to initialize the instance with. The `mimetype` property specifies the MIME type of the file. The `size` property specifies the size of the file in bytes. The `originalFilename` property specifies the original name of the file. The `filepath` property specifies where on disk to find the file data. The optional `saveAt` property specifies where to save uploaded files.
     */
    constructor({mimetype, size, originalFilename, filepath, saveAt}: File & {saveAt?: string}){
        this.data = readFileSync(filepath, "base64")
        this.type = mimetype,
        this.size = size,
        this.filenameOriginal = originalFilename

        this.SetFolder(saveAt as string)
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
    Upload(filename?: string, type?: BufferEncoding): string{
        saveFile(
                this.uploadFolder as string,
                filename || this.filenameOriginal as string,
                this.data, 
                type || "base64"
            )

        return `${this.uploadFolder}/${ filename || this.filenameOriginal as string}`
    }

    /**
     * Sets the upload folder for future uploads.
     * @param {string} uploadFolder - The path of the upload folder
     */
    SetFolder(uploadFolder: string){
        ExistFolder(uploadFolder, (err, path)=>{
            if(err){
                console.error(`The ${uploadFolder} not exist.`);
                return
            }

            this.uploadFolder = path
        })        
    }
}

/**
  * Copies a base64 string to a local file.
  * @param {string} base64Url - The base64 string representing the contents of the file.
  * @param {string} [filename] - The name of the file to create. If not provided, a temporary filename will be generated.
  * @param {string} [uploadFolder=temporaryPath] - The path of the folder where the file will be saved. By default it is the temp folder.
  * @returns {(FileData|null)} Returns a FileData object with information about the created file, or null in case of an error.
  */
export function CopyBase64(base64Url: string, filename?: string, uploadFolder: string = temporaryPath): (FileData | null){
    const isStringUrl = /^data:.*;base64,/;
    let name;

    if (!isStringUrl.test(base64Url)) {
        console.log("This string is not a base64 string url, please use: 'data:[mimetype];base64,'")
        return null;
    }
    const b64Arr = base64Url.split(";base64,")
    const ext = b64Arr[0].replace("data:", "").split("/")[1]
    const data = b64Arr[1];
    const buffer = Buffer.from(data, 'base64');
    const size = buffer.byteLength;

    if(!filename){
        name = `tmp-${Date.now()}-${Math.random().toString(16)}.${ext}`
    }else if(!path.extname(filename)){
        name = `tmp-${filename}.${ext}`
    }else{
        name = `tmp-${filename}`
    }
   
    try {
        writeFileSync(`${temporaryPath}/${name}`, data, "base64")
    } catch (error) {
        return null;
    }

    return new FileData({
        mimetype: b64Arr[0].replace("data:", "") as string,
        filepath: `${temporaryPath}/${name}`,
        size,
        originalFilename: name,
        saveAt: uploadFolder
    } as File & {saveAt: string});
}