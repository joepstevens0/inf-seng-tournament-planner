import React, { useEffect, useState } from 'react'
import styles from './LobbyFilter.module.css'
import { Props } from './Props';

import {TextField} from "@material-ui/core";
import { Lobby } from '../../typedefs/firebaseTypedefs';

function LobbyFilter(props: Props) {

    const [filters, setFilters] = useState({
        searchFilter: ""
    });

    const allLobbies = props.allLobbies;
    const sendFiltered = props.onFilter;

    /**
     * Filter the lobbies and send them parent component
     * @param filters filter used on lobbies
     * @post filtered lobbies are sent to parent component
     */
    function filterLobbies(filters: any){
        const lobbies = [] as Lobby[];

        // set searchfilter to uppercase
        const searchFilter = filters.searchFilter.toUpperCase();
        // filter lobbies with searchfilter
        allLobbies.forEach((lobby: Lobby)=>{
            if (searchFilter === "" || lobby.name.toUpperCase().indexOf(searchFilter) !== -1)
                lobbies.push(lobby);
        });

        // send filtered lobbies
        sendFiltered(lobbies);
    }

    function handleInputChange(e: any) {
		let formFieldsCopy = JSON.parse(JSON.stringify(filters));
        let target = e.target.name;
		formFieldsCopy[target] = e.target.value;
        setFilters(formFieldsCopy);

        filterLobbies(formFieldsCopy);
	}

    // filter lobbies when lobbies change
    useEffect(()=>{
        filterLobbies(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLobbies]);

    return (
        <div className={styles.lobbyfilter}>
            <div className={styles.searchfield}>
                <div className={styles.searchfield_label}>Search:</div>
                <div className={styles.searchfield_field}>
                    <TextField name="searchFilter" onChange={handleInputChange} size="small" variant="outlined" fullWidth={true}></TextField>
                </div>
            </div>
        </div>
    );

}

export default LobbyFilter