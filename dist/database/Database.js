"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Read_1 = require("../upload/Read");
const SaveAt_1 = require("../upload/SaveAt");
const Collection_1 = __importDefault(require("./Collection"));
/**
 * Class representing a database.
 * @implements {DataBase}
 */
class Database {
    /**
     * Creates a new instance of the database.
     *
     * @param {string} name - The name of the database.
     * @param {string} [path] - The optional path to the database. If not provided, it will use the default value set in the `path` property.
     */
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
    /**
     * Creates a new collection in the database.
     *
     * @template typeData
     * @param {string} name - The name of the collection to be created.
     *
     * @returns {CollectionDb<typeData>} The new collection created.
     * @example
     * const db = new Database('myDatabase');
     * const usersCollection = db.createCollection('users');
    */
    createCollection(name) {
        const collection = new Collection_1.default(name, `${this.path}/${this.name}`);
        this.cols[name] = collection;
        return collection;
    }
}
exports.default = Database;
