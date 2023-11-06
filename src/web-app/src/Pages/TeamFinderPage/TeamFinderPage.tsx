import React, { useState, useEffect } from "react";
import LobbyCard from "../../Components/LobbyCard/LobbyCard";
import styles from "./TeamFinderPage.module.css";
import { Game, Lobby } from "../../typedefs/firebaseTypedefs";
import { getAllGames } from "../../Services/FirebaseFunctions/game";
import { getAllLobbiesForGame } from "../../Services/FirebaseFunctions/teamfinder";
import { Link } from "react-router-dom";
import { Button, IconButton } from "@material-ui/core";
import LobbyFilter from "../../Components/LobbyFilter/LobbyFilter";
import GameCard from "../../Components/GameCard/GameCard";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

/**
 * @author joepstevens
 * Page which serves the list of lobbies to the user.
 */
function TeamFinderPage(props: Object) {
  const [allLobbies, setLobbies] = useState([] as Lobby[]);
  const [shownLobbies, showLobbies] = useState([] as Lobby[]);

  const [allGames, setGames] = useState([] as Game[]);
  const [game, setGame] = useState(null as Game | null);

	/**
     * get all lobby objects from the database for a given game
	 * @param game: lobbies are filtered for this game
     * @post the allLobbies data state is filled with the lobbies from the database for a game
     */
	function getLobbies(game: Game) {
		console.debug('Retrieving lobby objects from database...');
		getAllLobbiesForGame(game.name).then((response: any) => {
			if (response.status === 200) setLobbies(response.body);
		});
	}

	/**
	 * get all game objects from the database
	 * @post the state allGames is filled with all games retreived from the database 
	 */
	function getGames() {
		console.debug('Retrieving game objects from the database...');
		getAllGames().then((response: any) => {
			if (response.status === 200) setGames(response.body);
		});
	}

  /**
   * called on apply of the filter, shows the received lobbies
   * @param filteredLobbies list of filtered lobbies received
   * @post shows the filteredLobbies to the user
   */
  function onFilter(filteredLobbies: Lobby[]) {
    showLobbies(filteredLobbies);
  }

  /**
   * Called on selecting a game, selects the game and shows all lobbies for the game
   * @param game selected
   * @post lobbies for the game are shown
   */
  function onGameSelect(game: Game) {
    setGame(game);
    getLobbies(game);
  }

  /**
   * called when the lobby back-button is pressed
   * @post return to game selection
   */
  function onBack() {
    setGame(null);
  }

  // On mounting
  useEffect(() => {
    getGames();
  }, []);

  let content;
  if (game == null) {
    let gameElements = allGames.map((game: Game) => (
      <div key={game.name} className={styles.gamecard}>
        <GameCard onClick={onGameSelect} game={game} />
      </div>
    ));

    if (gameElements.length <= 0)
    gameElements = [<div key="No games found">No games found</div>];
    content = (
      <div className={styles.gamelist}>
        <h2>Choose the game:</h2>
        {gameElements}
      </div>
    );
  } else {
    // create a list item for every lobby
    let listItems = shownLobbies.map((lobbyVar: Lobby) => (
      <LobbyCard key={lobbyVar.id} lobby={lobbyVar} />
    ));

    if (listItems.length <= 0)
      listItems = [<div key="No lobbies found">No lobbies found</div>];

    content = (
      <div>
        <div className={styles.backbutton}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <h2>Lobbies</h2>
        <LobbyFilter allLobbies={allLobbies} onFilter={onFilter} />
        <ul className={styles.lobbylist}>{listItems}</ul>
      </div>
    );
  }

  return (
    <div>
      <h1>Teamfinder</h1>
      <div className={styles.createbutton}>
        <Link to={"/createlobby"}>
          <Button variant="contained" color="secondary" className={styles.button_style}>
            Create lobby
          </Button>
        </Link>
      </div>
      {content}
    </div>
  );
}

export default TeamFinderPage;
