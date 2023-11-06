import React from 'react'
import styles from './TournamentCardContainer.module.css'
import { Props } from './Props'

function TournamentCardContainer (props : React.PropsWithChildren<Props>) {

    return (
        <div className={styles.tournament_card_container_div}>
            {props.children}
        </div>
    )

}

export default TournamentCardContainer