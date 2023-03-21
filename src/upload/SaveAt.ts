import { mkdirSync, writeFileSync } from "fs";
import { ExistFolder } from "./Read";
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
export function saveFile(folder: string, filename: string, data: string | Buffer, type: BufferEncoding="base64"){
    ExistFolder(folder, (err, path)=>{
        if(err){
            console.log(`The folder ${folder} not exist.`);
            return
        }
        writeFileSync(`${folder}/${filename}`, data, type)
    })
}

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
export function newFolder(path: string, cb?: (err: boolean, local: string) => void){
    ExistFolder(path, (err, folder)=>{
        if(err){
            mkdirSync(folder)
        }

        cb && cb(err, folder)
    })
}