import { Button, TextField } from '@material-ui/core'
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { createPost } from "../../Services/FirebaseFunctions/post";
import { Post } from '../../typedefs/firebaseTypedefs';
import styles from './ProfilePostCreator.module.css'




function ProfilePostCreator(props: any) {
    const history = useHistory();
    const [postText, setPostText] = useState("");
    
    function handleChange(e: any) {
        setPostText(e.target.value);
    }


    /**
     * Called on pressing the post button
     * @post post is created and inserted into the database
     */
    function onPost(){
        const post = {} as Post;
        post.description = postText;
        post.userId = Cookies.get("userId") as string;
        post.achievementIds = [];

        createPost(post);
        history.go(0);
    }

    return (
       <div className={styles.post_div}>
           <TextField
                onChange={handleChange}
                id="filled-multiline-flexible"
                label="Post something..."
                multiline
                rows={4}
                rowsMax={4}
                value={postText}
                variant="filled"
                className={styles.profilepostcreator_textbox}
            />
            <Button onClick={onPost} color='primary' variant='outlined'>
                Post
            </Button>

       </div>
    )

}

export default ProfilePostCreator