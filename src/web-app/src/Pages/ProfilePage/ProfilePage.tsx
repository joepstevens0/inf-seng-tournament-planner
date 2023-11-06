import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import LeftProfileBar from "../../Components/LeftProfileBar/LeftProfileBar";
import ProfilePost from "../../Components/ProfilePost/ProfilePost";
import ProfilePostContainer from "../../Components/ProfilePostContainer/ProfilePostContainer";
import ProfilePostCreator from "../../Components/ProfilePostCreator/ProfilePostCreator";
import { getPostsByUser } from "../../Services/FirebaseFunctions/post";
import { getUserFromNickname } from "../../Services/FirebaseFunctions/user";
import { Post, User } from "../../typedefs/firebaseTypedefs";
import styles from "./ProfilePage.module.css";

/**
 * @author jentevandersanden
 */
function ProfilePage(props: any) {
	
	useEffect(() => {
		getUserByNickname();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
  const [posts, setPosts] = useState([] as Post[]);
  const [isOwnProfile, setOwnProfile] = useState(false);
	const [userData, setUserData] = useState({
		id: '', 
		achievements: [], 
		bio: '', 
		email: '', 
		joinDate: '', 
		followers: [], 
		following: [], 
		nickname: '',
		password: '', 
		isAdmin: false, 
		isBanned: false, 
		isVerified: false, 
		skillLevels: []
	});
	const [userLoaded, setUserLoaded] = useState(false);

  /**
   * Gets the user belonging to this profile page by fetching the
   * user that corresponds with ID from the URL
   */
  async function getUserByNickname() {
    let URLPath = window.location.href;
    let userName = URLPath.split("/").pop();
    if (userName === undefined) userName = "";

    let response = await getUserFromNickname(userName);
    if (response.status === 200) {
      let userObject = response.body;
      setUserData(userObject);
      setUserLoaded(true);
      setPostsFromUser(userObject);
      checkForProfileOwner(userObject);
    } else {
      console.log("Something went wrong fetching the user.");
    }
  }

  /**
   * Checks if the logged user is the owner of the profile and updates the state if needed
   * @param user: the user who's profile is shown
   */
  function checkForProfileOwner(user: User){
    try{
      if (user.id === Cookies.get('userId')){
        setOwnProfile(true);
      }
    } catch {}
      
    
  }
  /**
   * Gets posts from the user owning the profile page and sets them in the component's state.
   * @post The users posts are now set in the component's state.
   */
  async function setPostsFromUser(user: User) {
    const response = await getPostsByUser(user.id);

    if (response.status === 200) {
      let postList = response.body;

      // sort posts
      postList = postList.sort((a: Post, b: Post) => b.postDate - a.postDate);

      setPosts(postList);
    } else {
      console.error("Something went wrong fetching posts");
    }
  }

  // create post elements
  const postElements = posts.map((post: Post) => (
    <div key={post.postId}>
      <ProfilePost post={post}></ProfilePost>
    </div>
  ));

  return (
    <div className={styles.profile_page_div}>
      <div className={styles.profile_page_leftprofilebar}>
        {userLoaded ? <LeftProfileBar userdata={userData} /> : <div></div>}
      </div>
      <div className={styles.profile_page_post_container}>
        <ProfilePostContainer>
          {!isOwnProfile ? null : (
          <ProfilePostCreator></ProfilePostCreator>
          )}
          {postElements}
        </ProfilePostContainer>
      </div>
    </div>
  );
}

export default ProfilePage;
