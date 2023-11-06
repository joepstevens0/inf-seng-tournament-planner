import { Request, Response } from 'express';
import { authenticateToken } from '../services/authToken';
import { handleNotification } from '../services/notificationHelper';
const express = require('express');
const admin = require('firebase-admin');
let router = express.Router();
import { generateUniqueID } from '../services/userIdGeneration';

const db = admin.firestore();

/**
 * --------------------------------------
 * 			    LOBBY ROUTES
 * --------------------------------------
 */

// GET LOBBY BY ID
router.get('/read/:id', (req: Request, res: Response) => {
	(async () => {
		try {
			let lobbyDoc = await db.collection('lobbies').doc(req.params.id).get();
			return res.status(200).send(lobbyDoc.data());
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// GET ALL LOBBIES
router.get('/read', (req: Request, res: Response) => {
	(async () => {
		try {
			let lobbyDocs = await db.collection('lobbies').get();
			return res.status(200).send(lobbyDocs.docs.map((doc: any) => doc.data()));
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// GET ALL LOBBIES FROM GAMES
router.get('/readbygame/:gameName', (req: Request, res: Response) => {
	(async () => {
		try {
			let lobbyDocs = await db.collection('lobbies').where('gameName', '==', req.params.gameName).get();
			return res.status(200).send(lobbyDocs.docs.map((doc: any) => doc.data()));
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// CREATE LOBBY
router.post('/create', (req: Request, res: Response) => {
	(async () => {
		try {
			let lobbyData = req.body;

			const correctToken: boolean = await authenticateToken(lobbyData.ownerId);

			if (!correctToken) return res.status(401).send('Unauthorized');

			// create a unique ID
			lobbyData.id = await generateUniqueID();

			// create new chat for lobby
			const chatid = await generateUniqueID();
			lobbyData.chatId = chatid;

			await db.runTransaction(async (transaction: any) => {
				// create chat
				const chatDoc = db.collection('chats').doc(chatid);
				await transaction.set(chatDoc, {
					users: [ lobbyData.ownerId ],
					usage: 'lobby'
				});
				console.debug('Chat Successfully Created!');

				// create lobby
				const lobbyDoc = db.collection('lobbies').doc('/' + lobbyData.id + '/');
				await transaction.set(lobbyDoc, lobbyData);
				console.debug('Lobby Successfully Created!');
			});

			return res.status(200).send(lobbyData.id);
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// ADD PLAYER TO LOBBY
router.put('/join', (req: Request, res: Response) => {
	(async () => {
		try {
			let joinData = req.body;

			const correctToken: boolean = await authenticateToken(joinData.playerId);
			if (!correctToken) return res.status(401).send('Unauthorized');

			// insert into firestore
			await db.runTransaction(async (transaction: any) => {
				// get lobby info
				const lobbyRef = db.collection('lobbies').doc(joinData.lobbyId);
				const lobbyDoc = await transaction.get(lobbyRef);
				const lobbyData = lobbyDoc.data();

				if (lobbyData.playerIds.length >= lobbyData.maxPlayers){
					return res.status(403).send();
				}

				// insert player into the lobby
				await transaction.update(lobbyRef, {
					playerIds: admin.firestore.FieldValue.arrayUnion(joinData.playerId)
				});
				await handleNotification('A player joined your lobby!', 'A new player just joined your lobby, go check it out!', '/lobby/' + lobbyData.id, [lobbyData.ownerId]);

				// insert player into the chat
				const chatRef = db.collection('chats').doc(lobbyData.chatId);
				await transaction.update(chatRef, {
					users: admin.firestore.FieldValue.arrayUnion(joinData.playerId)
				});

				console.debug('Player Successfully joined!');
				return res.status(200).send(lobbyDoc.data());
			});
			return res.status(200).send();
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

// REMOVE PLAYER FROM LOBBY
router.delete('/removeLobbyPlayer', async (req: Request, res: Response) => {
	try {
		const requestinfo = req.body;
		const lobbyId = requestinfo.lobbyId;
		const ownerId = requestinfo.ownerId;
		const playerId = requestinfo.playerId;

		// authenticate user
		const correctToken: boolean = await authenticateToken(ownerId);
		if (!correctToken) return res.status(401).send('Unauthorized');

		const lobbyRef = db.collection('lobbies').doc(lobbyId);

		// update playerlist
		await lobbyRef.update({
			playerIds: admin.firestore.FieldValue.arrayRemove(playerId)
		});

		await handleNotification('You have been removed from a lobby!', 'The leader of the lobby has removed you from his lobby, you can go and finc a new one!', '/teamfinder', [playerId]);

		return res.status(200).send();
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
});

// TRANSFORM A LOBBY INTO A TEAM
router.post('/toteam', (req: Request, res: Response) => {
	(async () => {
		try {
			console.debug('Transforming lobby into a team');

			const playerId = req.body.playerId;
			const lobbyId = req.body.lobbyId;
			const teamName = req.body.teamName;

			// authenticate user
			const correctToken: boolean = await authenticateToken(playerId);
			if (!correctToken) return res.status(401).send('Unauthorized');

			// get lobby from database
			const lobbyRef = await db.collection('lobbies').doc(lobbyId);
			const lobby = await lobbyRef.get();
			const lobbyData = lobby.data();

			// check if user is lobby owner
			if (lobbyData.ownerId != playerId) return res.status(401).send('Unauthorized');

			// check if lobby is full
			if (lobbyData.playerIds.length < lobbyData.maxPlayers) return res.status(401).send('Unauthorized');

			// create team id
			const teamId = await generateUniqueID();

			// get tournament
			const tournamentRef = db.collection('tournaments').doc(lobbyData.tournamentId);
			const tournament = await tournamentRef.get();
			const tournamentData = tournament.data();

			// check if tournament is full
			if (tournamentData.teams.length >= tournamentData.amountTeams) return res.status(401).send('Unauthorized');

			// check if tournament has begun
			if (tournamentData.hasBegun) return res.status(401).send('Unauthorized');

			// start transaction
			await db.runTransaction(async (transaction: any) => {
				// insert team into tournament
				await transaction.update(tournamentRef, { teams: admin.firestore.FieldValue.arrayUnion(teamId) });
				console.debug('Team successfully inserted into tournament');

				// delete lobby
				await deleteLobby(lobbyData, transaction);

				// insert team into database
				const teamData = {
					name: teamName,
					playerIds: lobbyData.playerIds,
					id: teamId,
					teamLeader: lobbyData.ownerId,
					tournamentId: lobbyData.tournamentId
				};
				const teamRef = db.collection('teams').doc('/' + teamId + '/');
				await transaction.set(teamRef, teamData);
				console.debug('Team successfully created');

			});

			await handleNotification(
				"Team created", 
				"The lobby '" + lobbyData.name + "' is now a team with name '" + teamName + "'", 
				"/tournament/" + lobbyData.tournamentId,
				lobbyData.playerIds
			);

			return res.status(200).send();
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	})();
});

/**
 * deletes a lobby from the database
 * @param lobby: the lobby deleting
 * @param transaction: transaction object
 * @post lobby is deleted from the database
 * @post chat of the lobby is deleted from the databaase 
 */
async function deleteLobby(lobby: any, transaction: any) {
	const lobbyRef = db.collection('lobbies').doc(lobby.id);
	await transaction.delete(lobbyRef);
	console.debug('Lobby successfully deleted');

	const chatRef = await db.collection('chats').doc(lobby.chatId);
	await transaction.delete(chatRef);
	console.debug('Lobby chat succesfully deleted');
}

module.exports = router;
