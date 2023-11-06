import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import { Avatar, Button, Typography } from "@material-ui/core";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import styles from "./LeftProfileBar.module.css";
import { Link } from "react-router-dom";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import T1image from "./t1.jpg";
import {
  doesUserFollow,
  updateFollow
} from "../../Services/FirebaseFunctions/follower";
import { getLoggedinUser } from "../../Services/FirebaseFunctions/auth";
import { Props } from "./Props";
import { User } from "../../typedefs/firebaseTypedefs";
import { banUser, unbanUser, unverifyUser, verifyUser } from "../../Services/FirebaseFunctions/user";
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * @author jentevandersanden, seansnellinx
 * This component can be used to display basic user information like profile picture, nickname, followers etc. in a column-wise way.
 * It is used in the ProfilePage.
 */

function LeftProfileBar(props: Props) {
  const user = props.userdata;
  const [profileOwner, setProfileOwner] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [loggedUser, setLoggedUser] = useState({} as User);
  const [doesFollow, setFollowed] = useState(false as Boolean);
  const [banned, setBanned] = useState(user.isBanned);
  const [verified, setVerified] = useState(user.isVerified);

  useEffect(() => {
    setProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileOwner, doesFollow, followersCount]);

  /**
   * Initialization function which loads the data for the corresponding user.
   * @post : All the necessary data of the user was loaded into this component.
   */
  async function setProfile() {
    if (loggedUser.nickname === undefined) {
      await getLoggedUser();
    }
    setProfileOwner(user.nickname);
    setFollowersCount(user.followers.length);
    setFollowingCount(user.following.length);
    if (
      loggedUser.nickname !== undefined &&
      profileOwner !== "" &&
      loggedUser.nickname !== profileOwner
    ) {
      await syncFollowStatus();
    }
  }

  /**
   * Checks in back-end whether the user looking at this component follows the user that this component represents.
   * @post Follow status is set in the state of the component.
   */
  async function syncFollowStatus() {
    let responseObject = await doesUserFollow(
      loggedUser.nickname,
      profileOwner
    );
    if (responseObject.status === 200) {
      setFollowed(await responseObject.body.message);
    }
  }

  /**
   * Checks whether the user that looks at this component is the same as the user that this component represents.
   * @returns `boolean`
   */
  function isOwnAccount() {
    return loggedUser.nickname === profileOwner;
  }

  /**
   * Gets the user that is logged in.
   * @post Logged in user is now set in the state of the component.
   */
  async function getLoggedUser() {
    let responseObject = await getLoggedinUser();
    if (responseObject.status === 200) {
      setLoggedUser(await responseObject.body);
    }
  }

  /**
   * Callback function which is called when the follow button is clicked.
   */
  async function handleFollowClick() {
    try {
      let responseObject = await updateFollow(
        loggedUser.nickname,
        profileOwner
      );
      if (responseObject.status === 200) {
        if (doesFollow === true) {
          for (let i = 0; i < user.followers.length; i++) {
            if (user.followers[i] === loggedUser.id) {
              user.followers.splice(i, 1);
              setFollowed(false);
            }
          }
        } else {
          if (loggedUser.id !== undefined) {
            user.followers.push(loggedUser.id);
            setFollowed(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Change the ban status of a user
   * @pre admin is logged in
   * @post user from userpage is banned/unbanned in the database
   */
  function setBan(isBanned: boolean){
    if (!isBanned){
      unbanUser(user.id).then((response: FireBaseResult)=>{
        if (response.status === 200)
          alert("User unban succes");
          setBanned(false);
      });
    }else{
      banUser(user.id).then((response: FireBaseResult)=>{
        if (response.status === 200)
          alert("User ban succes");
          setBanned(true)
      });
    }
  }

  /**
   * Change the verify status of a user
   * @pre admin is logged in
   * @post user from userpage is verified/unverified in the database
   */
  function setVerify(isVerified: boolean){
    if (!isVerified){
      unverifyUser(user.id).then((response: FireBaseResult)=>{
        if (response.status === 200)
          alert("User unverify succes");
          setVerified(false);
      });
    }else{
      verifyUser(user.id).then((response: FireBaseResult)=>{
        if (response.status === 200)
          alert("User verify succes");
          setVerified(true)
      });
    }
  }

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.profilepic}
        alt="Profile picture"
        src={T1image}
      />
      <CardContent>
        <Typography
          className={styles.usernamebox}
          gutterBottom
          variant="h5"
          component="h2"
        >
        {props.userdata.nickname}
          {verified ? <VerifiedUserIcon /> : null}
        </Typography>
        <Typography
          className={styles.cardContent}
          variant="body2"
          color="textSecondary"
        >
          {props.userdata.bio}
        </Typography>
      </CardContent>
      {isOwnAccount() ? (
        <div>
          <Link to="/profilesettings">
            <IconButton>
              <SettingsIcon></SettingsIcon>
            </IconButton>
          </Link>
        </div>
      ) : (
          <IconButton onClick={handleFollowClick} aria-label="Follow">
            {doesFollow ? <PersonIcon /> : <PersonOutlineIcon />}
          </IconButton>
        )}
      <div>
        <Link to={"/followinfo/" + profileOwner}>
          <h4>Follower info:</h4>
        </Link>
        <p>Followers: {followersCount}</p>
        <p>Following: {followingCount}</p>
      </div>
      <div className={styles.achievementsButton}>
        <Link to={"../../../achievements/" + profileOwner}>
          <Button>Achievements</Button>
        </Link>
      </div>
      {
        loggedUser.isAdmin ? 
        <div className={styles.banButton}>
          <Button onClick={()=>{setBan(!banned);}}>{banned? "unban" : "Ban"}</Button>
        </div>
        :
        null
      }
      {
        loggedUser.isAdmin ? 
        <div className={styles.verifyButton}>
          <Button onClick={()=>{setVerify(!verified);}}>{verified? "unverify" : "verify"}</Button>
        </div>
        :
        null
      }
    </Card>
  );
}

export default LeftProfileBar;
