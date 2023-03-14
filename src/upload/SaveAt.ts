import { mkdirSync, writeFileSync } from "fs";
import { ExistFolder } from "./Read";

export function saveFile(folder: string, filename: string, data: string | Buffer, type: BufferEncoding="base64"){
    ExistFolder(folder, (err, path)=>{
        if(err){
            console.log(`The folder ${folder} not exist.`);            
            return
        }
        writeFileSync(`${folder}/${filename}`, data, type)
    })
}

export function newFolder(path: string, cb?: (err: boolean, local: string) => void){
    ExistFolder(path, (err, folder)=>{
        if(err){
            mkdirSync(folder)
        }

        cb && cb(err, folder)
    })
}