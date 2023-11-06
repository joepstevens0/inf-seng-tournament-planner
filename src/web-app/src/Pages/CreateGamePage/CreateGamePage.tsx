import { Button, InputLabel, TextField } from "@material-ui/core";
import React, { FormEvent, useState } from "react";
import { Game } from "../../typedefs/firebaseTypedefs";
import styles from "./CreateGamePage.module.css";
import { createNewGame } from "../../Services/FirebaseFunctions/game";
/**
 * @author joepstevens
 * Page which serves admins to create a game
 */
function CreateGamePage(props: Object) {
  const [gameData, setGameData] = useState({
    name: "",
    description: "",
  } as Game);

  function handleInputChange(e: any) {
    let formFieldsCopy = JSON.parse(JSON.stringify(gameData));
    let target = e.target.name;
    formFieldsCopy[target] = e.target.value;
    setGameData(formFieldsCopy);
  }

  /**
   * create a new game and insert it into the database
   * @post game is created and inserted into the database
   */
  async function createGame() {
    const response = await createNewGame(gameData);

    if (response.status === 200) {
      
      setGameData({
        name: "",
        description: "",
      });
    } else {
      
    }
  }

  function onSubmit(e: FormEvent) {
    console.debug("Creating new game: ", gameData);
    createGame();

    e.preventDefault();
  }

  return (
    <div>
      <h1 className={styles.title}>Create game</h1>
      <form onSubmit={onSubmit} className={styles.gameform} method="post">
        <label className={styles.inputfield}>
          <InputLabel htmlFor="name">Game name</InputLabel>
          <TextField
            size="small"
            placeholder="Game name"
            required
            variant="outlined"
            type="text"
            name="name"
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label className={styles.inputfield}>
          <InputLabel htmlFor="description">Game description</InputLabel>
          <TextField
            size="small"
            placeholder="Game description"
            variant="outlined"
            multiline
            type="text"
            name="description"
            onChange={handleInputChange}
          />
        </label>
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

export default CreateGamePage;
