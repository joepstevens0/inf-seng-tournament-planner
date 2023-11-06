import { Button, InputLabel, TextField } from '@material-ui/core';
import React, { FormEvent, useEffect, useState } from 'react';
import { getAllGames } from "../../Services/FirebaseFunctions/game";
import { createNewLobby } from "../../Services/FirebaseFunctions/teamfinder";
import { getTournamentbyGame } from "../../Services/FirebaseFunctions/tournament";
import { Game, Lobby, Tournament } from '../../typedefs/firebaseTypedefs';
import styles from './CreateLobbyPage.module.css';
import Popup from '../../Components/Popup/Popup';
import GameCard from '../../Components/GameCard/GameCard';
import BasicTournamentCard from '../../Components/BasicTournamentCard/BasicTournamentCard';
import { Redirect } from 'react-router-dom';
import { isValidDescription, isValidGame, isValidName } from '../../Services/formValidation';

/**
 * @author joepstevens
 * Page which serves users to create a lobby to find a team for a certain tournament.
 */
function CreateLobbyPage(props: Object) {
  const [lobbyData, setLobbyData] = useState({
    name: "",
    description: "",
    maxPlayers: 1,
    gameName: "",
    tournamentId: "",
  } as Lobby);

  const [selectedTournament, setSelectedTournament] = useState(
    null as Tournament | null
  );

  const [gameSelecting, setGameSelecting] = useState(false);
  const [tournamentSelecting, setTournamentSelecting] = useState(false);

  const [popupInfo, setPopupInfo] = useState({ title: "", content: <div /> });
  const [redirect, setRedirect] = useState(null as JSX.Element | null);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    gameName: "",
  });

	useEffect(
		() => {
      // get games if selecting a game
			if (gameSelecting) {
				getAllGames().then((response: any) => {
					if (response.status === 200) showGameSelection(response.body);
				});
      }
      // get all tournaments for a game if selecting a tournament
			if (tournamentSelecting) {
				getTournamentbyGame(lobbyData.gameName).then((response: any) => {
					if (response.body !== undefined) showTournamentSelection(response.body);
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ gameSelecting, tournamentSelecting ]
	);

  function handleInputChange(e: any) {
    let formFieldsCopy = JSON.parse(JSON.stringify(lobbyData));
    let target = e.target.name;
    formFieldsCopy[target] = e.target.value;
    setLobbyData(formFieldsCopy);
  }

  function showDatabaseError() {
    // TODO
  }

  /**
   * create a new lobby and insert it into the database
   * @post user is redirected to new lobby page on succes
   */
  function createLobby() {
    createNewLobby(lobbyData).then((chatId: string | null) => {
      if (chatId == null) {
        showDatabaseError();
        return;
      }
      console.debug("Redirecting to lobby:" + chatId);
      setRedirect(<Redirect to={"/lobby/" + chatId} />);
    });
  }

  /**
   * validate form fields, giving errors when incorrect
   * @returns true if all form fields are correct, else false
   * @post user receives an appropriate error for every incorrect field
   */
  function validateFields(): boolean {
    if (lobbyData.tournamentId === "") {
      alert("A Tournament was not choosen");
      return false;
    }
    let isValid = true;
    let errors = {
      name: "",
      description: "",
      gameName: "",
    };
    if (!isValidName(lobbyData.name)) {
      isValid = false;
      errors.name =
        "Invalid name provided! The Lobby's name needs to be between 1 and 40 characters, and can only be a combination of numbers, letters, spaces and underscores.";
    }
    if (!isValidDescription(lobbyData.description)) {
      isValid = false;
      errors.description =
        "Invalid description provided! The description for the lobby needs to be between 1 and 150 characters, and can only exist from letters, numbers and spaces.";
    }
    if (!isValidGame(lobbyData.gameName)) {
      isValid = false;
      errors.gameName = "Invalid game provided! Please select a game.";
    }
    setErrors(errors);
    return isValid;
  }

  function onSubmit(e: FormEvent) {
    console.debug("Validating lobby create form field ...");
    if (validateFields()) {
      console.debug("Creating new lobby: ", lobbyData);
      createLobby();
    } else {
      console.debug("Lobby create fields where filled in incorrect");
    }
    e.preventDefault();
  }

  /**
   * Opens the game-selection pop-up
   */
  function openGameSelect() {
    setGameSelecting(true);
  }

  /**
   * shows the game selection in the pop-up
   * @post the pop-up is filled with the games
   * @param games the user can choose from
   */
  function showGameSelection(games: Game[]) {
    const popupInfo = { title: "", content: <div /> };
    popupInfo.title = "Choose the game";

    const gameitems = games.map((game: Game) => (
      <GameCard key={game.name} onClick={onGameSelect} game={game} />
    ));

    popupInfo.content = <ul className={styles.gamelist}>{gameitems}</ul>;
    setPopupInfo(popupInfo);
  }

  /**
   * shows the tournament selection in the pop-up
   * @post the pop-up is filled with the tournaments
   * @pre a game has been chosen
   * @param tournaments the user can choose from
   */
  function showTournamentSelection(tournaments: Tournament[]) {
    const popupInfo = { title: "", content: <div /> };
    popupInfo.title = "Choose the tournament";

    if (tournaments.length > 0) {
      const tournamentitems = tournaments.map((tournament: Tournament) => (
        <BasicTournamentCard
          key={tournament.id}
          onClick={onTournamentSelect}
          tournament={tournament}
        />
      ));

      popupInfo.content = (
        <ul className={styles.tournamentlist}>{tournamentitems}</ul>
      );
    } else {
      popupInfo.content = <div>No tournaments found</div>;
    }
    setPopupInfo(popupInfo);
  }
  /**
   * Called on selecting a game
   * @post closes game selecting and starts tournament selection
   * @param game chosen during game selection
   */
  function onGameSelect(game: Game) {
    console.debug("Game selected:", game);

    // set game name
    const l: Lobby = lobbyData;
    l.gameName = game.name;
    setLobbyData(l);

    // stop game selecting
    setGameSelecting(false);
    // start tournament selecting
    setTournamentSelecting(true);
  }
  function popupClose() {
    // stop game or tournament selecting
    setGameSelecting(false);
    setTournamentSelecting(false);
  }

  /**
   * Called on selecting a tournament
   * @param tournament selected during tournament selection
   * @pre a game has been selected
   * @post tournament selection is closed and the chosen tournament linked to the lobby
   */
  function onTournamentSelect(tournament: Tournament) {
    console.debug("Tournament selected:", tournament);

    setSelectedTournament(tournament);

    const l: Lobby = lobbyData;
    l.tournamentId = tournament.id;
    l.maxPlayers = tournament.teamSize;
    setLobbyData(l);

    // stop tournament selecting
    setTournamentSelecting(false);
  }

  /**
   * Page element for the selected tournament
   */
  function selectedTournamentElement() {
    if (selectedTournament)
      return (
        <div className={styles.selectedTournament}>
          <BasicTournamentCard tournament={selectedTournament} />
        </div>
      );
    else
      return (
        <div className={styles.noSelectedTournament}>
          No tournament selected
        </div>
      );
  }

  return (
    <div>
      <Popup
        title={popupInfo.title}
        onClose={popupClose}
        hidden={!gameSelecting && !tournamentSelecting}
      >
        {popupInfo.content}
      </Popup>

      {redirect}

      <h1 className={styles.title}>Create lobby</h1>
      <form onSubmit={onSubmit} className={styles.lobbyform} method="post">
        <div className={styles.gamechoosebutton}>
          <Button onClick={openGameSelect} variant="contained" color="primary">
            Choose tournament
          </Button>
        </div>
        {selectedTournamentElement()}
        <span className={styles.error}>{errors.gameName}</span>
        <label className={styles.inputfield}>
          <InputLabel htmlFor="name">Lobby name</InputLabel>
          <TextField
            size="small"
            placeholder="Lobby name"
            required
            variant="outlined"
            type="text"
            name="name"
            onChange={handleInputChange}
          />
        </label>
        <span className={styles.error}>{errors.name}</span>
        <br />
        <label className={styles.inputfield}>
          <InputLabel htmlFor="description">Lobby description</InputLabel>
          <TextField
            size="small"
            placeholder="Lobby description"
            variant="outlined"
            multiline
            type="text"
            name="description"
            onChange={handleInputChange}
          />
        </label>
        <span className={styles.error}>{errors.description}</span>
        <br />
        <div className={styles.inputfield}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            name="Submit"
            className={styles.button_style}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateLobbyPage;
