import { IconButton, Menu } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React, { useState } from 'react'
import styles from './Notifications.module.css'
import NotificationItem from '../NotificationItem/NotificationItem'
import { Notification } from '../../typedefs/firebaseTypedefs';
import { getNotificationsFromLoggedUser } from "../../Services/FirebaseFunctions/notification";

function Notifications() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [anchorDropdown, setAnchorDropdown] = React.useState<HTMLButtonElement | null>(null);
    const [notifications, setNotifications] = useState([] as Notification[]);

	// create a list item for every tournament
	let notificationsList = notifications.map((notificationVar: Notification) => (
		<NotificationItem key={notificationVar.id} notification={notificationVar} />
    ));
    
    /**
     * fetch notifications from database and update the notifications state
     * @post notifications state is filled with notifications from database
     */
    async function getNotifications(){
        let response = await getNotificationsFromLoggedUser();
        if (response.status === 200){
            setNotifications(response.body);
        }
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (showNotifications === true) {
            setShowNotifications(false);
        } else {
            getNotifications();
            setShowNotifications(true);
        }
        setAnchorDropdown(event.currentTarget);
    }

    function handleClose() {
        setAnchorDropdown(null);
    }

    return (
        <div>
            <IconButton onClick={handleClick} >
                <NotificationsIcon className={styles.white_svg} />
            </IconButton>
            <Menu
                id="notifications_list"
                className={styles.list}
                anchorEl={anchorDropdown}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                open={Boolean(anchorDropdown)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                      maxHeight: '40vh',
                      width: '100%',
                      maxWidth: '80ch',
                    },
                  }}
            >
                <h2>Notifications:</h2>
                {notificationsList}

            </Menu>

        </div>

    );
}

export default Notifications;