import React from 'react'
import styles from './ProfilePost.module.css'
import { Props } from './Props';
import AchievementCard from '../AchievementCard/AchievementCard';

function ProfilePost(props: Props) {
    const post = props.post;

    // create achievement elements
    const achievementElements = post.achievementIds.map((id: string) => <AchievementCard key={id} achievementId={id}></AchievementCard>);
    return (
       <div className={styles.post_div}>
           <div className={styles.post_time}>{new Date(post.postDate).toDateString()}</div>
           <div className={styles.post_descrip}>{post.description}</div>
           <div className={styles.post_achievements}>{achievementElements}</div>
       </div>
    )

}

export default ProfilePost