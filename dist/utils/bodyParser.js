"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyParser = void 0;
const formidable_1 = require("formidable");
const File_1 = __importDefault(require("../upload/File"));
const json_1 = require("./json");
function BodyParser({ saveFileAt }) {
    return (req, _, next) => { var _a, req_1, req_1_1; return __awaiter(this, void 0, void 0, function* () {
        var _b, e_1, _c, _d;
        var _e;
        if ((_e = req.headers["content-type"]) === null || _e === void 0 ? void 0 : _e.includes("multipart/form-data")) {
            const form = new formidable_1.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    next(err);
                    return err;
                }
                const filesObj = {};
                for (const fileName of Object.keys(files)) {
                    filesObj[fileName] = new File_1.default(Object.assign(Object.assign({}, files[fileName]), { saveAt: saveFileAt || `${__dirname}/upload` }));
                }
                req.body = Object.assign(Object.assign({}, fields), filesObj);
                next();
            });
        }
        else {
            const buffer = [];
            try {
                for (_a = true, req_1 = __asyncValues(req); req_1_1 = yield req_1.next(), _b = req_1_1.done, !_b;) {
                    _d = req_1_1.value;
                    _a = false;
                    try {
                        const chunk = _d;
                        buffer.push(chunk);
                    }
                    finally {
                        _a = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = req_1.return)) yield _c.call(req_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const bodyBase = (0, json_1.toObject)(Buffer.concat(buffer).toString());
            req.body = bodyBase !== null && bodyBase !== void 0 ? bodyBase : {};
            next();
        }
    }); };
}
exports.BodyParser = BodyParser;
