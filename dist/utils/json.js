"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = exports.toObject = void 0;
/**
 * Converts a JSON string into a JavaScript object or parses a query string into an object.
 * @param {string} json - The JSON string or query string to convert to an object.
 * @returns {ObjAny} A JavaScript object representing the given JSON string or query string. Returns an empty object if it cannot be parsed.
 *
 * @example
 * const obj1 = toObject('{"name": "John", "age": 30}');
 * console.log(obj1); // { name: 'John', age: 30 }
 *
 * const obj2 = toObject('?name=John&age=30');
 * console.log(obj2); // { name: 'John', age: '30' }
 *
 * const obj3 = toObject('name=John&age=30');
 * console.log(obj3); // { name: 'John', age: '30' }
 */
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
/**
* Parses a query string into a JavaScript object.
* @param {string} query - The query string to parse.
* @returns {ObjAny} A JavaScript object representing the given query string.
*
* @example
* const obj = parseQuery('?name=John&age=30');
* console.log(obj); // { name: 'John', age: '30' }
*/
function parseQuery(query) {
    const result = {};
    for (const data of query.replace("?", "").split("&")) {
        const [name, val] = data.split("=");
        result[name] = val;
    }
    return result;
}
exports.parseQuery = parseQuery;
