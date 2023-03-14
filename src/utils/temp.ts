import os from "os"

export let temporaryPath = os.tmpdir();


export function setTempPath(path: string){
    temporaryPath = path;
}