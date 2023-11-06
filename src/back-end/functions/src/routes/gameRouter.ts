import { Request, Response } from 'express';
import { authenticateAdminToken } from '../services/authToken';
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();

const db = admin.firestore();

/**
 * --------------------------------------
 * 			    GAME ROUTES
 * --------------------------------------
 */


// GET GAME BY NAME
router.get('/read/:name', (req: Request, res: Response) => {
	(async () => {
		try {
			let gameDoc = await db.collection('games').doc(req.params.name).get();
			return res.status(200).send(gameDoc.data());
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// GET ALL GAMES
router.get('/read', (req: Request, res: Response) => {
	(async () => {
		try {
			let gameDocs = await db.collection('games').get();
			return res.status(200).send(gameDocs.docs.map((doc :any) => doc.data()));
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// CREATE GAME
router.post('/create', (req: Request, res: Response) => {
	(async () => {
		try {
			const correctToken: boolean = await authenticateAdminToken(req.body.userId); 
			if (!correctToken)
				return res.status(401).send('Unauthorized');

			const gameData = req.body.game;

			// insert into firestore
			await db.collection('games').doc('/' + gameData.name + '/').set(gameData).then(() => {
				console.debug('Game Successfully Created!');
			});
			return res.status(200).send();
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

module.exports = router;
