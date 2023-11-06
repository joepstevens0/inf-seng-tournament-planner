import { Checkbox, FormControlLabel, InputLabel, MenuItem, Select, TextField, Button } from '@material-ui/core';
import React, { FormEvent } from 'react';
import { getAllGames } from '../../Services/FirebaseFunctions/game';
import { createNewTournament } from '../../Services/FirebaseFunctions/tournament';
import { Achievement, Game, Tournament, User } from '../../typedefs/firebaseTypedefs';
import { useState, useEffect } from 'react';
import styles from './CreateTournamentPage.module.css';
import {
	isValidBanner,
	isValidDescription,
	isValidEndDate,
	isValidGame,
	isValidName,
	isValidPrize,
	isValidSkillTier,
	isValidStartDate,
	isValidTeamAmount,
	isValidTeamSize,
	isValidTournamentFormat
} from '../../Services/formValidation';
import GameCard from '../../Components/GameCard/GameCard';
import Popup from '../../Components/Popup/Popup';
import AchievementCreator from '../../Components/AchievementCreator/AchievementCreator';
import { useHistory } from 'react-router-dom';
import { ScheduleFormat } from '../../Services/Enums/formats';
import { getUserFromId } from '../../Services/FirebaseFunctions/user';
import { FireBaseResult } from '../../typedefs/FireBaseResult';
import Cookies from 'js-cookie';

/**
 * @author brentzoomers, jentevandersanden, seansnellinx
 * Page which serves the user to create their own tournaments.
 */
