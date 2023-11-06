import { createStyles, Divider, IconButton, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Theme, Typography } from '@material-ui/core';
import React from 'react'
import styles from './NotificationItem.module.css'
import { Props } from './Props';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        item: {
            width: '100%',
            whiteSpace: 'break-spaces',
        },
        inline: {
            display: 'inline',
        },
    }),
);

function NotificationItem(props: Props) {

    const notification = props.notification;
    const classes = useStyles();
    return (
        <div>
            <Link to={notification.link}>
                <MenuItem className={styles.item} alignItems="flex-start">

                    <ListItemText
                        primary={
                            <Typography
                                component="span"
                                variant="h6"
                                className={styles.title}
                                color="textPrimary"
                            >
                                {notification.name}
                            </Typography>
                        }
                        secondary={
                            <React.Fragment >
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    className={styles.sender}
                                    color="textPrimary"
                                >
                                    Person/Tournament
                        </Typography>
                                <div className={classes.item}>
                                    {notification.description}
                                </div>

                            </React.Fragment>
                        } />
                    <ListItemSecondaryAction>
                        <IconButton className={styles.icon}>
                            <DoubleArrowIcon />
                        </IconButton>
                    </ListItemSecondaryAction>


                </MenuItem>
            </Link>
            <Divider variant="inset" component="li" />
        </div>

    );
}

export default NotificationItem;