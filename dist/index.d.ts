import { File } from "formidable"

declare const localData: LCL.LocalData

export = localData;

export as namespace localData

declare namespace LCL {
        
    interface DataBase{
        name: string,
        path: string,
        cols: {[name: string]: Collection}
    }

    interface Collection{
        name: string,
        path: string,
        data: any[]
    }

    interface ObjAny<type=any>{
        [name: string]: type
    }

    interface FileDataBase{
        type: string | null
        size: number
        filenameOriginal: string | null
        uploadFolder: string | undefined
        data: string | Buffer
    }

    interface BodyParserParam{
        saveFileAt?: string
    }

    interface FileData extends FileDataBase{
        Upload(filename?: string, type?: BufferEncoding): void
        SetFolder(uploadFolder: string): void
    }

    interface CollectionDb extends Collection{
        pathBase: string
        refresh(): void
        insertOne(data: ObjAny): void
        findOne(query: {[query: string]: any}): any
    }

    interface Database extends DataBase{
        createCollection(name: string): CollectionDb
    }

    interface LocalData{
        Upload: {
            File:  {
                (file: File & {saveAt?: string}): FileData,
                new (file: File & {saveAt?: string}): FileData,
            },
            CopyBase64: (base64Url: string, filename?: string, uploadFolder?: string) => FileData | null,
            saveFile: (folder: string, filename: string, data: string | Buffer, type?: BufferEncoding) => void
            newFolder: (path: string, cb?: (err: boolean, local: string) => void) => void,
            ReadFile: (path: string) => string,
            ExistFolder: (path: string, callback: (err: boolean, path: string) => void) => void
        },
        Database: {
            (name: string, path?: string): Database,
            new (name: string, path?: string): Database
        },
        CollectionDb: {
            (name: string, databasePath: string): CollectionDb,
            new (name: string, databasePath: string): CollectionDb,
        },
        BodyParser: ({saveFileAt}: BodyParserParam) => any,
        setTempPath: (path: string) => void
    }
}