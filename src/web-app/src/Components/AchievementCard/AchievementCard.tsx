import React, { useEffect, useState } from 'react';
import styles from './AchievementCard.module.css';
import { Props } from './Props';
import { Achievement } from '../../typedefs/firebaseTypedefs';
import { getAchievement } from "../../Services/FirebaseFunctions/achievement";

function AchievementCard(props: Props) {
    const [achievementData, setAchievementData] = useState({} as Achievement);

    useEffect(()=>{
        // if achievement data not given as prop, get it from the database
        if (props.achievementData !== undefined)
            setAchievementData(props.achievementData);
        else if (props.achievementId !== undefined)
            setAchievementById(props.achievementId);
    }, [props.achievementData, props.achievementId]);

    /**
     * Get the achievement object from the database and 
     * @param achievementId: the id of the achievement retrieving
     * @post if fetch was a succes, the achievementObject with id <achievementId> is stored in the state <achievementData>
     */
    async function setAchievementById(achievementId: string){
        const response = await getAchievement(achievementId);

        if (response.status === 200 && response.body){
            setAchievementData(response.body);
        }else{
            console.error("Failed to get achievement from id");
        }
    }
    
    /**
     * Click handler for the achievement card
     * @post the onclick prop is called
     */
    function onClick(){
        if (props.onClick !== undefined)
            props.onClick(achievementData);
    }

    /**
     * @return true if card can be clicked, else false
     */
    function clickable(): boolean{
        return props.onClick !== undefined;
    }

    /**
     * @return the date element for the achievement card
     */
    function dateElement(): JSX.Element{
        if (props.date === undefined){
            return <div key={"NoDate"}></div>;
        }
        return <div className={styles.card_achievement_achievedate} key={"date"}>Achieved: {new Date(props.date).toDateString()}</div>;
    }

    return (
        <div className={styles.card_div + " " + (clickable()? styles.card_clickable: "")} onClick={onClick}>
            <div className={styles.card_achievement_name}>{achievementData.name}</div>   
            {dateElement()} 
            <div className={styles.card_achievement_description}>{achievementData.description}</div>    
        </div>
    )

}

export default AchievementCard