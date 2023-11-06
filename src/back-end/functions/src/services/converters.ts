/**
 * Service file that serves converter functions.
 * @author jentevandersanden
 */

/**
 * Converts a nested array into an array of objects which is compatible with 
 * Google Firestore.
 * @param nestedArray : A nested array of any depth
 * @returns `Array<Object>` A nested array in firestore format
 */
export function convertNestedArrayToFirestoreObject(nestedArray: Array<Array<any>>) {
	let returnArray: Array<Object> = [];
	// EMPTY ARRAY
	if (nestedArray.length == 0) return returnArray;
	else {
		// In case the elements are not arrays
		if (!Array.isArray(nestedArray[0])) {
			nestedArray.forEach((element) => {
				returnArray.push(element);
			});
			return returnArray;
		} else {
			// Nested array
			for (let i = 0; i < nestedArray.length; i++) {
				const object = { data: convertNestedArrayToFirestoreObject(nestedArray[i]) };
				console.log(object);
				returnArray.push(object);
			}
			console.log(returnArray);
			return returnArray;
		}
	}
}

/**
 * Converts a nested array in Google Firestore format
 *  into a regular nested array
 * @param firestoreArray : A nested array in Firestore format (array of nested objects)
 * @returns `Array<Array<Array<any>>>` 
 */
export function convertFirestoreObjectToNestedArray(firestoreArray: Array<any>) {
	let returnArray: Array<Array<Array<any>>> = [];

	if (firestoreArray.length == 0) return returnArray;
	else {
		if (!firestoreArray[0].data || firestoreArray[0] === null) {
			firestoreArray.forEach((element) => {
				returnArray.push(element);
			});
			return returnArray;
		} else {
			// Nested Objects
			for (let i = 0; i < firestoreArray.length; i++) {
				const resultarray = convertFirestoreObjectToNestedArray(firestoreArray[i].data);
				returnArray.push(resultarray);
			}
			return returnArray;
		}
	}
}
