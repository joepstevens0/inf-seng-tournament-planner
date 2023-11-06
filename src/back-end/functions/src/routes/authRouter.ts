import { Request, Response } from 'express';
import { firestore } from 'firebase-admin';
import { authenticateToken } from '../services/authToken';
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = admin.firestore();
/**
 * @author jentevandersanden
 */

/**
 * --------------------------------------
 * 			AUTHORIZATION ROUTES
 * --------------------------------------
 */

/**
 * Logs in user + initializes the authentication tokens (JWT) in the database for the current session
 */
router.post('/login', async (req: Request, res: Response) => {
	// AUTHENTICATION
	let userMatches: Array<any> = [];
	try {
		// Check if there's an existing user with this email
		await db
			.collection('users')
			.where('email', '==', req.body.email)
			.get()
			.then((querySnapshot: firestore.QuerySnapshot) => {
				querySnapshot.forEach((doc) => {
					userMatches.push(doc.data());
				});
			});
	} catch (error) {
		console.error('Error while fetching user in login endpoint, returning...');
		return res.status(500).send({ message: 'Error while fetching user in login endpoint, returning...' });
	}
	// We found no user with this email
	if (userMatches.length != 1) {
		// Send 401 (Unauthorized)
		return res.status(400).send({ message: 'Cannot find a user with this email!' });
	} else {
		let userObject = userMatches[0];

		// banned users can't log in
		if (userObject.isBanned){
			return res.status(403).send({message: "User is banned and can't log in"});
		}
		try {
			// Compare the given form password with the one of the user in the db
			if (await bcrypt.compare(req.body.password, userObject.password)) {
				// Logged in !
				await initAuthorizeUser(userObject);
				res.status(200).send({ user: userObject, message: 'Successfully logged in!' });
			} else {
				console.debug('Password wrong');
				return res.status(400).send({ message: 'Password was incorrect!' });
			}
		} catch (error) {
			console.error('Error while decrypting password in login endpoint, returning...');
			return res.status(500).send({ message: 'Error while decrypting password in login endpoint' });
		}
	}
	return;
});

/**
 * Deletes the token document of the user, 
 * After logout, there can't be taken any actions from his acccount without first logging back in and creating new tokens
 */
router.delete('/logout', async (req: Request, res: Response) => {
	(async () => {
		const userId = req.body.userId;
		try {
			await db.collection('tokens').doc(userId).delete();
			return res.status(200).send({ message: 'User logged out.' });
		} catch (error) {
			return res.status(500).send();
		}
	})();
});

/**
 * Grants authorization to a user by creating access and refresh tokens for a certain user
 * and inserting them into the database, given a userObject.
 * @param userObject : the Object that represents the user.
 * @pre : The attribute `id` on `userObject` can't be null or none.
 * @returns void
 */
async function initAuthorizeUser(userObject: any) {
	// AUTHORIZATION
	const id = userObject.id;
	const user = { id: id };

	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	let tokenObject = { accessToken: accessToken, refreshToken: refreshToken };
	await db.collection('tokens').doc('/' + user.id + '/').set(tokenObject).then(() => {
		console.debug('Initial user JWT tokens saved in database!');
	});
	return;
}

/**
 * Function that generates a JWT access token.
 * @param user : The object that contains a user id to create a unique access token
 * @returns {string} A unique JWT access token which expires in 15m after creation.
 */
function generateAccessToken(user: Object) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

/**
 * Checks if the given user is logged in and gets this user
 * @returns {string} Gives back the logged in user
 */
router.post('/getUser', async (req: Request, res: Response) => {
	(async () => {
		try {
			// AUTHENTICATION
			const correctToken = await authenticateToken(req.body.userId);
			if (correctToken) {
				let userDoc = await db.collection('users').doc(req.body.userId).get();
				return res.status(200).send(userDoc.data());
			} else {
				return res.status(401).send();
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

module.exports = router;
