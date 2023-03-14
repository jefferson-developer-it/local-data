"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = exports.toObject = void 0;
function toObject(json) {
    try {
        return JSON.parse(json);
    }
    catch (error) {
        try {
            return parseQuery(json);
        }
        catch (error) {
            return {};
        }
    }
}
exports.toObject = toObject;
function parseQuery(query) {
    const result = {};
    for (const data of query.replace("?", "").split("&")) {
        const [name, val] = data.split("=");
        result[name] = val;
    }
    return result;
}
exports.parseQuery = parseQuery;
