import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./TournamentFilter.module.css";
import { Props } from "./Props";
import { Autocomplete } from "@material-ui/lab";
import { Checkbox, TextField } from "@material-ui/core";
import { Tournament } from "../../typedefs/firebaseTypedefs";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Cookies from "js-cookie";

/**
 * @author seansnellinx
 * Component which serves as a filter functionality for a list of tournaments.
 */

function TournamentFilter(props: Props) {
  const [filters, setFilters] = useState({
    searchFilter: "",
    gameFilter: "",
    hideFull: false,
    showOnlyOwned: false
  });
  const [allGameNames, setGamenames] = useState([] as string[]);
  const allTournaments = props.allTournaments;
  const sendFiltered = props.onFilter;

  // filter tournaments when tournaments change
  useEffect(() => {
    filterTournaments(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTournaments, filters]);

  // set allGames
  useEffect(() => {
    const gameNames = [] as string[];
    allTournaments.forEach((tournament: Tournament) => {
      if (!gameNames.includes(tournament.gameName)) {
        gameNames.push(tournament.gameName);
      }
    });
    setGamenames(gameNames);
  }, [allTournaments]);

  /**
   * Filters the list of displayed tournaments
   * @param filters
   * @post Updated the list of tournaments
   */
  function filterTournaments(filters: any) {
    const tournaments = [] as Tournament[];

    const searchFilter = filters.searchFilter.toUpperCase();
    const gameFilter = filters.gameFilter.toUpperCase();

    allTournaments.forEach((tournament: Tournament) => {
      // isFull filter
      if (filters.hideFull && tournament.teams.length >= tournament.amountTeams)
        return;

      // owned filter
      const userId = Cookies.get("userId");
      if (filters.showOnlyOwned && tournament.organiserId !== userId)
        return;

      // search filter
      if (
        searchFilter !== "" &&
        tournament.name.toUpperCase().indexOf(searchFilter) === -1
      )
        return;

      // game filter
      if (gameFilter !== "" && tournament.gameName.toUpperCase() !== gameFilter)
        return;

      tournaments.push(tournament);
    });

    sendFiltered(tournaments);
  }

  /**
   * Callback function which is called on input change of the filter fields.
   */
  function handleInputChange(e: any) {
    let formFieldsCopy = JSON.parse(JSON.stringify(filters));
    let target = e.target.name;
    formFieldsCopy[target] = e.target.value;
    setFilters(formFieldsCopy);

    filterTournaments(formFieldsCopy);
  }

  /**
   * Callback function which is called when the game filter is changed.
   * @param value : The game we're filtering on.
   */
  function onGameChange(event: any, value: string | null) {
    if (value === null) value = "";
    const f = filters;
    f.gameFilter = value as string;
    setFilters(f);
    filterTournaments(f);

    console.debug("Gamefilter chosen:", value);
  }

  /**
   * Changes the hide full filter
   * @param event: not used
   * @param isChecked new check state of the checkbox
   * @post filter for hiding full tournaments is changed to <isChecked>
   */
  function handleFullCheckbox(event: ChangeEvent<HTMLInputElement>, isChecked: boolean){
    const filterObject = filters;
    filterObject.hideFull = isChecked;
    setFilters(filterObject);

    console.debug("Filter hide full tournaments set to:", isChecked); 

    filterTournaments(filterObject);
  }
  
  /**
   * Changes the show only owned filter
   * @param event: not used
   * @param isChecked new check state of the checkbox
   * @post filter showing only owned tournaments is changed to <isChecked>
   */
  function handleOwnedCheckbox(event: ChangeEvent<HTMLInputElement>, isChecked: boolean){
    const filterObject = filters;
    filterObject.showOnlyOwned = isChecked;
    setFilters(filterObject);

    console.debug("Filter show only owned tournaments set to:", isChecked); 

    filterTournaments(filterObject);
  }

  return (
    <div className={styles.tournamentfilter}>
      <div className={styles.searchfield}>
        <div className={styles.searchfield_label}>Search:</div>
        <div className={styles.searchfield_field}>
          <TextField
            name="searchFilter"
            onChange={handleInputChange}
            size="small"
            variant="outlined"
            fullWidth={true}
          ></TextField>
        </div>
      </div>
      <div className={styles.search_gamefield}>
        <Autocomplete
          size="small"
          style={{ width: 250 }}
          options={allGameNames}
          onChange={onGameChange}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Game..."
              size="small"
              variant="outlined"
              fullWidth
            />
          )}
          // This code only provides the highlighting of the matches in the results
          renderOption={(option: string, { inputValue }) => {
            const matches = match(option, inputValue);
            const parts = parse(option, matches);
            return (
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
      </div>
      <div className={styles.fullcheckbox}>
        <div className={styles.fullcheckbox_label}>Hide full tournaments</div>
        <Checkbox onChange={handleFullCheckbox}></Checkbox>
      </div>
      <div className={styles.ownercheckbox}>
        <div className={styles.ownercheckbox_label}>Organised by you</div>
        <Checkbox onChange={handleOwnedCheckbox}></Checkbox>
      </div>
    </div>
  );
}

export default TournamentFilter;
