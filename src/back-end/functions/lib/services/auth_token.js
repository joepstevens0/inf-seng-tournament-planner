"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.authenticateAdminToken = exports.authenticateToken = void 0;
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
async function authenticateToken(userId) {
    try {
        // Fetch the token for this user
        const tokenObjects = [];
        await db.collection('tokens').doc(userId).get().then((doc) => {
            tokenObjects.push(doc.data());
        });
        let accessToken = null;
        if (tokenObjects.length != 0)
            accessToken = tokenObjects[0].accessToken;
        if (accessToken == null || accessToken == undefined)
            return false;
        // Try to verify
        let authorized = false;
        // Check if the token is (still) valid
        await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
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
            if (!tokenWasRefreshed)
                return false;
            // Else we try again with the refreshed access token
            return await authenticateToken(userId);
        }
        return authorized;
    }
    catch (error) {
        console.log(`Error in authenticateToken: ${error}`);
        return false;
    }
}
exports.authenticateToken = authenticateToken;
/**
 * Function which checks if a user is authorized and is an admin by checking the access token belonging to this
 * user and query the user from the database
 * @param adminUserId The user of which we want to check if they're authorized and a admin user
 * @returns {boolean} true if the user is authorized and admin, otherwise false
 */
async function authenticateAdminToken(adminUserId) {
    // authenticate user
    const correctToken = await authenticateToken(adminUserId);
    if (!correctToken)
        return correctToken;
    const userref = db.collection("users").doc(adminUserId);
    const userDoc = await userref.get();
    return userDoc.data().isAdmin;
}
exports.authenticateAdminToken = authenticateAdminToken;
/**
 * Attempts to refresh the access token of a user, given their ID.
 * @param userId {string} ID of the user whose access token needs to be refreshed
 * @returns {boolean} returns true if token was successfully refreshed, otherwise false.
 */
async function refreshToken(userId) {
    try {
        // Fetch the refresh token for this user
        const tokenObjects = [];
        await db.collection('tokens').doc(userId).get().then((doc) => {
            tokenObjects.push(doc.data());
        });
        let refreshToken = null;
        if (tokenObjects.length != 0)
            refreshToken = tokenObjects[0].refreshToken;
        if (refreshToken == null || refreshToken == undefined)
            return false;
        let tokenRefreshed = false;
        // Else we see if the refreshToken is indeed correct (if JWT generated it)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if (err)
                return false;
            tokenRefreshed = true;
            const accessToken = generateAccessToken({ id: userId });
            // REFRESH THE ACCESS TOKEN IN THE DATABASE
            db.collection('tokens').doc(userId).update({
                accessToken: accessToken
            });
            return true;
        });
        return tokenRefreshed;
    }
    catch (error) {
        console.log(`Error in refreshToken: ${error}`);
        return false;
    }
}
/**
 * Function that generates a JWT access token.
 * @param user : The object that contains a user id to create a unique access token
 * @returns {string} A unique JWT access token which expires in 15m after creation.
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=auth_token.js.map