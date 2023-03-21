"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Read_1 = require("../upload/Read");
const SaveAt_1 = require("../upload/SaveAt");
const json_1 = require("../utils/json");
const uuid_1 = require("uuid");
/**
 * Represents a collection in a database.
 * @template typeData - The type of data stored in the collection. Must extend BaseDataCol. Defaults to any.
 * @implements {Collection}
 */
class CollectionDb {
    /**
     * Creates a new CollectionDb instance.
     *
     * @param {string} name - The name of the collection.
     * @param {string} databasePath - The path to the database folder.
     */
    constructor(name, databasePath) {
        this.name = "";
        this.path = "";
        this.pathBase = "";
        this.data = [];
        this.name = name;
        this.path = `${databasePath}/col-${name}.json`;
        this.pathBase = databasePath;
        (0, Read_1.ExistFolder)(this.path, (err, folder) => {
            if (err) {
                (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify([], null, 3), "utf8");
                return;
            }
        });
    }
    /**
    * Loads data from a JSON file and returns it as an array of objects of type `typeData`.
    * @returns {typeData[]} The data loaded from the file.
    */
    loadData() {
        const data = (0, json_1.toObject)((0, fs_1.readFileSync)(this.path, "utf8"));
        return data;
    }
    /**
    * Deletes the first item from the data that matches the given query object.
    * @param {Object} query - The query object used to find the item to delete.
    * @returns {boolean} True if an item was deleted, false otherwise.
    * @example
    * const db = new Database('myDatabase');
    * const usersCollection = db.createCollection('users');
    * usersCollection.deleteOne({ name: 'John' });
    */
    deleteOne(query) {
        const json_data = this.loadData();
        const index = json_data.findIndex(item => this.validateQuery(item, query, true));
        if (index !== -1) {
            json_data.splice(index, 1);
            (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify([
                ...json_data !== null && json_data !== void 0 ? json_data : []
            ], null, 3), "utf8");
            return true;
        }
        return false;
    }
    /**
    * Inserts a new item into the data.
    * @param {typeData} data - The item to insert into the data.
    * @example
    * const db = new Database('myDatabase');
    * const usersCollection = db.createCollection('users');
    * usersCollection.insertOne({ name: 'John', age: 25 });
    */
    insertOne(data) {
        const json_data = this.loadData();
        json_data.push(Object.assign(Object.assign({}, data), { _id: (0, uuid_1.v4)() }));
        (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify([
            ...json_data !== null && json_data !== void 0 ? json_data : []
        ], null, 3), "utf8");
    }
    /**
    * Inserts multiple new items into the data.
    * @param {typeData[]} data - An array of items to insert into the data.
    * @example
    * const db = new Database('myDatabase');
    * const usersCollection = db.createCollection('users');
    * usersCollection.insertMany([
    *   { name: 'Peter', age: 18 },
    *   { name: 'Mary', age: 26 },
    *   { name: 'Jane', age: 28 }
    * ]);
    */
    insertMany(data) {
        const json_data = this.loadData();
        const newData = data.map(item => (Object.assign(Object.assign({}, item), { _id: (0, uuid_1.v4)() })));
        json_data.push(...newData);
        (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify([
            ...json_data !== null && json_data !== void 0 ? json_data : []
        ], null, 3), "utf8");
    }
    /**
    * Finds and returns the first item from the data that matches the given query object.
    * @param {Object} query - The query object used to find the item.
    * @param {OptionsFind<typeData>} [options] - Optional options for projection and other operations.
    * @returns {typeData | undefined} The found item or undefined if no item was found.
    * @example
    * const db = new Database('myDatabase');
    * const usersCollection = db.createCollection('users');
    * const user = usersCollection.findOne({ name: 'John' });
    */
    findOne(query, options) {
        const json_data = this.loadData();
        let data = json_data.find(item => this.validateQuery(item, query));
        if ((options === null || options === void 0 ? void 0 : options.projection) && data)
            data = this.Projection(data, options.projection);
        if (data) {
            data.save = this.updateOne.bind(this, { _id: data._id }, data);
            data.delete = this.deleteOne.bind(this, { _id: data._id });
        }
        return data !== null && data !== void 0 ? data : undefined;
    }
    /**
    * Finds and returns all items from the data that match the given query object.
    * @param {Object} [query] - The optional query object used to find items. If not provided, all items are returned.
    * @param {OptionsFind<typeData>} [options] - Optional options for skip, limit, projection and other operations.
    * @returns {typeData[]} An array of found items or an empty array if no items were found.
    *
    * @example
    * const db = new Database('myDatabase');
    * const usersCollection = db.createCollection('users');
    * const users = usersCollection.find({ age: 25 });
    */
    find(query, options) {
        const json_data = this.loadData();
        let data = [];
        if (query) {
            data = json_data.filter((item) => this.validateQuery(item, query));
        }
        if (options === null || options === void 0 ? void 0 : options.skip) {
            data = data.slice(Number(options.skip));
        }
        if (options === null || options === void 0 ? void 0 : options.limit) {
            data = data.slice(0, Number(options.limit));
        }
        if (options === null || options === void 0 ? void 0 : options.projection) {
            for (const i in data) {
                data[i] = this.Projection(data[i], options.projection);
                data[i].save = this.updateOne.bind(data, { _id: data[i]._id }, data);
            }
        }
        return data !== null && data !== void 0 ? data : undefined;
    }
    /**
     * Updates the first item from the data that matches the given query object with the given update object.
     * @param {Object} query - The query object used to find the item to update.
     * @param {Object} update - The update object containing the new values for the item.
     * @returns {boolean} True if an item was updated, false otherwise.
     * @example
     * const db = new Database('myDatabase');
     * const usersCollection = db.createCollection('users');
     * usersCollection.updateOne({ name: 'John' }, { age: 30 });
     */
    updateOne(query, update) {
        const json_data = this.loadData();
        const index = json_data.findIndex(item => this.validateQuery(item, query, true));
        if (index < 0)
            return false;
        json_data[index] = Object.assign(Object.assign({}, json_data[index]), update);
        (0, SaveAt_1.saveFile)(this.pathBase, `col-${this.name}.json`, JSON.stringify([
            ...json_data !== null && json_data !== void 0 ? json_data : []
        ], null, 3), "utf8");
        return true;
    }
    /**
     * Validates if an item matches a given query object.
     * @param {ObjAny} item - The item to validate against the query object.
     * @param {QueryDatabase} query - The query object used to validate the item.
     * @param {boolean} [keySame=false] - Optional flag indicating if the item value should be exactly the same as the query value.
     * @returns {boolean} True if the item matches the query object, false otherwise.
     */
    validateQuery(item, query, keySame = false) {
        for (const key in query) {
            const itemValue = item[key];
            const queryValue = query[key];
            if (!item.hasOwnProperty(key))
                return false;
            else if (keySame && itemValue !== queryValue) {
                return false;
            }
            else if (typeof queryValue === "string") {
                if (!itemValue.toString().toLowerCase().includes(queryValue.toString().toLowerCase()) &&
                    !itemValue.toString().includes(queryValue.toString()) &&
                    itemValue.toString() !== queryValue.toString() &&
                    itemValue.toString().toLowerCase() !== queryValue.toString().toLowerCase()) {
                    return false;
                }
            }
            else if (Array.isArray(itemValue) && !itemValue.includes(queryValue)) {
                return false;
            }
            else if (itemValue !== queryValue) {
                return false;
            }
        }
        return true;
    }
    /**
    * Applies a projection to an item and returns a new object with only the projected fields.
    * @param {typeData} data - The item to apply the projection to.
    * @param {ColProjection<typeData>} projection - The projection object indicating which fields to include or exclude.
    * @returns {Object} A new object containing only the projected fields from the original item.
    */
    Projection(data, projection) {
        const keysOfData = Object.keys(data);
        const dataCopy = data;
        const objectReturn = {};
        for (const key of keysOfData) {
            if (projection[key] && typeof projection[key] === "boolean") {
                objectReturn[key] = dataCopy[key];
            }
            else if (typeof projection[key] === "object" && projection[key]) {
                const proj = projection[key];
                if (typeof dataCopy[key] === "object" && Array.isArray(dataCopy[key])) {
                    objectReturn[key] = proj.includes ? (proj.includes && dataCopy[key].indexOf(proj.includes) != -1 ? dataCopy[key] : null) : dataCopy[key];
                    objectReturn[key] = proj.join ? objectReturn[key].join(proj.join) : objectReturn[key];
                    objectReturn[key] = proj.maxLength ? objectReturn[key].slice(0, proj.maxLength) : objectReturn[key];
                }
                else if (typeof dataCopy[key] === "string") {
                    objectReturn[key] = proj.includes ? (proj.includes && dataCopy[key].includes(proj.includes) ? dataCopy[key] : null) : dataCopy[key];
                    objectReturn[key] = proj.split ? objectReturn[key].split(proj.split) : objectReturn[key];
                    objectReturn[key] = proj.maxLength ? objectReturn[key].substr(0, proj.maxLength) : objectReturn[key];
                }
            }
        }
        return objectReturn;
    }
}
exports.default = CollectionDb;
