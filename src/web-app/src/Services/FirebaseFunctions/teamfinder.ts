import { environment } from '../../Environments/environments';
import { User, Lobby, ChatMessage } from '../../typedefs/firebaseTypedefs.js';
import Cookies from 'js-cookie';
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * --------------------------------------
 * 				TEAMFINDER
 * --------------------------------------
 */
/**
 * Fetches and returns a lobby JSON object from the database based on the id given.
 * @param id : The lobby id of the lobby to retrieve
 * @returns `{status:number, body:Lobby }` Returns status 200 on success, together with an object containing the Lobby data, or 500
 * 					   					    in case of an internal server error.
 */

export async function getLobbyFromId(id: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readLobbyId + id);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getLobby': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Fetches all lobby objects for a game
 * @param gameName : The game name of the game
 * @returns `{status:number, body:Lobby[] }` Returns status 200 on success, together with an object containing a list of Lobbies, or 500
 * 					   					    in case of an internal server error.
 */

export async function getAllLobbiesForGame(gameName: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readLobbyGame + gameName);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getAllLobbiesForGame': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Fetches and returns a lobby list containing all lobby JSON objects from the database.
 * @returns `{status:number, body:Lobby[] }` Returns status 200 on success, together with an object containing a list of Lobbies, or 500
 * 					   					    in case of an internal server error.
 */

export async function getAllLobbies(): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readAllLobbies);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getLobby': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Inserts a new lobby into the database, given a JSON Lobby object.
 * @param lobbyObject : JSON object that contains all the information about a lobby
 * @returns chatId or null if failed to create
 * @throws Error
 */

export async function createNewLobby(lobbyObject: Lobby): Promise<string | null> {
	try {
		// set owner id and add owner to playerlist
		const userId = Cookies.get('userId');
		if (userId === undefined)
			throw new Error('Failed to get userid , user not logged in');

		lobbyObject.playerIds = [userId];
		lobbyObject.ownerId = userId;

		// Make POST request, await the response
		const res = await fetch(environment.createLobby, {
			method: 'POST',
			body: JSON.stringify(lobbyObject),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.status === 200) {
			console.log(`Successfully created new Lobby!`);
			console.log(res);
			const text = await res.text();
			return text;
		} else {
			console.log('Failed to create a new lobby, error code: ' + res.status);
		}
	} catch (error) {
		console.log(`Error in Firebase function 'createNewLobby': ${error}`);
	}
	return null;
}
/**
 * Update a lobby in the database
 * @param lobbyObject updated lobby
 * @post the lobby in the database with the same id as lobby is updated
 */

export async function updateLobby(lobbyObject: Lobby): Promise<FireBaseResult> {
	return { status: 501, body: null };
}
/**
 * Insert the current user into the playerlist of a lobby
 * @param lobbyObject : JSON object that contains all the information about a lobby
 * @returns
 */

export async function joinLobby(lobbyObject: Lobby): Promise<FireBaseResult> {
	try {
		// set owner id and add owner to playerlist
		const userId = Cookies.get('userId');
		if (userId === undefined)
			throw new Error('Failed to get userid , user not logged in');

		// Make PUT request, await the response
		const res = await fetch(environment.joinLobby, {
			method: 'PUT',
			body: JSON.stringify({
				playerId: userId,
				lobbyId: lobbyObject.id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: res.status, body: null };
	} catch (error) {
		console.log(`Error in Firebase function 'joinLobby': ${error}`);
	}
	return { status: 500, body: null };
}
/**
 * Transform a lobby to a team in the database
 * @param lobbyObject transforming into a team
 * @param teamName of the new team
 * @post Lobby object is deleted from the database and a team is created with teamName and players from the lobby
 */

export async function lobbyToTeam(lobbyObject: Lobby, teamName: string): Promise<FireBaseResult> {
	try {
		// set owner id and add owner to playerlist
		const userId = Cookies.get('userId');
		if (userId === undefined)
			throw new Error('Failed to get userid , user not logged in');

		// Make POST request, await the response
		const res = await fetch(environment.lobbyToTeam, {
			method: 'POST',
			body: JSON.stringify({
				playerId: userId,
				lobbyId: lobbyObject.id,
				teamName: teamName
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return { status: res.status, body: null };
	} catch (error) {
		console.log(`Error in Firebase function 'lobbyToTeam': ${error}`);
	}
	return { status: 500, body: null };
}
/**
 * Removes a player from a lobby in the database
 * @param lobby removing player from
 * @param player removing from lobby
 * @pre the lobby owner is logged in
 * @post <player> is removed from <lobby> in the database
 */

export async function removePlayerFromLobby(lobby: Lobby, player: User): Promise<FireBaseResult> {
	try {
		// create DELETE request, await response
		const response = await fetch(environment.removeLobbyPlayer, {
			method: 'DELETE',
			body: JSON.stringify({ lobbyId: lobby.id, playerId: player.id, ownerId: lobby.ownerId }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: response.status, body: null };
	} catch (error) {
		console.error("Error in Firebase function 'removePlayerFromLobby':", error);
	}
	return { status: 500, body: null };
}
/**
 * Insert a new chat message into the database of a chat
 * @param messageObject inserting into the database
 * @param chatId of the chat inserting to
 * @post messageObject is inserted into the database of the chat with id chatId
 */

export async function createNewMessage(messageObject: ChatMessage, chatId: string): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const createResponse = await fetch(environment.createMessage + chatId, {
			method: 'POST',
			body: JSON.stringify(messageObject),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log(`Successfully created new message!`);
		return { status: createResponse.status, body: null };
	} catch (error) {
		console.log(`Error in Firebase function 'createNewMessage': ${error}`);
	}
	return { status: 500, body: null };
}
/**
 * Get all messages from a chat by id
 * @param chatId of the chat
 * @returns {ChatMessage[]} a list of ChatMessage objects
 */

export async function getMessages(chatId: string): Promise<{ status: number; body: ChatMessage[]; }> {
	try {
		// Fetch the messages
		const output = await fetch(environment.readMessages + chatId + '/' + Cookies.get('userId'));
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getMessages': ${error}`);
	}
	return { status: 500, body: [] };
}
/**
 * Fetch the id of a chat between the logged in user and anonther person
 * @param userId The id of the user chatting to
 * @returns a JSON object with status containing the request status (200 if ok) and body containing the chat id
 */

export async function getChatP2PId(userId: string): Promise<{ status: number; body: string; }> {
	try {
		// Fetch the id
		const output = await fetch(environment.getP2PId + Cookies.get('userId') + '/' + userId);
		// Convert to JSON
		const outputJSON = await output.text();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.error(`Error in Firebase function 'getChatP2PId': ${error}`);
	}
	return { status: 500, body: '' };
}
