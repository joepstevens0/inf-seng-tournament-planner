import React, { useState } from 'react'

import { Link } from 'react-router-dom';
import styles from './TournamentCard.module.css'
import { Props } from './Props'

function TournamentCard(props: Props) {

    const [data] = useState({
        img: props.img,
        name: props.tournament,
    });

    /**
     * Parses an amount of seconds into the dateformat: 'DD/MM/YYYY'
     * @param sec The amount of seconds
     * @returns `string`
     */
    function getDateFormat(sec: number) {
        const dateObject = new Date(sec * 1000);
        return dateObject.toLocaleDateString();
    }

    // Constants
    const tournamentName = (props.tournament.name !== undefined) ? props.tournament.name : "Tournament";
    const tournamentGame = (props.tournament.gameName !== undefined) ? props.tournament.gameName : "Game";
    const tournamentAmountTeams = (props.tournament.amountTeams !== undefined) ? props.tournament.amountTeams : 0;
    const tournamentTeams = (props.tournament.teams.length !== undefined) ? props.tournament.teams.length : 0;
    const tournamentStarted = (props.tournament.hasBegun !== undefined) ? props.tournament.hasBegun : false;
    const tournamentStartDate = (props.tournament.startDate !== undefined) ? getDateFormat(props.tournament.startDate._seconds) : "";

    return (
        <Link to={'tournament/' + data.name.id}>
            <div className={styles.card_div}>
                <div className={styles.card_tournament_info}>
                    <h2 className={`${styles.info_text} ${styles.tournament_title}`}>{tournamentName}</h2>
                    <p className={`${styles.info_text} ${styles.tournament_game}`}>Game: {tournamentGame}</p>
                    <p className={`${styles.info_text} ${styles.tournament_teaminfo}`}>Teams: {tournamentTeams}/{tournamentAmountTeams}</p>
                    <p className={`${styles.info_text} ${styles.tournament_teaminfo}`}>Spot(s) available: {tournamentAmountTeams - tournamentTeams}</p>
                    {tournamentStarted ? (
                        <p className={`${styles.info_text} ${styles.tournament_teaminfo}`}>Started: {tournamentStartDate}</p>
                    ): (
                        <p className={`${styles.info_text} ${styles.tournament_teaminfo}`}>Starting: {tournamentStartDate}</p>
                    )}
                </div>
                <div className={styles.card_tournament_img_container}>
                    <img className={styles.banner} src={data.img} alt="Banner" />
                </div>
            </div>
        </Link>
    )

}

export default TournamentCard