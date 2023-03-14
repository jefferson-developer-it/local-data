
export interface DataBase{
    name: string,
    path: string,
    cols: {[name: string]: Collection}
}

export interface Collection{
    name: string,
    path: string,
    data: any[]
}

export interface ObjAny<type=any>{
    [name: string]: type
}

export interface FileDataBase{
    type: string | null
    size: number
    filenameOriginal: string | null
    uploadFolder: string | undefined
    data: string | Buffer
}

export interface BodyParserParam{
    saveFileAt?: string
}