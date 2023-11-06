import { environment } from '../../Environments/environments';
import Cookies from 'js-cookie';
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * @author jentevandersanden
 * This file serves methods that connect the front-end client application to the back-end API endpoints.
 * The front-end can make use of these methods to retrieve and post data from/to the back-end server.
 */
/**
 * --------------------------------------
 * 	  AUTHENTICATION + AUTHORIZATION
 * --------------------------------------
 */
/**
 * Function that connects to the back-end endpoint to authenticate and
 * initializes the authorization of a user.
 * @param email : The email of the user that's trying to authenticate
 * @param password : The password of the user that's trying to authenticate
 * @returns `{status:number, body:Object}` Returns status 200 on success, together with the userObject of the logged in user, or 401 on email/password
 * 					   					   not found and 500 in case of an internal server error.
 */

export async function loginUser(email: string, password: string): Promise<FireBaseResult> {
	try {
		// Make POST request, await the response
		const loginResponse = await fetch(environment.login, {
			method: 'POST',
			body: JSON.stringify({ email: email, password: password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const status = await loginResponse.status;
		const body = await loginResponse.json();
		return { status: status, body: body };
	} catch (error) {
		console.log(`Error in Firebase function 'loginUser': ${error}`);
		return { status: 500, body: null };
	}
}
/**
 * Gets the User Object of the userId that's logged in (saved in the cookies)
 * @returns `{status:number, body:Object}` Returns status 200 on success, together with the userObject of the logged in user, or 401 on user
 * 					   					   not found and 500 in case of an internal server error.
 */

export async function getLoggedinUser(): Promise<FireBaseResult> {
	try {
		let userIdCookie = Cookies.get('userId');
		if (userIdCookie != null) {
			// Make POST request, await the response
			const loginResponse = await fetch(environment.getLoggedinUser, {
				method: 'POST',
				body: JSON.stringify({ userId: userIdCookie }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const status = await loginResponse.status;
			const userInfo = await loginResponse.json();
			return { status: status, body: userInfo };
		} else {
			return { status: 401, body: null };
		}
	} catch (error) {
		console.log(`Error in Firebase function 'getLoggedinUser': ${error}`);
		return { status: 500, body: null };
	}
}
/**
 * @returns {number} Status code : 200 on succes, 500 on server error
 */

export async function logoutUser() {
	try {
		// Make POST request, await the response
		const logoutResponse = await fetch(environment.logout, {
			method: 'DELETE',
			body: JSON.stringify({ userId: Cookies.get('userId') }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		Cookies.remove('userId');
		return logoutResponse.status;
	} catch (error) {
		console.log(`Error in Firebase function 'logoutUser': ${error}`);
		return 500;
	}
}
