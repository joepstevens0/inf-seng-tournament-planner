import { environment } from "../../Environments/environments";
import { Game } from "../../typedefs/firebaseTypedefs.js";
import { FireBaseResult } from "../../typedefs/FireBaseResult";
import Cookies from "js-cookie";

/**
 * --------------------------------------
 * 				GAME
 * --------------------------------------
 */
/**
 * Fetches and returns a game JSON object from the database based on the name given.
 * @param name : The game name of the game to retrieve
 * @returns `{status:number, body:Lobby[] }` Returns status 200 on success, together with a `Game` object, or 500
 * 					   					    in case of an internal server error.
 */

export async function getGamebyName(name: string): Promise<FireBaseResult> {
  try {
    // Fetch the user
    const output = await fetch(environment.readGameByName + name);
    // Convert to JSON
    const outputJSON = await output.json();
    return { status: output.status, body: outputJSON };
  } catch (error) {
    console.log(`Error in Firebase function 'getGameByName': ${error}`);
    return { status: 500, body: {} };
  }
}
/**
 * Fetches and returns a game list containing all game JSON objects from the database.
 *  @returns `{status:number, body:Lobby[] }` Returns status 200 on success, together with an object containing a list of `Game` objects, or 500
 * 					   					    in case of an internal server error.
 */

export async function getAllGames(): Promise<FireBaseResult> {
  try {
    // Fetch the user
    const output = await fetch(environment.readAllGames);
    // Convert to JSON
    const outputJSON = await output.json();
    return { status: output.status, body: outputJSON };
  } catch (error) {
    console.log(`Error in Firebase function 'getAllGames': ${error}`);
    return { status: 500, body: {} };
  }
}
/**
 * Inserts a new game into the database, given a JSON Game object.
 * @param gameObject : JSON object that contains all the information about a game
 * @returns {void} void
 */

export async function createNewGame(gameObject: Game): Promise<FireBaseResult> {
  try {
    // Make POST request, await the response
    const response = await fetch(environment.createGame, {
      method: "POST",
      body: JSON.stringify({game: gameObject, userId: Cookies.get("userId")}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`Successfully created new Game!`);
    return { status: response.status, body: null };
  } catch (error) {
    console.log(`Error in Firebase function 'createNewGame': ${error}`);
    return { status: 500, body: null };
  }
}
