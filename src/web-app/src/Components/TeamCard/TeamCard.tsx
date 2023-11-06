import React, { useEffect, useState } from 'react';
import styles from './TeamCard.module.css';
import { Props } from './Props';
import { Team, User } from '../../typedefs/firebaseTypedefs';
import { FireBaseResult } from "../../typedefs/FireBaseResult";
import { getTeambyId } from "../../Services/FirebaseFunctions/team";
import { getUserFromId } from "../../Services/FirebaseFunctions/user";



function TeamCard(props: Props) {
    const teamId = props.teamId;
    const teamProp = props.team;

    const [team, setTeam] = useState({} as Team);
    const [teamMembers, setTeamMembers] = useState([] as User[]);
    const [teamLeader, setTeamLeader] = useState(null as User| null);

    useEffect(() =>{
        // test if team object recieved as prop, if not retrieve team object from database
        if (teamProp !== undefined){
            // update team state
            setTeam(teamProp);
            // get users in team
            getUsers(teamProp);
        }else
            // get team object from database
            getTeambyId(teamId).then((response: FireBaseResult) =>{
                if (response.status !== 200)
                    return;

                // update team state
                const team = response.body;
                if (team !== undefined){
                    setTeam(team);
                }else{
                    setTeam({name: teamId} as Team);
                }
                // get users in team
                getUsers(team);
            });
    }, [teamId, teamProp]);

    /**
     * The user object for every member in the team 
     * @param team retrieving users from
     * @post a user object for every member in <team> is stored in the state <teamMembers>
     */
    async function getUsers(team: Team){
        const members = [] as User[];
        for (let i = 0; i < team.playerIds.length;++i){
            const playerId = team.playerIds[i];
            const response = await getUserFromId(playerId);
            if (response.status === 200){
                if (playerId === team.teamLeader)
                    setTeamLeader(response.body);
                members.push(response.body);
            }
        }
        setTeamMembers(members);
    }

    /**
     * Click handler for the team card
     * @post the onclick prop is called
     */
    function onClick(){
        if (props.onClick !== undefined)
            props.onClick(team);
    }

    /**
     * @return true if card can be clicked, else false
     */
    function clickable(): boolean{
        return props.onClick !== undefined;
    }

    // create a team member element for every member in the team
    const teamMemberElements = teamMembers.map((member: User)=>
    <div key={"member:"+member.id} className={styles.card_username}>{member.nickname}</div>);

    return (
        <div className={styles.card_div + " " + (clickable()? styles.card_clickable: "")} onClick={onClick}>
            <div className={styles.card_name}>{team.name}</div>
            <div className={styles.card_leader}>Team leader: <div className={styles.card_username}>{teamLeader?.nickname}</div></div>
            <div className={styles.card_teammember_list}>Team members:{teamMemberElements}</div>
        </div>
    )

}

export default TeamCard;
