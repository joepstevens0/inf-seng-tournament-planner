import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./TopNavBar.module.css";
import { HashRouter as Router } from "react-router-dom";

import {
    AppBar,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { fade, makeStyles } from '@material-ui/core/styles';
import { getAllUsers } from "../../Services/FirebaseFunctions/user";
import { getLoggedinUser, logoutUser } from "../../Services/FirebaseFunctions/auth";
import UserSearch from '../UserSeach/UserSearch';
import { User } from '../../typedefs/firebaseTypedefs';
import Notifications from '../Notifications/Notifications'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 0,
  },
  bubblemargin: {
    margin: theme.spacing(0.5),
    color: "black",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#b1a7a6", 0.3),
    "&:hover": {
      backgroundColor: fade("#746262c2", 1),
      border: "1px solid #666666",
    },
    marginLeft: theme.spacing(2),
    marginRight: 0,
    width: "40%",
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(2),
      width: "50%",
    },
    border: "1px solid #444444",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    color: "black",
  },
}));

function TopNavBar(Props: Object) {
  const classes = useStyles();
  const [login, setName] = useState({
    nickname: "Login here!",
    isLoggedin: false,
  });
  const [
    anchorDropdown,
    setAnchorDropdown,
  ] = React.useState<HTMLButtonElement | null>(null);
  const [openLogoutDialog, setOpenLogoutdialog] = React.useState(false);
  const [allUsers, setUsers] = useState([] as User[]);
  const [isAdmin, setIsAdmin] = useState(false);

  // On mounting
  useEffect(() => {
    getLoggedUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Decides who the currently logged in user is.
   * @post Name of logged in user is set in the state of the component.
   */
  async function getLoggedUser() {
    let responseObject = await getLoggedinUser();
    if (responseObject.status === 200) {
      setName({
        nickname: responseObject.body.nickname,
        isLoggedin: true,
      });
      setIsAdmin(responseObject.body.isAdmin);
      getUsers()
    }
  }

  /**
   * Function which fetches all users (for search function)
   */
  async function getUsers() {
    let responseObject = await getAllUsers();
    if (responseObject.status === 200) {
      setUsers(responseObject.body);
    }
  }

  /**
   * Callback function which is called when a dropdown button is clicked
   * @post Dropdown menu is now open
   */
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorDropdown(event.currentTarget);
  }

  /**
   * Callback function which is called when the dropdown menu needs to be closed.
   * @post Dropdown menu is now closed.
   */
  function handleClose() {
    setAnchorDropdown(null);
  }

  /**
   * Callback function which is called when the logout button is clicked
   * @post The logout dialog popped up.
   */
  function handleClickOpenLogoutDialog() {
    setOpenLogoutdialog(true);
    setAnchorDropdown(null);
  }

  /**
   * Callback function which is called when the logout dialog needs to disappear.
   * @post The logout dialog is no longer visible.
   */
  function handleCloseLogoutDialog() {
    setOpenLogoutdialog(false);
    setAnchorDropdown(null);
  }

  /**
   * Logs out the currently logged in user.
   * @post The user is no longer logged in.
   */
  async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let status = await logoutUser();
    if (status === 200) {
      console.log("Succesfully logged out!");
    }
    setOpenLogoutdialog(false);
    setAnchorDropdown(null);
    window.location.reload();
  }

  return (
    <Router>
      <AppBar color="transparent" position="static">
        <Toolbar classes={{ root: styles.toolbar }}>
          <Typography variant="h6">
            <Link to="/" className={styles.link}>
              PlayConnect
            </Link>
          </Typography>
          {login.isLoggedin? (
            <UserSearch allUsers={allUsers} />
          ): (
            <div></div>
          )}
          
          <div className={styles.textbtn}>
            <Typography variant="h6" className={styles.teamfinderbtn}>
              <Link to="/teamfinder" className={styles.link}>
                Teamfinder
              </Link>
            </Typography>
          </div>
          <div className={styles.textbtn}>
            <Typography variant="h6" className={styles.tournamentbtn}>
              <Link to="/alltournaments" className={styles.link}>
                Tournaments
              </Link>
            </Typography>
          </div>
          <div className={styles.textbtn}>
            <Typography variant="h6" className={styles.teamsbtn}>
              <Link to="/teams" className={styles.link}>
                Teams
              </Link>
            </Typography>
          </div>

          {login.isLoggedin ? (
            <>
              <Link to={"/profile/" + login.nickname}>
                <Avatar
                  className={classes.bubblemargin + " " + styles.profile_avatar}
                >
                  {login.nickname[0]}
                </Avatar>
              </Link>
              <Typography variant="h6">
                <Link to={"/profile/" + login.nickname} className={styles.link}>
                  {login.nickname}
                </Link>
              </Typography>
            </>
          ) : (
            <>
              <Avatar
                className={classes.bubblemargin + " " + styles.profile_avatar}
              ></Avatar>
              <Typography variant="h6">
                <Link to="/login" className={styles.link}>
                  {login.nickname}
                </Link>
              </Typography>
            </>
          )}

          <Avatar className={classes.bubblemargin + " " + styles.icon_avatar}>
            <Link to="/messages">
              <IconButton>
                <MailOutlineIcon className={styles.white_svg} />
              </IconButton>
            </Link>
          </Avatar>

          <Avatar className={classes.bubblemargin + " " + styles.icon_avatar}>
            <Notifications />
          </Avatar>

          <Avatar className={classes.bubblemargin + " " + styles.icon_avatar}>
            <Button
              className={styles.dropdownBtn}
              aria-describedby="simple-menu"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <ArrowDropDownIcon className={styles.white_svg} />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorDropdown}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              keepMounted
              open={Boolean(anchorDropdown)}
              onClose={handleClose}
            >
              {isAdmin? <MenuItem><Link to="/createGame">Create game</Link></MenuItem> : null}
              <MenuItem ><Link to="/profilesettings">Settings</Link></MenuItem>
              {login.isLoggedin ? (
                <MenuItem onClick={handleClickOpenLogoutDialog}>
                  Logout
                </MenuItem>
              ) : (
                <MenuItem>
                  <Link to="/login">Login</Link>
                </MenuItem>
              )}
              <Dialog
                open={openLogoutDialog}
                onClose={handleCloseLogoutDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to log out?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    If you log out, you will need to log back in before you can
                    participate in tournaments, etc.!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseLogoutDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleLogout} color="primary" autoFocus>
                    Log out
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>
          </Avatar>
        </Toolbar>
      </AppBar>
    </Router>
  );
}

export default TopNavBar;
