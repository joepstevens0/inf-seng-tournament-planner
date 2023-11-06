import { environment } from "../../Environments/environments";
import { Team } from "../../typedefs/firebaseTypedefs.js";
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * --------------------------------------
 * 				TEAM
 * --------------------------------------
 */
/**
 * Fetches a `Team` object given a team ID
 * @param id : ID of the team we're fetching
 *  @returns `{status:number, body:Lobby[] }` Returns status 200 on success, together with a `Team` object, or 500
 * 					   					      in case of an internal server error.
 */

export async function getTeambyId(id: string): Promise<FireBaseResult> {
	try {
		// Fetch the team
		const output = await fetch(environment.readTeamById + id);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getTeambyId': ${error}`);
	}
	return { status: 500, body: null };
}
/**
 * Get team with a chosen user as member
 * @param userId in teams
 * @returns JSON object with status as status code and body a list with all team with <userId> as member
 */

export async function getTeamsByUser(
	userId: string
): Promise<{ status: number; body: Team[]; }> {
	try {
		// Fetch the team
		const output = await fetch(environment.readTeamsByUser + userId);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getTeamsByUser': ${error}`);
	}
	return { status: 500, body: [] };
}
