import { existsSync, readFileSync } from "fs";

export default function ReadFile(path: string){
    return readFileSync(path, "base64")
}

export function ExistFolder(path: string, callback: (err: boolean, path: string) => void){
    const existFolder = existsSync(path)

    callback(!existFolder, path)
}