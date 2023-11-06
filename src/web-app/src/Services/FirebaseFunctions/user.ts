import { environment } from '../../Environments/environments';
import { User } from '../../typedefs/firebaseTypedefs.js';
import Cookies from 'js-cookie';
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * --------------------------------------
 * 				   USER
 * --------------------------------------
 */
/**
  * Fetches all users from database and returns it as a JSON object containing status code and user list
  * @retuns JSON object containing status wich is 200 on succes and body wich contains the user list or the empty list
  */

export async function getAllUsers(): Promise<{ status: number; body: User[]; }> {
	try {
		// Fetch all users
		const output = await fetch(environment.readAllUsers);
		// convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log("Error in Firebase function 'getAllUsers:", error);
	}
	return { status: 500, body: [] };
}
/**
 * Fetches and returns a user JSON object from the database based on the id given.
 * @param id : The user id of the user to retrieve
 * @returns {Object} {status: HTTP response code, body: Object with user data}
 */

export async function getUserFromId(id: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readUserId + id);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getUser': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Fetches and returns a user JSON from the database based on the nickname given.
 * @param nickname : The username of the user to retrieve
 * @returns {Object} {status: HTTP response code, body: Object with user data}
 */

export async function getUserFromNickname(nickname: string): Promise<FireBaseResult> {
	try {
		// Fetch the user
		const output = await fetch(environment.readUserNick + nickname);
		// Convert to JSON
		const outputJSON = await output.json();
		return { status: output.status, body: outputJSON };
	} catch (error) {
		console.log(`Error in Firebase function 'getUser': ${error}`);
		return { status: 500, body: {} };
	}
}
/**
 * Inserts a new user into the database, given a JSON User object.
 * @param userObject : JSON object that contains all the information about a user
 * @returns `{status:number, body:{ message: string } }` Returns status 200 on success, together with an object containing a string message, or 500
 * 					   					  in case of an internal server error.
 */

export async function createNewUser(userObject: User): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const createResponse = await fetch(environment.createUser, {
			mode: 'cors',
			method: 'POST',
			body: JSON.stringify(userObject),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const status = await createResponse.status;
		const body = await createResponse.json();
		return { status: status, body: body };
	} catch (error) {
		return { status: 500, body: { message: error } };
	}
}
/**
 * Updates info of the logged user into the database, given the JSON list of updates.
 * @param newAccountInfo : JSON object that contains the information the user wants to update
 * (this could consist out of email, nickname and bio, fields not provided, will not be updated)
 * @returns `{status:number, body:{ message: string } }` Returns status 200 on success, together with an object containing a string message, or 500
 * 					   					  in case of an internal server error.
 */

export async function updateAccount(newAccountInfo: Object): Promise<FireBaseResult> {
	try {
		// Make PUT request, await the response
		const createResponse = await fetch(environment.updateAccount, {
			mode: 'cors',
			method: 'PUT',
			body: JSON.stringify({ userId: Cookies.get('userId'), data: newAccountInfo }),
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
/**
 * Updates password of the logged user into the database, given the JSON list of the needed data.
 * @param newPasswordInfo : JSON object that contains the information the user wants to update
 * (this must consist out of oldpassword, newpassword and confirmedpassword)
 * @returns `{status:number, body:{ message: string } }` Returns status 200 on success, together with an object containing a string message, or 500
 * 					   					  in case of an internal server error.
 */

export async function updatePassword(newPasswordInfo: Object): Promise<FireBaseResult> {
	try {
		// Make PUT request, await the response
		const createResponse = await fetch(environment.updatePassword, {
			mode: 'cors',
			method: 'PUT',
			body: JSON.stringify({ userId: Cookies.get('userId'), data: newPasswordInfo }),
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

/**
 * Bans a user in the database
 * @pre admin is logged in
 * @param userId of the user banning
 * @post user with <userId> is banned
 * @returns JSON object with status as statuscode
 */
export async function banUser(userId: string): Promise<FireBaseResult> {
	try {	
		const body = {
			userId: userId,
			adminId: Cookies.get("userId")
		}
		const response = await fetch(environment.banUser, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: response.status, body: response.body }
	} catch (error) {
		return { status: 500, body: null }
	}
}

/**
 * Unbans a user in the database
 * @pre admin is logged in
 * @param userId of the user unbanning
 * @post user with <userId> is unbanned
 * @returns JSON object with status as statuscode
 */
export async function unbanUser(userId: string): Promise<FireBaseResult> {
	try {	
		const body = {
			userId: userId,
			adminId: Cookies.get("userId")
		}
		const response = await fetch(environment.unbanUser, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: response.status, body: response.body }
	} catch (error) {
		return { status: 500, body: null }
	}
}


/**
 * Verifies a user in the database
 * @pre admin is logged in
 * @param userId of the user verifying
 * @post user with <userId> is verified
 * @returns JSON object with status as statuscode
 */
export async function verifyUser(userId: string): Promise<FireBaseResult> {
	try {	
		const body = {
			userId: userId,
			adminId: Cookies.get("userId")
		}
		const response = await fetch(environment.verifyUser, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: response.status, body: response.body }
	} catch (error) {
		return { status: 500, body: null }
	}
}

/**
 * Unverifies a user in the database
 * @pre admin is logged in
 * @param userId of the user unverifying
 * @post user with <userId> is unverified
 * @returns JSON object with status as statuscode
 */
export async function unverifyUser(userId: string): Promise<FireBaseResult> {
	try {	
		const body = {
			userId: userId,
			adminId: Cookies.get("userId")
		}
		const response = await fetch(environment.unverifyUser, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return { status: response.status, body: response.body }
	} catch (error) {
		return { status: 500, body: null }
	}
}

/**
 * Fetches all users from friends and existing chats of the given user from database and returns it as a JSON object containing status code and user list containing friends and other p2p chats of that user
 * @param userID: Id of the user
 * @retuns JSON object containing status wich is 200 on succes and body wich contains the friends and other chat users list or the empty list
 */

export async function getAllChatUsers(
	userID: string
  ): Promise<{ status: number; body: User[] }> {
	try {
	  const createResponse = await fetch(environment.allChatUsers, {
		method: "POST",
		body: JSON.stringify({ userId: userID }),
		headers: {
		  "Content-Type": "application/json",
		},
	  });
	  const status = createResponse.status;
	  const body = await createResponse.json();
	  return { status: status, body: body };
	} catch (error) {
	  console.log("Error in Firebase function 'readallchatusers:", error);
	}
	return { status: 500, body: [] };
  }