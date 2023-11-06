import React from 'react';
import styles from './GameCard.module.css';
import { Props } from './Props';

function GameCard(props: Props) {
    const game = props.game;


    /**
     * Click handler for the gamecard
     * @post calls onClick prop
     */
    function onClick(){
        if (props.onClick !== undefined)
            props.onClick(game);
    }

    return (
        <div className={styles.card_div} onClick={onClick}>
            <div className={styles.card_game_name}>{game.name}</div>
            <div className={styles.card_game_info}>{game.description}</div>        
        </div>
    )

}

export default GameCard