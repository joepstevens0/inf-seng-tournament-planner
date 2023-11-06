import { Request, Response } from 'express';
import { authenticateToken } from '../services/authToken';
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
import { generateUniqueID } from '../services/userIdGeneration';

const db = admin.firestore();

/**
 * --------------------------------------
 * 			    POST ROUTES
 * --------------------------------------
 */

 // CREATE POST
 router.post('/create', async (req: Request, res: Response) => {
	try {
		let postData = req.body;

		const correctToken: boolean = await authenticateToken(postData.userId); 
		if (!correctToken)
			return res.status(401).send('Unauthorized');

		postData.postId = await generateUniqueID();
		postData.postDate = Date.now();

		// insert into firestore
		await db.collection('posts').doc(postData.postId).set(postData).then(() => {
			console.debug('Post Successfully Created!');
		});
		return res.status(200).send();
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
});

// READ POST
router.get('/readByUser/:userId', async (req: Request, res: Response) => {
	try {
		const postRef =  db.collection('posts').where("userId", "==", req.params.userId);
		const postDocs = await postRef.get();

		return res.status(200).send(postDocs.docs.map((doc :any) => doc.data()));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
});

module.exports = router;