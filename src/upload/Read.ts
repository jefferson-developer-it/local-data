import { existsSync, readFileSync } from "fs";

/**
 * Reads the contents of a file at a specified path.
 * @param {string} path - The path of the file to be read.
 * @param {BufferEncoding} [type="base64"] - The encoding type of the file. Default is "base64".
 * @returns {string | Buffer} The contents of the file.
 *
 * @example
 * const data = ReadFile('./data.txt', 'utf8');
 * console.log(data);
 */
export default function ReadFile(path: string, type: BufferEncoding = "base64"): string | Buffer{
    return readFileSync(path, type)
}

/**
 * Checks if a folder exists at a specified path and calls a callback function with the result.
 * @param {string} path - The path of the folder to check for existence.
 * @param {(err: boolean, path: string) => void} callback - A callback function that is called with a boolean error value and the folder path as arguments. If `err` is `true`, it means that the folder does not exist.
 *
 * @example
 * ExistFolder('./myFolder', (err, path) => {
 *   if (err) {
 *     console.log(`The folder ${path} does not exist.`);
 *   } else {
 *     console.log(`The folder ${path} exists.`);
 *   }
 * });
 */
export function ExistFolder(path: string, callback: (err: boolean, path: string) => void){
    const existFolder = existsSync(path)

    callback(!existFolder, path)
}