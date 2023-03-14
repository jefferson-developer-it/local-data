import FileData, { CopyBase64 } from "./upload/File";
import { newFolder, saveFile } from "./upload/SaveAt";
import ReadFile, {ExistFolder} from "./upload/Read";
import Database from "./database/Database";
import CollectionDb from "./database/Collection";
import { BodyParser } from "./utils/bodyParser";
import { setTempPath } from "./utils/temp";

const Upload = {
    File: FileData,
    CopyBase64,
    saveFile,
    newFolder,
    ExistFolder,
    ReadFile,
}


export default {
    Upload,
    Database,
    CollectionDb,
    BodyParser,
    setTempPath
}