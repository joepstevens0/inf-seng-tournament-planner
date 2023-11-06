
import React, { useEffect, useState } from 'react'
import { DataGrid, ColDef, ValueGetterParams, CellValue } from '@material-ui/data-grid';
import { getFollowers, getFollowing } from "../../Services/FirebaseFunctions/follower";
import { getUserFromNickname } from "../../Services/FirebaseFunctions/user";
import { User } from '../../typedefs/firebaseTypedefs';
import { useHistory } from 'react-router-dom';
import styles from './FollowInfoPage.module.css';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

/**
 * @author seansnellinx
 * Page which displays followers/following user information.
 */


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        cursorPointer: {
            cursor: 'pointer',
          },
      WebkitFontSmoothing: 'auto',
      letterSpacing: 'normal',
      '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.type === 'light' ? '#e1e1e1' : '#1d1d1d',
      },
      '& .MuiDataGrid-iconSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-colCell, .MuiDataGrid-cell': {
        borderRight: `1px solid ${
          theme.palette.type === 'light' ? '#f0f0f0' : '#303030'
        }`,
      },
      '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${
          theme.palette.type === 'light' ? '#f0f0f0' : '#303030'
        }`,
      },
      '& .MuiDataGrid-cell': {
        color:
          theme.palette.type === 'light'
            ? 'rgba(0,0,0,.85)'
            : 'rgba(255,255,255,0.65)',
      },
      '& .MuiPaginationItem-root': {
        borderRadius: 0,
      }
    },
  }),
);

function FollowInfoPage(props: Object) {
    const history = useHistory();
    const classes = useStyles();
    const columns: ColDef[] = [
        { field: 'nickname', headerName: 'Nickname', width: 250 },
        { field: 'bio', headerName: 'Bio', width: 400 },
        {
            field: '{followers}',
            headerName: '# Followers',
            width: 120,
            valueGetter: (params: ValueGetterParams) =>
                `${getFollowersCount(params.getValue('nickname'))}`,
        },
        {
            field: '{following}',
            headerName: '# Following',
            width: 120,
            valueGetter: (params: ValueGetterParams) =>
                `${getFollowingCount(params.getValue('nickname'))}`,
        }
    ];


    const [followers, setFollowers] = useState([] as User[]);
    const [following, setFollowing] = useState([] as User[]);

    const [user, setUser] = useState({} as User);

    useEffect(() => {
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /**
     * This function returns the amount of followers a given user has
     * @param nickname is the nickname of the user
     * @returns {followerAmount} : the number of followers the user has
     */
    function getFollowersCount(nickname: CellValue) {
        for (let i = 0; i < followers.length; i++) {
            if (followers[i].nickname === nickname) {
                return followers[i].followers.length;
            }
        }
        for (let i = 0; i < following.length; i++) {
            if (following[i].nickname === nickname) {
                return following[i].followers.length;
            }
        }
        return 0;
    }

    /**
     * This function returns the amount of user a given user follows
     * @param nickname is the nickname of the user
     * @returns {followingAmount} : the number of users the given user follows
     */
    function getFollowingCount(nickname: CellValue) {
        for (let i = 0; i < followers.length; i++) {
            if (followers[i].nickname === nickname) {
                return followers[i].following.length;
            }
        }
        for (let i = 0; i < following.length; i++) {
            if (following[i].nickname === nickname) {
                return following[i].following.length;
            }
        }

        return 0;
    }

    /**
     * This function gets and sets the followers argument of the page for the given userId
     * @param userId is the id of the user
     * @returns {void} : void
     */
    async function getUserFollowers(userId: string) {
        const result = await getFollowers(userId);
        if (result.status === 200) {
            setFollowers(result.body);
        }
    }

    /**
     * This function gets and sets the following argument of the page for the given userId
     * @param userId is the id of the user
     */
    async function getUserFollowing(userId: string) {
        const result = await getFollowing(userId);
        if (result.status === 200) {
            setFollowing(result.body);
        }
    }

    /**
     * This function gets the nickname from the url, 
     * gets the user Object for this nickname 
     * and sets the user argument on this
     */
    async function getUser() {
        let URLpath = window.location.href;
        let name = URLpath.split('/').pop();
        if (name === undefined) name = '';

        const result = await getUserFromNickname(name);

        if (result.status === 200) {
            const user = result.body as User;
            setUser(user);
            getUserFollowers(user.id);
            getUserFollowing(user.id);
        }
    }

    /**
     * Redirect user to a profilepage
     * @param nickname of the profilepage redirecting to
     * @post user is redirected to the page of the user with nickname <nickname>
     */
    function goToProfile(nickname: string) {
        history.push({
            pathname: '/profile/' + nickname
        });
    }

    return (
        <div>
            <h2 className={styles.center}>{user.nickname}'s followers and follows:</h2>
            <div className={styles.container}>
                <h3>Followers:</h3>
                {followers.length === 0? (
                    <p>{user.nickname} has no followers.</p>
                ): (
                    <div style={{ height: '38vh', width: '100%' }}>
                    <DataGrid
                        className={classes.root}
                        autoHeight
                        rows={followers}
                        columns={columns}
                        pageSize={5}
                        onRowClick={(param) => goToProfile(param.row.nickname)} />
                    </div>
                )}
                
            </div>
            <div className={styles.container}>
                <h3>Following:</h3>
                {following.length === 0? (
                    <p>{user.nickname} doesn't follow anyone.</p>
                ): (
                    <div style={{ height: '38vh', width: '100%' }}>
                    <DataGrid
                        className={classes.root}
                        autoHeight
                        rows={following}
                        columns={columns}
                        pageSize={5}
                        onRowClick={(param) => goToProfile(param.row.nickname)} />
                    </div>
                )}

            </div>
        </div >
    );
}

export default FollowInfoPage