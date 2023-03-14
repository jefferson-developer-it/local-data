"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTempPath = exports.temporaryPath = void 0;
const os_1 = __importDefault(require("os"));
exports.temporaryPath = os_1.default.tmpdir();
function setTempPath(path) {
    exports.temporaryPath = path;
}
exports.setTempPath = setTempPath;
