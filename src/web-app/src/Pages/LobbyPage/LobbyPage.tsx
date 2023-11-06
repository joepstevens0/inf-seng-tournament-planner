import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import ChatBox from "../../Components/ChatBox/ChatBox";
import {
	getLobbyFromId,
	joinLobby,
	lobbyToTeam,
	removePlayerFromLobby
} from "../../Services/FirebaseFunctions/teamfinder";
import { getUserFromId } from "../../Services/FirebaseFunctions/user";
import { Lobby, User } from "../../typedefs/firebaseTypedefs";
import styles from "./LobbyPage.module.css";
import UserCard from "../../Components/UserCard/UserCard";
import Cookies from "js-cookie";
import Popup from "../../Components/Popup/Popup";
import { FireBaseResult } from "../../typedefs/FireBaseResult";

/**
 * @author joepstevens
 * Page which displays the lobby (players, chat, resting information)
 */
function LobbyPage(props: Object) {
  const [lobbyData, setLobbyData] = useState({} as Lobby);
  const [players, setPlayers] = useState([] as User[]);
  const [isOwner, setOwner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [chatId, setChatId] = useState("");
  const [redirect, setRedirect] = useState(null as JSX.Element | null);

  const param = useParams() as { id: string };
  const id = param.id;

  // on mounting
  useEffect(() => {
    fetchDataBase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update chat id on lobby update
  useEffect(() => {
    setChatId(lobbyData.chatId);
  }, [lobbyData]);

  /**
   * Fetches all data from database needed to show lobby information
   * @post datastates are filled with correct database info (or null value if database error)
   */
  function fetchDataBase() {
    // get lobby, then get players from lobby
    getLobby(id).then(async (lobby: Lobby | null) => {
      if (lobby !== null) {
        await getPlayers(lobby);
        const userId = Cookies.get("userId");
        if (userId === lobby.ownerId) setOwner(true);
      } else {
        setLobbyData({ name: "Failed to get lobby" } as Lobby);
      }
    });
  }

  /**
   * shows join button if lobby joinable, else hides it
   * @post lobby button is shown or hidden depending on if the logged in user can join it
   * @param users list of User objects that are players in the lobby
   */
  function joinButton(): JSX.Element {
    let button = (
      <Button
        className={styles.joinbutton + " " + styles.button_style}
        onClick={onJoin}
        variant="contained"
        color="secondary"
      >
        {" "}
        Join{" "}
      </Button>
    );

    if (lobbyData.playerIds !== undefined && lobbyData.playerIds.length >= lobbyData.maxPlayers)
      return <></>;

    const userId = Cookies.get("userId");
    if (userId !== undefined)
      players.forEach((user: User) => {
        if (user.id === userId) {
          button = <></>;
        }
      });
    else
      button = (
        <div className={styles.not_loggedin_text}>
          <Link to="/login">Login to join lobby</Link>
        </div>
      );

    return button;
  }

  /**
   * check if current user is in the team
   * @returns true if logged int user is in team
   */
  function inTeam(): boolean {
    const userId = Cookies.get("userId");
    let result = false;
    if (userId !== undefined)
      players.forEach((user: User) => {
        if (user.id === userId) {
          result = true;
        }
      });
    return result;
  }

  /**
   * Gets the players in the lobby from the database
   * @param lobby: The Lobby object getting players from
   * @post the players state is filled with the users in the lobby
   * @returns list of User Objects that are players in the lobby
   */
  async function getPlayers(lobby: Lobby): Promise<User[]> {
    const pList = [] as User[];

    for (let i = 0; i < lobby.playerIds.length; ++i) {
      const userid = lobby.playerIds[i];
      const response = await getUserFromId(userid);
      if (response.status === 200) {
        const user = response.body;
        pList.push(user);
      } else {
        console.error(
          "Failed to get user from database (userid=" + userid + ")"
        );
      }
    }
    setPlayers(pList);
    return pList;
  }

  /**
   * Get lobby object from the database by id
   * @post The lobbyData in the data state is filled with the lobby data from the database
   * @return the lobby or null if no failed to get lobby from database
   */
  async function getLobby(id: string): Promise<Lobby | null> {
    console.debug("Retrieving lobby object from database...");
    const response = await getLobbyFromId(id);
    if (response.status === 200) {
      console.debug("Received lobby from database:", response.body);
      setLobbyData(response.body);
      return response.body;
    }

    return null;
  }

  /**
   * Kick a player from the lobby
   * @pre isOwner is true
   * @param player kicking from the lobby
   * @post player is kicked from the lobby
   */
  function kickPlayer(player: User) {
    console.debug("Kicking player from lobby:", player);
    removePlayerFromLobby(lobbyData, player);
  }

  function createKickButton(player: User): JSX.Element {
    if (!isOwner || player.id === Cookies.get("userId"))
      return <div key={player.id}></div>;
    return (
      <Button
        onClick={() => {
          kickPlayer(player);
        }}
        key={player.id}
      >
        Kick
      </Button>
    );
  }
  function playerListElement(): JSX.Element {
    let userCards = players.map((player: User) => (
      <div key={player.id} className={styles.playerlist_usercard}>
        <UserCard user={player}></UserCard>
        {createKickButton(player)}
      </div>
    ));

    if (userCards.length <= 0) {
      userCards = [<div key="No players found">Failed to get players</div>];
    }

    return (
      <div className={styles.playerlist}>
        <h2 className={styles.playerlist_header}>Players:</h2>
        <ul className={styles.playerlist_players}>{userCards}</ul>
      </div>
    );
  }

  const history = useHistory();
  /**
   * Called when join button is pressed, joins the lobby as the current logged in player
   * @post logged in player is joined or an error is given
   * @post states are filled with new info from the database
   * @pre User is logged in
   */
  function onJoin() {
    joinLobby(lobbyData).then(() => {
      history.go(0);
    });
  }

  /**
   * Called when the create team button is pressed, opens the popup for chosing a team info
   * @post popup for chosing team info is opened
   */
  function onCreateTeam() {
    setShowPopup(true);
  }

  /**
   * Called when a team name has been chosen, creates a team with the given name
   * @post lobby is deleted from the database and the team is created with teamName
   */
  function onTeamNameChosen() {
    console.debug("Transforming lobby into team with name: " + teamName);
    lobbyToTeam(lobbyData, teamName).then((response: FireBaseResult) => {
      if (response.status === 200)
        setRedirect(
          <Redirect to={"/tournament/" + lobbyData.tournamentId}></Redirect>
        );
    });
  }

  /**
   * Called when the popup needs to close
   * @post popup is closed
   */
  function onClosePopup() {
    setShowPopup(false);
  }

  /**
   * handle change in text inputs
   */
  function handleChange(evt: any) {
    setTeamName(evt.target?.value);
  }

  /**
   * shows create team button if owner and lobby if full, else hides it
   * @post create team button is shown or hidden depending on if the logged in user is the lobby owner and the team if full
   */
  function createTeamButton(): JSX.Element {
    if (!isOwner) return <div></div>;
    if (lobbyData.maxPlayers === undefined || lobbyData.playerIds === undefined)
      return <div></div>;
    if (lobbyData.maxPlayers > lobbyData.playerIds.length) return <div></div>;

    return (
      <Button
        className={styles.joinbutton + " " + styles.button_style}
        onClick={onCreateTeam}
        variant="contained"
      >
        Create team
      </Button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Popup hidden={!showPopup} onClose={onClosePopup}>
        <div>Choose a teamname: </div>
        <TextField value={teamName} onChange={handleChange}></TextField>
        <div>
          <Button
            onClick={onTeamNameChosen}
            variant="contained"
            color="default"
            className={styles.button_style}
          >
            Create team
          </Button>
        </div>
      </Popup>

      {redirect}

      <h1 className={styles.lobby_name}>{lobbyData.name}</h1>
      <div className={styles.lobby_info}>
        <div className={styles.description}>
          <h3 className={styles.description_label}>Description:</h3>
          <p className={styles.description_info}>{lobbyData.description}</p>
          {joinButton()}
          {createTeamButton()}
          <div className={styles.lobby_chat}>
            {inTeam() && chatId !== "" ? (
              <ChatBox key="chatbox" chatId={chatId}></ChatBox>
            ) : null}
          </div>
        </div>
        {playerListElement()}
      </div>
    </div>
  );
}

export default LobbyPage;
