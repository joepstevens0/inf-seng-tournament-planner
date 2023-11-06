"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueID = void 0;
var uniqid = require('uniqid');
/**
 * @author jentevandersanden
 * This file serves a method to generate unique ID's using
 * a randomized function. These ID's can then be used to make
 * new database insertions.
 */
/**
  * Function which uses the uniqid library to generate a universally unique ID.
  * @returns `string` Universally unique identifier string
  */
async function generateUniqueID() {
    return uniqid().toString();
}
exports.generateUniqueID = generateUniqueID;
//# sourceMappingURL=userIdGeneration.js.map