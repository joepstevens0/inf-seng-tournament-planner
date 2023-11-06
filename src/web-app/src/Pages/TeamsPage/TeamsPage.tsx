import React, { useEffect, useState } from 'react';

import styles from './TeamsPage.module.css';

import Cookies from 'js-cookie';
import { Team } from '../../typedefs/firebaseTypedefs';
import { getTeamsByUser } from "../../Services/FirebaseFunctions/team";
import TeamCard from '../../Components/TeamCard/TeamCard';
import { Redirect } from 'react-router-dom';

/**
 * @author joepstevens, seansnellinx
 * Page which serves a list of teams of which the user is part of.
 */
function TeamsPage(props: Object) {

    const [teams, setTeams] = useState([] as Team[]);
    const [redirect, setRedirect] = useState(null as JSX.Element | null);

    useEffect(()=>{
        // get all Team objects for the logged in user
        const userId = Cookies.get("userId");
        if (userId !== undefined)
            getTeamsByUser(userId).then((response: {status:number, body: Team[]})=>{
                if (response.status === 200)
                    setTeams(response.body);
            });
    }, []);

    function onTeamClick(team: Team){
        setRedirect(<Redirect to={"/tournament/" + team.tournamentId}></Redirect>);
    }

    // create TeamCard elements
    let teamElements = teams.map((team: Team) =>
        <div key={"team:" + team.id} className={styles.teamspage_team}><TeamCard onClick={onTeamClick} teamId={team.id} team={team}></TeamCard></div>
    );

    // display message if user not in any teams
    if (teams.length <= 0)
        teamElements = [<div key={"NoTeam"}>User is not in any teams</div>];
	return (
		<div>
            {redirect}
            <h1 className={styles.title}>Teams</h1>
            <div className={styles.teamspage_teamlist}>
                {teamElements}
            </div>
		</div>
	);
}

export default TeamsPage;
