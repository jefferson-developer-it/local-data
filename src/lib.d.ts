
interface FileDataBase{
    type: string | null
    size: number
    filenameOriginal: string | null
    uploadFolder: string | undefined
    data: string | Buffer
}

interface FileData extends FileDataBase{
    Upload(filename?: string, type?: BufferEncoding): string
    SetFolder(uploadFolder: string): void
}

declare namespace Express {
    export interface Request {
      files?: {
        [fieldName: string]: FileData
      }
    }
  }