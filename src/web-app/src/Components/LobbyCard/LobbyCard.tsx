import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getTournamentFromId } from "../../Services/FirebaseFunctions/tournament";
import { Tournament } from '../../typedefs/firebaseTypedefs';
import styles from './LobbyCard.module.css'
import { Props } from './Props';

function LobbyCard(props: Props) {

    const [tournament, setTournament] = useState({name: ""} as Tournament);

    const lobbyName =  (props.lobby.name !== undefined)? props.lobby.name : "Lobby";
    const playerCount = (props.lobby.playerIds !== undefined)? (props.lobby.playerIds.length) : "?"
    const maxPlayers = (props.lobby.maxPlayers !== undefined)? props.lobby.maxPlayers : "?";
    const lobbyId = props.lobby.id !== undefined? props.lobby.id : "?";

    useEffect(function getTournament(){
        // fetch tournament data from id
        getTournamentFromId(props.lobby.tournamentId).then((res)=>{
            setTournament(res.body);
        });
    }, [props.lobby.tournamentId]);

    return (
        <Link to={"/lobby/" + lobbyId}>
            <div className={styles.card_div}>
                <div className={ styles.lobbyname}>{lobbyName}</div>
                <div className={styles.playercount}>{"players: " + playerCount + "/" + maxPlayers}</div>
                <div className={styles.tournament}>{tournament?.name}</div>
            </div>
        </Link>
    )

}

export default LobbyCard