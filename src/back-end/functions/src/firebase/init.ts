const admin = require('firebase-admin');
const serviceAccount = require('../../firebase_service_account.json');
/**
 * @author jentevandersanden
 * This file contains the initialization method for the Firebase database. It uses the firebase service account key
 * and the URL of our project's database to initialize the connection.
 */

/**
 * Establishes and initializes the Firebase app emulation. 
 * @pre : Express app is running, serviceAccount is initialized as well as FIREBASE_DATABASE_URL
 * @post : The connection with firebase is now established
 */
export function initFirebase() {
	try {
		console.log('Initializing firebase with firebase_service_account.json ...');
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: process.env.FIREBASE_DATABASE_URL
		});
	} catch (error) {
		console.log(`Problem in initFirebase(): ${error}`);
	}
}
