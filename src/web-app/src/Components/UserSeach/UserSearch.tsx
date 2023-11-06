import React from 'react';
import { makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Props } from './Props';
import { useHistory } from 'react-router-dom';
import styles from "./UserSearch.module.css";

const useStyles = makeStyles((theme) => ({
	search: {
		padding: '0px',
		marginLeft: theme.spacing(2),
		marginRight: 0,
		width: '40%',
		[theme.breakpoints.up('sm')]: {
			marginRight: theme.spacing(2),
			width: '50%'
		},
		height: '80%'
	}
}));

/**
 * @author seansnellinx
 * Component which is able to filter a list of users based on username.
 */
function UserSearch(props: Props) {
	const classes = useStyles();

	const allUsers = props.allUsers;
	const history = useHistory();

    return (
        <div>
            <Autocomplete
                id="UserSearch"
                style={{ width: 250 }}
                className={classes.search}
                options={allUsers}
                onChange={(event, value) => {
                    // If a user was selected, redirect to this user
                    if (value != null) {
                        history.replace({
                            pathname: '/profile/' + value.nickname
                        });
                    }
                }}
                getOptionLabel={(option) => option.nickname}
                renderInput={(params) => (
                    <TextField 
                        {...params}
                        className={styles.nomargin}
                        label="Search Players..."
                        size="small"
                        variant="outlined"
                        fullWidth 
                        />
                )}
                // This code only provides the highlighting of the matches in the results
                renderOption={(option, { inputValue }) => {
                    const matches = match(option.nickname, inputValue);
                    const parts = parse(option.nickname, matches);
                    return (
                        <div>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
}

export default UserSearch;