function CreateTournamentPage(props: Object) {
	// Input field state
	const [ formFields, setFormFields ] = useState({
		name: '',
		game: '',
		multipleChecked: false,
		description: '',
		startDate: '',
		endDate: '',
		banner: '',
		teamSize: 0,
		teamAmount: 0,
		skillTier: '',
		prize: '',
		tournamentFormat: '',
		errors: {
			serverSide: '',
			name: '',
			game: '',
			description: '',
			startDate: '',
			endDate: '',
			banner: '',
			teamSize: '',
			teamAmount: '',
			skillTier: '',
			prize: '',
			tournamentFormat: ''
		}
	});

	const [ achievements, setAchievements ] = useState([] as Achievement[]);

	const [ popupInfo, setPopupInfo ] = useState({ title: '', content: <div /> });
	const [ gameSelecting, setGameSelecting ] = useState(false);
	const [ user, setUser ] = useState({ isVerified: false, isAdmin: false } as User);
	const history = useHistory();

	function openGameSelect() {
		setGameSelecting(true);
	}

	useEffect(() => {
		const userId = Cookies.get('userId');
		if (userId === undefined) return;
		getUserFromId(userId).then((response: FireBaseResult) => {
			if (response.status === 200) {
				setUser(response.body);
			}
		});
	}, []);

	useEffect(
		() => {
			if (gameSelecting) {
				getAllGames().then((response: any) => {
					if (response.status === 200) showGameSelection(response.body);
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ gameSelecting ]
	);

	/**
   * shows the game selection in the pop-up
   * @post the pop-up is filled with the games
   * @param games the user can choose from
   */
	function showGameSelection(games: Game[]) {
		const popupInfo = { title: '', content: <div /> };
		popupInfo.title = 'Choose the game for your tournament:';

		const gameItems = games.map((game: Game) => <GameCard key={game.name} onClick={onGameSelect} game={game} />);

		popupInfo.content = <ul className={styles.gamelist}>{gameItems}</ul>;
		setPopupInfo(popupInfo);
	}

	/**
   * Called on selecting a game
   * @post closes game selecting
   * @param game chosen during game selection
   */
	function onGameSelect(game: Game) {
		console.debug('Game selected:', game);

		// set game name
		formFields.game = game.name;

		// stop game selecting
		setGameSelecting(false);
		selectedGameElement();
	}

	/**
   * Closes the popup of the game-selection
   */
	function popupClose() {
		// stop game selecting
		setGameSelecting(false);
	}

	/**
   * Update the current game when a game was selected visually
   */
	function selectedGameElement() {
		if (formFields.game !== '')
			return (
				<div className={styles.selectedGame}>
					<p>
						Current selected game: <b>{formFields.game}</b>
					</p>
				</div>
			);
		else return <div className={styles.noSelectedGame}>No game selected yet</div>;
	}

	/**
   * This method handles the state updates that need to happen when
   * an input field in the tournament form is modified.
   * @param e The onChange event that was triggered
   * @returns {void} void
   */
	function handleInputChange(e: any) {
		let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
		let target = e.target.name;
		formFieldsCopy[target] = e.target.value;
		setFormFields(formFieldsCopy);
		console.log(formFields);
	}

	/**
   * This method handles the state updates that need to happen when
   * a checkbox in the tournament form is modified.
   * @param e The onChange event that was triggered
   * @returns {void} void
   */
	function handleCheckBoxChange(e: any) {
		let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
		let target = e.target.name;
		formFieldsCopy[target] = e.target.checked;
		// Reset enddate if multiple day checkbox is unchecked
		if (!e.target.checked) formFieldsCopy.enddate = '';
		setFormFields(formFieldsCopy);
	}

	/**
   * This method creates a new Tournament object and
   * inserts it into the Google Firestore Database, making use of the
   * set up back-end API endpoints.
   * @pre : tournamentObject is complete, the form is checked and validated for possible malicious values.
   * @post : A new Tournament object was made and inserted into the database.
   * @returns {void} void
   */
	async function insertNewTournament() {
		// New Tournament object
		let newTournament: Tournament = {
			id: '',
			name: formFields.name,
			gameName: formFields.game,
			description: formFields.description,
			startDate: formFields.startDate,
			endDate: formFields.endDate,
			bannerPath: formFields.banner,
			organiserId: '',
			amountTeams: formFields.teamAmount,
			teamSize: formFields.teamSize,
			teams: [],
			skillTier: formFields.skillTier,
			prize: formFields.prize,
			format: formFields.tournamentFormat,
			achievements: achievements,
			currentStage: 0,
			schedule: [], // Schedule will be auto-generated when the tournament is full and ready to be scheduled.
			hasBegun: false,
			scores: new Map<string, number>()
		};

		// Communicate with back-end API endpoint to make the insertion
		let response = await createNewTournament(newTournament);
		if (response && response.status === 200) {
			const createdTournament = response.body.tournament as Tournament;
			// Redirect to tournament page
			history.replace({
				pathname: '/tournament/' + createdTournament.id
			});
			window.location.reload(false);
		} else {
			alert(response.body.message);
		}
	}

	/**
   * Validates the form data
   * @returns {validy} true is form was correct, else false
   */
	function handleValidation() {
		let isValidForm = true;
		let errors = {
			serverSide: '',
			name: '',
			game: '',
			description: '',
			startDate: '',
			endDate: '',
			banner: '',
			teamSize: '',
			teamAmount: '',
			skillTier: '',
			prize: '',
			tournamentFormat: ''
		};
		if (!isValidName(formFields.name)) {
			isValidForm = false;
			errors.name =
				"Invalid name provided! The tournament's name needs to be between 1 and 40 characters, and can only be a combination of numbers, letters, spaces and underscores.";
		}
		if (!isValidGame(formFields.game)) {
			isValidForm = false;
			errors.game = 'Invalid game provided! Please select a game.';
		}
		if (!isValidDescription(formFields.description)) {
			isValidForm = false;
			errors.description =
				'Invalid description provided! The description for the tournament needs to be between 1 and 150 characters, and can only exist from letters, numbers and spaces.';
		}
		if (!isValidStartDate(formFields.startDate)) {
			isValidForm = false;
			errors.startDate = 'Invalid startdate provided!';
		}
		if (!isValidEndDate(formFields.startDate, formFields.endDate)) {
			isValidForm = false;
			errors.endDate = 'Invalid enddate provided!';
		}
		if (!isValidBanner(formFields.banner)) {
			isValidForm = false;
			errors.banner = 'Invalid banner provided!';
		}
		if (!isValidTeamSize(formFields.teamSize)) {
			isValidForm = false;
			errors.teamSize = 'Invalid teamsize provided! Teams can to be from 1 - 20 players';
		}
		if (!isValidTeamAmount(formFields.teamAmount)) {
			isValidForm = false;
			errors.teamAmount =
				'Invalid team amount provided! The amount of teams needs to be a power of 2 for example: 2, 4, 8, 16, 32, 64, ...';
		}
		if (!isValidSkillTier(formFields.skillTier)) {
			isValidForm = false;
			errors.skillTier = 'Invalid skill tier provided! Please select a skilltier from the given list.';
		}
		if (!isValidPrize(formFields.prize)) {
			isValidForm = false;
			errors.prize = 'Invalid prize provided! Please fill in if you will provide a prize, and if so wich?';
		}
		if (!isValidTournamentFormat(formFields.tournamentFormat)) {
			isValidForm = false;
			errors.tournamentFormat = 'Invalid tournamentformat provided!';
		}
		let formfieldscopy = JSON.parse(JSON.stringify(formFields));
		formfieldscopy.errors = errors;
		setFormFields(formfieldscopy);
		return isValidForm;
	}

	/**
   * This method handles the sumbit of the tournament form and logs in on success
   * @param event The submit event that was triggered
   * @returns {void} void
   */
	function handleNewTournament(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		if (handleValidation()) {
			insertNewTournament();
		}
	}

	return (
		<div>
			<h1>Tournament Creator</h1>
			<form onSubmit={handleNewTournament} className={styles.wrapper} method="post">
				<div className={styles.create_tournament_form_fields}>
					<InputLabel htmlFor="name">Tournament Name</InputLabel>
					<TextField
						name="name"
						id="name"
						placeholder="Name"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.name}</span>
					<Popup title={popupInfo.title} onClose={popupClose} hidden={!gameSelecting}>
						{popupInfo.content}
					</Popup>
					<div className={styles.gamechoosebutton}>
						<InputLabel htmlFor="gameselect">Game</InputLabel>
						<Button onClick={openGameSelect} variant="contained" color="primary" name="gameselect">
							Choose a Game
						</Button>
					</div>
					{selectedGameElement()}
					<span className={styles.error}>{formFields.errors.game}</span>
					<InputLabel htmlFor="description">Tournament Description</InputLabel>
					<TextField
						name="description"
						id="description"
						placeholder="Description"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.description}</span>
					<InputLabel htmlFor="startDate">Start Date</InputLabel>
					<TextField
						name="startDate"
						id="startDate"
						variant="outlined"
						type="date"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.startDate}</span>
					<FormControlLabel
						control={
							<Checkbox
								name="multipleChecked"
								checked={formFields.multipleChecked}
								onChange={handleCheckBoxChange}
								inputProps={{ 'aria-label': 'primary checkbox' }}
								className={styles.form_field}
							/>
						}
						label="Multiple-day Tournament"
					/>
					{formFields.multipleChecked ? (
						<div className={styles.form_field}>
							<InputLabel htmlFor="endDate">End Date</InputLabel>
							<TextField
								name="endDate"
								id="endDate"
								variant="outlined"
								type="date"
								required
								onChange={handleInputChange}
								className={styles.form_field}
							/>
							<span className={styles.error}>{formFields.errors.endDate}</span>
						</div>
					) : (
						''
					)}

					<InputLabel htmlFor="teamamount">Amount of Teams</InputLabel>
					<TextField
						name="teamAmount"
						id="teamAmount"
						type="number"
						placeholder="Amount of Teams"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.teamAmount}</span>

					<InputLabel htmlFor="teamSize">Team Size</InputLabel>
					<TextField
						name="teamSize"
						id="teamSize"
						type="number"
						placeholder="Team Size"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.teamSize}</span>

					<InputLabel htmlFor="skillTier">Skill Level</InputLabel>
					<Select name="skillTier" id="skillTier" onChange={handleInputChange} className={styles.form_field}>
						<MenuItem value={'Turbostuck'}>Turbostuck</MenuItem>
						<MenuItem value={'Hardstuck'}>Hardstuck</MenuItem>
						<MenuItem value={'Gold'}>Gold</MenuItem>
						<MenuItem value={'Platinum'}>Platinum</MenuItem>
						<MenuItem value={'Diamond'}>Diamond</MenuItem>
						<MenuItem value={'Quantumsmurf'}>Quantum Smurf</MenuItem>
					</Select>
					<span className={styles.error}>{formFields.errors.skillTier}</span>
					<InputLabel htmlFor="prize">Prize</InputLabel>
					<TextField
						name="prize"
						id="prize"
						placeholder="Prize"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.prize}</span>
					<InputLabel htmlFor="tournamentFormat">Tournament Format</InputLabel>
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
					<span className={styles.error}>{formFields.errors.tournamentFormat}</span>
					{user.isVerified || user.isAdmin ? (
						<AchievementCreator
							key={'achievcreator'}
							onChange={(achievements: Achievement[]) => {
								setAchievements(achievements);
							}}
						/>
					) : null}
					<Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
						Create Tournament
					</Button>
				</div>
			</form>
		</div>
	);
}

export default CreateTournamentPage;
