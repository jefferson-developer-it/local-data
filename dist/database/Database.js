"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Read_1 = require("../upload/Read");
const SaveAt_1 = require("../upload/SaveAt");
const Collection_1 = __importDefault(require("./Collection"));
class Database {
    constructor(name, path) {
        this.name = `default`;
        this.path = `${__dirname}/database`;
        this.cols = {};
        this.name = name;
        this.path = path !== null && path !== void 0 ? path : this.path;
        (0, Read_1.ExistFolder)(this.path, (err, local) => {
            if (err) {
                (0, SaveAt_1.newFolder)(local);
            }
            (0, Read_1.ExistFolder)(`${this.path}/${this.name}`, (err, path_file) => {
                if (err) {
                    (0, SaveAt_1.newFolder)(path_file);
                    return;
                }
            });
        });
    }
    createCollection(name) {
        const collection = new Collection_1.default(name, `${this.path}/${this.name}`);
        this.cols[name] = collection;
        return collection;
    }
}
exports.default = Database;
