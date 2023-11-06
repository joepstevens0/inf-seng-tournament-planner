import React from 'react';
import styles from './SmallUserCard.module.css';
import { Props } from './Props';

function SmallUserCard(props: Props) {
    const user = props.user;


    /**
     * on click handler for small usercard, calls the onclick prop
     * @post onClick prop is called
     */
    function onClick(){
        if (props.onClick !== undefined)
            props.onClick(user);
    }

    /**
     * @returns true if card is clickable, else false
     */
    function clickable(): boolean{
        return props.onClick !== undefined;
    }

    return (
        <div className={styles.card_div + " " + (clickable()? styles.card_clickable: "") + 
        " " + (props.highlight === true ? styles.highlight : "")} onClick={onClick}>
            <div className={styles.card_nickname}>{user.nickname}</div>
        </div>
    )

}

export default SmallUserCard