import { existsSync, readFileSync } from "fs";

export default function ReadFile(path: string, type: BufferEncoding = "base64"){
    return readFileSync(path, type)
}

export function ExistFolder(path: string, callback: (err: boolean, path: string) => void){
    const existFolder = existsSync(path)

    callback(!existFolder, path)
}