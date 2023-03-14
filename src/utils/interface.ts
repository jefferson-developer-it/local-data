
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

export interface BaseDataCol{
    _id?: string,
    save?: ()=>boolean
    delete?: ()=>boolean
}

export type ColProjection<T = ObjAny> = {
    [K in keyof T]?: boolean | Projection
}

export interface Projection{
    maxLength?: number,
    split?: string,
    join?: string,
    includes?: string | string[]
}

export interface OptionsFind<typeProjection=ObjAny> {
    projection?: ColProjection<typeProjection>,
    limit?: number,
    skip?: number,
}

export interface QueryDatabase {
    [key: string]: string | number;
}
  