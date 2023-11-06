import { environment } from "../../Environments/environments";
import { Achievement } from "../../typedefs/firebaseTypedefs.js";
import { FireBaseResult } from "../../typedefs/FireBaseResult";
import Cookies from "js-cookie";

/**
 * --------------------------------------
 * 				ACHIEVEMENT
 * --------------------------------------
 */
/**
 * Get an achievement by id
 * @param achievementId: Id of the achievement
 * @returns JSON Object with status: responsecode and body: achievement
 */

export async function getAchievement(
	achievementId: string
): Promise<{ status: number; body: Achievement | null; }> {
	try {
		const output = await fetch(environment.readAchievement + achievementId);
		const outputJson = await output.json();
		return { status: output.status, body: outputJson };
	} catch (error) {
		console.error("Error in Firebase function 'getAchievement':", error);
		return { status: 500, body: null };
	}
}
/**
 * Get an achievement by id
 * @param achievementId: Id of the achievement
 * @returns JSON Object with status: responsecode and body: achievement
 */

export async function createAchievement(
	achievement: Achievement
): Promise<FireBaseResult> {
	try {
		const output = await fetch(environment.createAchievement, {
			method: "POST",
			body: JSON.stringify({achievement: achievement, userId: Cookies.get("userId")}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		return { status: output.status, body: null };
	} catch (error) {
		console.error("Error in Firebase function 'createAchievement':", error);
		return { status: 500, body: null };
	}
}
/**
 * Delete an achievement in the database
 * @param achievement: achievement Object deleting in the database
 * @post <achievement> is deleted from the database
 */

export async function deleteAchievement(
	achievement: Achievement
): Promise<FireBaseResult> {
	try {
		// Make a DELETE request
		const response = await fetch(
			environment.deleteAchievement + achievement.id,
			{
				method: "DELETE",
				body: JSON.stringify({userId: Cookies.get("userId")})
			}
		);
		if (response.status === 200)
			console.debug("Succesfully deleted achievement");
		return { status: response.status, body: response.body };
	} catch (error) {
		console.error("Error in Firebase function 'deleteAchievement':", error);
		return { status: 500, body: null };
	}
}
/**
 * Give an achievement to a user
 * @param achievement: Achievement Object giving to the user
 * @param userId: id of user giving achievement to
 * @post user with id <userId> has achievement <achievement>
 */

export async function giveAchievement(
	achievement: Achievement,
	userId: number
): Promise<FireBaseResult> {
	try {
		const requestBody = {
			userId: userId,
			date: Date.now(),
			achievementId: achievement.id,
			currentUserId: Cookies.get("userId")
		};
		const response = await fetch(
			environment.deleteAchievement + achievement.id,
			{
				method: "PUT",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return { status: response.status, body: response.body };
	} catch (error) {
		console.error("Error in Firebase function 'giveAchievement':", error);
		return { status: 500, body: null };
	}
}
