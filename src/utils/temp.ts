import os from "os"

export let temporaryPath = os.tmpdir();

/**
 * Sets the temporary path for a module or application.
 * @param {string} path - The path to set as the temporary path.
 *
 * @example
 * setTempPath('./temp');
 */
export function setTempPath(path: string){
    temporaryPath = path;
}