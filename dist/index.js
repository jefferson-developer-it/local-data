"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = __importStar(require("./upload/File"));
const SaveAt_1 = require("./upload/SaveAt");
const Read_1 = __importStar(require("./upload/Read"));
const Database_1 = __importDefault(require("./database/Database"));
const Collection_1 = __importDefault(require("./database/Collection"));
const bodyParser_1 = require("./utils/bodyParser");
const temp_1 = require("./utils/temp");
const Upload = {
    File: File_1.default,
    CopyBase64: File_1.CopyBase64,
    saveFile: SaveAt_1.saveFile,
    newFolder: SaveAt_1.newFolder,
    ExistFolder: Read_1.ExistFolder,
    ReadFile: Read_1.default,
};
exports.default = {
    Upload,
    Database: Database_1.default,
    CollectionDb: Collection_1.default,
    BodyParser: bodyParser_1.BodyParser,
    setTempPath: temp_1.setTempPath
};
