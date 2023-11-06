import { Request, Response } from 'express';
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();

const db = admin.firestore();

/**
 * --------------------------------------
 * 			    TEAM ROUTES
 * --------------------------------------
 */


// GET TEAM BY ID
router.get('/read/:id', (req: Request, res: Response) => {
	(async () => {
		try {
			let teamDoc = await db.collection('teams').doc(req.params.id).get();
			return res.status(200).send(JSON.stringify(teamDoc.data()));
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// GET TEAMS FOR USER
router.get('/readByUser/:userId', async (req: Request, res : Response) =>{
	try{
		const teamRef = db.collection('teams').where("playerIds", "array-contains", req.params.userId);

		const teamDoc = await teamRef.get();
		
		return res.status(200).send(teamDoc.docs.map((doc :any) => doc.data()));
	}catch(error){
		console.error(error);
		return res.status(500).send(error);
	}
})

module.exports = router;
