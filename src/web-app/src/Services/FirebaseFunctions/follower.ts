import { environment } from "../../Environments/environments";
import { User } from "../../typedefs/firebaseTypedefs.js";
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * --------------------------------------
 * 				FOLLOWER
 * --------------------------------------
 */
/**
 * Changes if user1 follows user2 or not.
 * If user1 followed user2, he will unfollow him.
 * If user1 doesn't follow user2, he won't follow him anymore.
 * @param user1Name: nickname of user1
 * @param user2Name: nickname of user2
 * @post updates wether user1 follows user2 or not.
 */

export async function updateFollow(
  user1Name: string,
  user2Name: string
): Promise<FireBaseResult> {
  try {
    // Make PUT request, await the response
    const createResponse = await fetch(environment.updateFollow, {
      method: "PUT",
      body: JSON.stringify({ firstName: user1Name, secondName: user2Name }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Convert to JSON
    return { status: createResponse.status, body: null };
  } catch (error) {
    console.log(`Error in Firebase function 'updateFollow': ${error}`);
  }
  return { status: 500, body: null };
}
/**
 * Checks wether user1 follows user2
 * @param user1Name: nickname of user1
 * @param user2Name: nickname of user2
 * @returns boolean wether user1 follows user2
 */

export async function doesUserFollow(
  user1Name: string,
  user2Name: string
): Promise<FireBaseResult> {
  try {
    const createResponse = await fetch(environment.readFollow, {
      method: "POST",
      body: JSON.stringify({ firstName: user1Name, secondName: user2Name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const status = createResponse.status;
    const body = await createResponse.json();
    return { status: status, body: body };
  } catch (error) {
    console.log(error);
    return { status: 500, body: error };
  }
}
/**
 * Fetches all friends of the given user from database and returns it as a JSON object containing status code and user list only containing friends
 * @param userId: Id of the user
 * @retuns JSON object containing status wich is 200 on succes and body wich contains the friends list or the empty list
 */

export async function getAllFriends(
  userId: string
): Promise<{ status: number; body: User[] }> {
  try {
    const createResponse = await fetch(environment.readAllFriends, {
      method: "POST",
      body: JSON.stringify({ userId: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const status = createResponse.status;
    const body = await createResponse.json();
    return { status: status, body: body };
  } catch (error) {
    console.log("Error in Firebase function 'readAllFriends:", error);
  }
  return { status: 500, body: [] };
}

/**
 * Fetches all followers of the given user from database and returns it as a JSON object containing status code and user list only containing the followers
 * @param userID: Id of the user
 * @retuns JSON object containing status wich is 200 on succes and body wich contains the followers list or the empty list
 */

export async function getFollowers(
  userId: string
): Promise<{ status: number; body: User[] }> {
  try {
    const createResponse = await fetch(environment.readFollowers, {
      method: "POST",
      body: JSON.stringify({ userId: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const status = createResponse.status;
    const body = await createResponse.json();
    return { status: status, body: body };
  } catch (error) {
    console.log("Error in Firebase function 'readFollowers:", error);
  }
  return { status: 500, body: [] };
}
/**
 * Fetches all following users for the given user from database and returns it as a JSON object containing status code and user list only containing the followed users by the user
 * @param userID: Id of the user
 * @retuns JSON object containing status wich is 200 on succes and body wich contains the followed list of users or the empty list
 */

export async function getFollowing(
  userId: string
): Promise<{ status: number; body: User[] }> {
  try {
    const createResponse = await fetch(environment.readFollowing, {
      method: "POST",
      body: JSON.stringify({ userId: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const status = createResponse.status;
    const body = await createResponse.json();
    return { status: status, body: body };
  } catch (error) {
    console.log("Error in Firebase function 'readFollowing:", error);
  }
  return { status: 500, body: [] };
}
