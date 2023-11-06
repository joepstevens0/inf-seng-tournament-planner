import { Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { FormEvent, useEffect, useState } from 'react';
import { getLoggedinUser } from '../../Services/FirebaseFunctions/auth';
import {
	isValidDescription,
	isValidName,
	isValidTournamentFormat
} from '../../Services/formValidation';
import { Tournament, User } from '../../typedefs/firebaseTypedefs';
import styles from './EditTournamentPage.module.css';
import { getTournamentFromId, updateTournament } from '../../Services/FirebaseFunctions/tournament';
import { ScheduleFormat } from '../../Services/Enums/formats';
import { useHistory } from 'react-router-dom';

/**
 * @author seansnellinx
 * Page that serves the option to the users to change their tournaments settings.
 */
function EditTournamentPage(props: Object) {
	const history = useHistory();
	// The currently logged user
	const [ user, setUser ] = useState({} as User);
	const [ tournament, setTournament ] = useState({} as Tournament);

	const [ tournamentInfo, setTournamentInfo ] = useState({
		name: '',
		description: '',
		tournamentFormat: '',
		allFieldsCorrectFormat: false,
		errors: {
			serverSide: '',
			name: '',
			description: '',
			tournamentFormat: ''
		}
	});

	useEffect(() => {
		getLoggedUser();
		getTournament();
	}, []);

	// Gets the logged user
	async function getLoggedUser() {
		let responseObject = await getLoggedinUser();
		if (responseObject.status === 200) {
			setUser(responseObject.body);
		}
	}

	// Gets the tournament
	async function getTournament() {
		// Get tournament ID from URL
		let URLPath = window.location.href;
		let tournamentId = URLPath.split('/').pop();

		// Fetch tournament data from back-end
		if (tournamentId !== undefined) {
			let responseObject = await getTournamentFromId(tournamentId);

			if (responseObject.status === 200) {
				// Set the tournament data
				setTournament(responseObject.body);
			}
		}
	}

	/**
     * This method handles the state updates that need to happen when 
     * an input field in the form is modified.
     * @param e The onChange event that was triggered
     * @returns {void} void
     */
	function handleInputChange(e: any) {
		let tournamentInfocopy = JSON.parse(JSON.stringify(tournamentInfo));
		let target = e.target.name;
		tournamentInfocopy[target] = e.target.value;
		setTournamentInfo(tournamentInfocopy);
	}

	/**
     * Validated the form data that the user provided
     * @returns {isValidForm} for wether the data he filled in was valid.
     */
	function handleTournamentValidation() {
		let isValidForm = true;
		let errors = {
			serverSide: '',
			name: '',
			description: '',
			tournamentFormat: ''
		};
		let tournamentCopy = JSON.parse(JSON.stringify(tournamentInfo));

		if (tournamentInfo.name !== '') {
			if (!isValidName(tournamentInfo.name)) {
				isValidForm = false;
				errors.name = 'Invalid name provided!';
			}
		}
		if (tournamentInfo.description !== '') {
			if (!isValidDescription(tournamentInfo.description)) {
				isValidForm = false;
				errors.description = 'Invalid description provided!';
			}
		}
		if (tournamentInfo.tournamentFormat.length > 0) {
			if (!isValidTournamentFormat(tournamentInfo.tournamentFormat)) {
				isValidForm = false;
				errors.tournamentFormat = 'Invalid format provided!';
			}
		}
		tournamentCopy.errors = errors;
		setTournamentInfo(tournamentCopy);
		return isValidForm;
	}

	/**
     * This function requests the tournament update after the validation of the form and waits for the response
     * @param event the form event that called this function
     */
	async function changeTournament(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		let changeTournamentResponse = await updateTournament(tournament.id, tournamentInfo);
		if (changeTournamentResponse && changeTournamentResponse.status === 200) {
			history.push("/tournament/" + tournament.id);
		} else {
			let tournamentInfoCopy = JSON.parse(JSON.stringify(tournamentInfo));
			tournamentInfoCopy.errors.serverSide = changeTournamentResponse.body.message;
			setTournamentInfo(tournamentInfoCopy);
		}
	}

	/**
     * This method handles the sumbit of the tournament settings form and changes it to the given values on success
     * @param event The submit event that was triggered
     * @returns {void} void
     */
	function handleChangeTournament(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		if (handleTournamentValidation()) {
			changeTournament(event);
		}
	}

	/**
	 * @returns the tournament format as readable string
	 */
	function getFormat() {
		const format = tournament.format;
		if (format === ScheduleFormat.DoubleElim) {
			return 'Double Elimination';
		}
		if (format === ScheduleFormat.SingleElim) {
			return 'Single Elimination';
		}
		if (format === ScheduleFormat.RoundRobin) {
			return 'Round-Robin';
		}
		return '';
	}

	return (
		<div className={styles.wrapper}>
			{tournament.organiserId !== user.id ? (
				<h3>Nice try!</h3>
			) : (
				<div className={styles.tournament_settings_container}>
					<h2>Change your tournament:</h2>
					<p>Fill in the things you want to update.</p>
					<span className={styles.error}>{tournamentInfo.errors.serverSide}</span>
					<form onSubmit={handleChangeTournament} method="post">
						<div className={styles.form_fields}>
							<TextField
								name="name"
								id="name"
								placeholder={tournament.name}
								variant="outlined"
								type="text"
								onChange={handleInputChange}
								className={styles.form_field}
							/>
							<span className={styles.error}>{tournamentInfo.errors.name}</span>

							<TextField
								name="description"
								multiline
								rowsMax={8}
								id="description"
								placeholder={tournament.description}
								variant="outlined"
								onChange={handleInputChange}
								className={styles.form_field}
							/>
							<span className={styles.error}>{tournamentInfo.errors.description}</span>

							<InputLabel htmlFor="tournamentFormat">Tournament Format</InputLabel>
							<p>Currently selected: {getFormat()}</p>
							<Select
								name="tournamentFormat"
								id="tournamentFormat"
								onChange={handleInputChange}
								className={styles.form_field}
							>
								<MenuItem value={ScheduleFormat.RoundRobin}>Round-Robin</MenuItem>
								<MenuItem value={ScheduleFormat.SingleElim}>Single Elimination</MenuItem>
								<MenuItem value={ScheduleFormat.DoubleElim}>Double Elimination</MenuItem>
							</Select>
							<span className={styles.error}>{tournamentInfo.errors.tournamentFormat}</span>
							<Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
								Update Tournament Info
							</Button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default EditTournamentPage;
