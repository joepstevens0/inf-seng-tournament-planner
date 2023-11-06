import React, { PropsWithChildren } from 'react'
import styles from './ProfilePostContainer.module.css'
import { Props } from './Props'

function ProfilePostContainer (props : PropsWithChildren<Props>) {

    return (
        <div className={styles.profile_post_container_div}>
            {props.children}
        </div>
    )

}

export default ProfilePostContainer