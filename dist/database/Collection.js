"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Read_1 = require("../upload/Read");
const SaveAt_1 = require("../upload/SaveAt");
const json_1 = require("../utils/json");
class CollectionDb {
    constructor(name, databasePath) {
        this.name = "";
        this.path = "";
        this.pathBase = "";
        this.data = [];
        this.name = name;
        this.path = `${databasePath}/col-${name}.json`;
        this.pathBase = databasePath;
        (0, Read_1.ExistFolder)(this.path, (err, folder) => {
            var _a;
            if (err) {
                (0, SaveAt_1.saveFile)(databasePath, `col-${this.name}.json`, JSON.stringify({
                    info: { name: this.name, path: this.path },
                    data: (_a = this.data) !== null && _a !== void 0 ? _a : []
                }, null, 3), "utf8");
                return;
            }
            this.refresh();
        });
    }
    refresh() {
        const data = (0, json_1.toObject)((0, fs_1.readFileSync)(this.path, "utf8"));
        this.data = data.data;
    }
    insertOne(data) {
        this.data.push(data);
        (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify({
            info: { name: this.name, path: this.path },
            data: this.data
        }, null, 3), "utf8");
        this.refresh();
    }
    findOne(query) {
        let data = null;
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                data = this.data.find(item => item[key] === query[key]);
                if (data)
                    break;
            }
        }
        return data !== null && data !== void 0 ? data : undefined;
    }
}
exports.default = CollectionDb;
