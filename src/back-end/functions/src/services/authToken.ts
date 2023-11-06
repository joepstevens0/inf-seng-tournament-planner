import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
const admin = require('firebase-admin');
const db = admin.firestore();
const jwt = require('jsonwebtoken');
/**
 * @author jentevandersanden
 */

/**
 * Function which checks if a user is authorized by checking the access token belonging to this
 * user. 
 * @param userId The user of which we want to check if they're authorized
 * @returns {boolean} true if the user is authorized, otherwise false
 */
export async function authenticateToken(userId: string): Promise<boolean> {
	try {
		// Fetch the token for this user
		const tokenObjects: Array<any> = [];
		await db.collection('tokens').doc(userId).get().then((doc: DocumentSnapshot) => {
			tokenObjects.push(doc.data());
		});
		let accessToken = null;
		if (tokenObjects.length != 0) accessToken = tokenObjects[0].accessToken;
		if (accessToken == null || accessToken == undefined) return false;

		// Try to verify
		let authorized: boolean = false;
		// Check if the token is (still) valid
		await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err: Error) => {
			if (err) {
				// No access
				return false;
			}
			// Access granted
			authorized = true;
			return true;
		});

		if (!authorized) {
			const tokenWasRefreshed = refreshToken(userId);
			if (!tokenWasRefreshed) return false;

			// Else we try again with the refreshed access token
			return await authenticateToken(userId);
		}
		return authorized;
	} catch (error) {
		console.log(`Error in authenticateToken: ${error}`);
		return false;
	}
}

/**
 * Function which checks if a user is authorized and is an admin by checking the access token belonging to this
 * user and query the user from the database
 * @param adminUserId The user of which we want to check if they're authorized and a admin user
 * @returns {boolean} true if the user is authorized and admin, otherwise false
 */
export async function authenticateAdminToken(adminUserId:string): Promise<boolean> {
	// authenticate user
	const correctToken: boolean = await authenticateToken(adminUserId);
	if (!correctToken) return correctToken;

	const userRef = db.collection("users").doc(adminUserId);
	const userDoc = await userRef.get();
	return userDoc.data().isAdmin;
}

/**
 * Attempts to refresh the access token of a user, given their ID.
 * @param userId {string} ID of the user whose access token needs to be refreshed
 * @returns {boolean} returns true if token was successfully refreshed, otherwise false.
 */
async function refreshToken(userId: string) {
	try {
		// Fetch the refresh token for this user
		const tokenObjects: Array<any> = [];
		await db.collection('tokens').doc(userId).get().then((doc: DocumentSnapshot) => {
			tokenObjects.push(doc.data());
		});
		let refreshToken = null;
		if (tokenObjects.length != 0) refreshToken = tokenObjects[0].refreshToken;
		if (refreshToken == null || refreshToken == undefined) return false;

		let tokenRefreshed: boolean = false;
		// Else we see if the refreshToken is indeed correct (if JWT generated it)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: Error) => {
			if (err) return false;
			tokenRefreshed = true;
			const accessToken = generateAccessToken({ id: userId });
			// REFRESH THE ACCESS TOKEN IN THE DATABASE
			db.collection('tokens').doc(userId).update({
				accessToken: accessToken
			});
			return true;
		});
		return tokenRefreshed;
	} catch (error) {
		console.log(`Error in refreshToken: ${error}`);
		return false;
	}
}

/**
 * Function that generates a JWT access token.
 * @param user : The object that contains a user id to create a unique access token
 * @returns {string} A unique JWT access token which expires in 15m after creation.
 */
export function generateAccessToken(user: Object) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
