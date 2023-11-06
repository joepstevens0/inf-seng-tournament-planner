import { environment } from "../../Environments/environments";
import { Notification } from "../../typedefs/firebaseTypedefs.js";
import Cookies from "js-cookie";

/**
 * --------------------------------------
 * 				NOTIFICATION
 * --------------------------------------
 */
/**
 * Fetches the last 25 notifications of the logged in user from database and returns it as a JSON object containing status code and the list of notifications
 * @retuns JSON object containing status wich is 200 on succes and body wich contains the friends list or the empty list
 */

export async function getNotificationsFromLoggedUser(): Promise<{
  status: number;
  body: Notification[];
}> {
  try {
    let userIdCookie = Cookies.get("userId");
    if (userIdCookie != null) {
      const createResponse = await fetch(environment.readNotifications, {
        method: "POST",
        body: JSON.stringify({ userId: userIdCookie }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const status = createResponse.status;
      const body = await createResponse.json();
      return { status: status, body: body };
    }
  } catch (error) {
    console.log("Error in Firebase function 'readNotifications:", error);
  }
  return { status: 500, body: [] };
}
