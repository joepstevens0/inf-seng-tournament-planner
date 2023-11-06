
import React, { useEffect, useState } from 'react'
import AchievementCard from '../../Components/AchievementCard/AchievementCard';
import { getUserFromNickname } from "../../Services/FirebaseFunctions/user";
import { User, UserAchievement } from '../../typedefs/firebaseTypedefs';
import styles from './AchievementPage.module.css'

/**
 * @author joepstevens
 * Page which displays the achievements earned by a user.
 */
function AchievementPage (props: Object){

    const [userAchievements, setUserAchievements] = useState([] as UserAchievement[]);
    const [userName, setUsername] = useState("");

    useEffect(()=>{

        async function getAchievementIds(){

            const result = await getUserFromNickname(userName);
    
            if (result.status === 200){
                const user = result.body as User;
                setUserAchievements(user.achievements);
            }
        }

        // get all achievements for the user
        getAchievementIds();
        let URLpath = window.location.href;
        let name = URLpath.split('/').pop();
        if (name === undefined) name = '';
        setUsername(name);
    }, [userName]);

    // create achievement elements
    const achievementElements = userAchievements.map((ua: UserAchievement) => <AchievementCard key={ua.id + ":" + ua.date} achievementId={ua.id} date={ua.date}></AchievementCard>);
    return(
        <div>
            <h2>Achievements {userName}</h2>
            <div className={styles.achievementpage_list}>{achievementElements}</div>
        </div>
    );
    
}

export default AchievementPage