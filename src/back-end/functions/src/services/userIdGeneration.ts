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
export async function generateUniqueID() {
	return uniqid().toString();
}
