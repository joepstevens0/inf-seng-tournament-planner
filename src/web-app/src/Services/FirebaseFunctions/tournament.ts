import { environment } from '../../Environments/environments';
import { Tournament } from '../../typedefs/firebaseTypedefs.js';
import Cookies from 'js-cookie';
import { FireBaseResult } from '../../typedefs/FireBaseResult';

/**
 * --------------------------------------
 * 				TOURNAMENT
 * --------------------------------------
 */
/**
 * Fetches and returns a tournament JSON object from the database based on the id given.
 * @param id : The tournament id of the tournament to retrieve
 * @returns `{status:number, body:Object }` Returns status 200 on success, together with an object containing the tournament data, or 500
 * 					   					    in case of an internal server error.
 */

export async function getTournamentFromId(id: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readTournamentId + id, {
			method: 'POST',
			body: JSON.stringify({ userId: Cookies.get('userId') }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// No access allowed
		if (output.status === 401) {
			return { status: 401, body: null };
		}
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getTournament': ${error}`);
		return { status: 500, body: null };
	}
}
/**
 * Inserts a new tournament into the database, given a JSON Tournament object.
 * @param tournamentObject : JSON object that contains all the information about a tournament
 * @returns `{status:number, body:{ message: string } }` Returns status 200 on success, together with an object containing a string message, or 500
 * 					   					  in case of an internal server error.
 */

export async function createNewTournament(tournamentObject: Tournament): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const createResponse = await fetch(environment.createTournament, {
			method: 'POST',
			body: JSON.stringify({
				userId: Cookies.get('userId'),
				data: tournamentObject
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const outputJSON = await createResponse.json();
		console.log(`Successfully created new Tournament!`);
		return { status: createResponse.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'createNewTournament': ${error}`);
		return { status: 500, body: { message: error } };
	}
}

export async function leaveTournamentBackEnd(tournamentId: string): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const createResponse = await fetch(environment.leaveTournament, {
			method: 'POST',
			body: JSON.stringify({
				userId: Cookies.get('userId'),
				tournamentId: tournamentId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log(`Successfully left tournament!`);
		return { status: createResponse.status, body: '' };
	} catch (error) {
		console.log(`Error in Firebase function 'createNewTournament': ${error}`);
		return { status: 500, body: { message: error } };
	}
}
/**
 * Schedules the tournament in the back-end, given an ID
 * @param tournamentId The ID of the tournament to be scheduled
 * @returns `{status:number, body:{schedule : Array<Array<string>>}}` Returns status 200 on success, together with an object containing the updated schedule, or 500
 * 					   					  							  in case of an internal server error.
 */

export async function scheduleTournamentBackEnd(tournamentId: string): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const scheduleResponse = await fetch(environment.scheduleTournament, {
			method: 'POST',
			body: JSON.stringify({
				tournamentId: tournamentId,
				userId: Cookies.get('userId')
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log(`Successfully scheduled Tournament!`);
		const updatedSchedule = await scheduleResponse.json();
		return { status: scheduleResponse.status, body: updatedSchedule };
	} catch (error) {
		console.log(`Error in Firebase function 'scheduleTournament': ${error}`);
		return { status: 500, body: {} };
	}
}

export async function checkIfUserIsTeamLeaderBackEnd(tournamentId: string): Promise<FireBaseResult> {
	// Make POST request, await the response
	const checkResponse = await fetch(environment.isUserTeamLeader, {
		method: 'POST',
		body: JSON.stringify({
			tournamentId: tournamentId,
			userId: Cookies.get('userId')
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const isUserTeamLeader = await checkResponse.json();
	return { status: checkResponse.status, body: isUserTeamLeader.result };
}
/**
 * Function who will update the state of the tournament in the back-end when a match was
 * indicated by the organiser as won, or possibly drawn (in which case 2 function calls will need to happen with
 * respectively the ID's of both participating teams in the match, and `is_draw` set to `true`).
 * @param winnerId : The ID of the winning team
 * @param tournamentId : The ID of the tournament that the match was played in
 * @param isDraw : Boolean value which says if the match was drawn or not. False by default.
 * Note that this parameter should only be possibly set to true in a round-robin tournament!
 */

export async function updateTournamentOnMatchWon(
	winnerIds: Array<string>,
	tournamentId?: string,
	isDraw: boolean = false
): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const updateResponse = await fetch(environment.selectWinner, {
			method: 'POST',
			body: JSON.stringify({
				tournamentId: tournamentId,
				userId: Cookies.get('userId'),
				winners: winnerIds,
				draw: isDraw
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log(`Successfully updated Tournament schedule!`);
		const updatedSchedule = await updateResponse.json();
		return { status: updateResponse.status, body: updatedSchedule };
	} catch (error) {
		console.log(`Error in Firebase function 'updateTournamentOnMatchWon': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Fetches and returns all tournaments for a given game
 * @param gamename : The name of the game retreiving tournament for
 * @returns `{status:number, body:Object }` Returns status 200 on success, together with an object containing a list of tournaments, or 500
 * 					   					    in case of an internal server error.
 */

export async function getTournamentbyGame(gamename: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readTounamentByGame + gamename);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getTournamentbyGame': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Fetches all tournaments
 * @returns `{status:number, body:Object }` Returns status 200 on success, together with an object containing a list of tournaments, or 500
 * 					   					    in case of an internal server error.
 */

export async function getAllTournaments(): Promise<FireBaseResult> {
	try {
		const response = await fetch(environment.readAllTournaments, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let tournaments = await response.json();
		return { status: response.status, body: tournaments };
	} catch (error) {
		console.log(`Error in Firebase function 'getAllTournaments': ${error}`);
		return { status: 500, body: {} };
	}
}


export async function updateTournament(tournamentId: string, newTournamentInfo: Object): Promise<FireBaseResult> {
	try {
		// Make PUT request, await the response
		const createResponse = await fetch(environment.updateTournament, {
			mode: 'cors',
			method: 'PUT',
			body: JSON.stringify({ userId: Cookies.get('userId'), tournamentId: tournamentId, data: newTournamentInfo }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const status = createResponse.status;
		const body = await createResponse.json();
		return { status: status, body: body };
	} catch (error) {
		return { status: 500, body: { message: error } };
	}
}
