import { File } from "formidable";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { FileDataBase } from "../utils/interface";
import { temporaryPath } from "../utils/temp";
import { ExistFolder } from "./Read";
import { saveFile } from "./SaveAt";

export default class FileData implements FileDataBase{   
    type: string | null;
    size: number;
    filenameOriginal: string | null;    
    uploadFolder: string | undefined;
    data: string | Buffer;

    constructor({mimetype, size, originalFilename, filepath, saveAt}: File & {saveAt?: string}){
        this.data = readFileSync(filepath, "base64")
        this.type = mimetype,
        this.size = size,
        this.filenameOriginal = originalFilename

        this.SetFolder(saveAt as string)
    }

    Upload(filename?: string, type?: BufferEncoding){
        saveFile(
                this.uploadFolder as string,
                filename || this.filenameOriginal as string,
                this.data, 
                type || "base64"
            )
    }

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

export function CopyBase64(base64Url: string, filename?: string, uploadFolder: string = temporaryPath){
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