import { environment } from "../../Environments/environments";
import { Post } from "../../typedefs/firebaseTypedefs.js";
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * --------------------------------------
 * 				POSTS
 * --------------------------------------
 */
/**
 * Create a post in the database
 * @param post: post Object inserting into the database
 * @post <post> is inserted into the database
 */

export async function createPost(post: Post): Promise<FireBaseResult> {
  try {
    // Make a POST request
    const response = await fetch(environment.createPost, {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) console.debug("Succesfully created a post");
    return { status: response.status, body: response.body };
  } catch (error) {
    console.error("Error in Firebase function 'createPost':", error);
    return { status: 500, body: null };
  }
}

/**
 * Delete a post in the database
 * @param post: post Object deleting in the database
 * @post <post> is deleted from the database
 */

export async function deletePost(post: Post): Promise<FireBaseResult> {
  try {
    // Make a DELETE request
    const response = await fetch(environment.deletePost + post.postId, {
      method: "DELETE",
    });
    if (response.status === 200) console.debug("Succesfully deleted post");
    return { status: response.status, body: response.body };
  } catch (error) {
    console.error("Error in Firebase function 'deletePost':", error);
    return { status: 500, body: null };
  }
}
/**
 * Get all post for a user
 * @param userId: id of the user getting posts for
 * @returns JSON object with status for response code and body a list of all posts for the user
 */

export async function getPostsByUser(
  userId: string
): Promise<{ status: number; body: Post[] }> {
  try {
    const output = await fetch(environment.readPostsForUser + userId);
    const outputJson = await output.json();
    return { status: output.status, body: outputJson };
  } catch (error) {
    console.error("Error in Firebase function 'createPost':", error);
    return { status: 500, body: [] };
  }
}
