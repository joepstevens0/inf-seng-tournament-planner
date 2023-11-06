import React from 'react';
import styles from './BasicTournamentCard.module.css';
import { Props } from './Props';

function BasicTournamentCard(props: Props) {
    const tournament = props.tournament;


    /**
     * Click handler for the basic tournament card
     * @post the onclick prop is called
     */
    function onClick(){
        if (props.onClick !== undefined)
            props.onClick(tournament);
    }

    /**
     * @return true if card can be clicked, else false
     */
    function clickable(): boolean{
        return props.onClick !== undefined;
    }

    /**
     * @returns the playercount element for the basic tournament card
     */
    function playerCountElement() : JSX.Element{
        return(
            <div className={styles.card_tournament_playercount}>
                <div className={styles.card_tournament_playercount_label}>Max Players:</div>
                <div className={styles.card_tournament_playercount_number}> {tournament.teamSize} </div>
            </div>
        );
    }

    return (
        <div className={styles.card_div + " " + (clickable()? styles.card_clickable: "")} onClick={onClick}>
            <div className={styles.card_tournament_name}>{tournament.name}</div>
            {playerCountElement()}   
            <div className={styles.card_tournament_info}>{tournament.description}</div>     
        </div>
    )

}

export default BasicTournamentCard