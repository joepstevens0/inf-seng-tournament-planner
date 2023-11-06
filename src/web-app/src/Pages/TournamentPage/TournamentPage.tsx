import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import styles from './TournamentPage.module.css';
import TournamentCanvas from '../../Components/TournamentCanvas/TournamentCanvas';
import Popup from '../../Components/Popup/Popup';
import {
	checkIfUserIsTeamLeaderBackEnd,
	getTournamentFromId,
	scheduleTournamentBackEnd,
	updateTournamentOnMatchWon,
	leaveTournamentBackEnd
} from '../../Services/FirebaseFunctions/tournament';
import { getTeambyId } from '../../Services/FirebaseFunctions/team';
import TeamCard from '../../Components/TeamCard/TeamCard';
import { useHistory } from 'react-router-dom';
import { Match, Team } from '../../typedefs/firebaseTypedefs';
import Cookies from 'js-cookie';
import { IDictionary } from '../../Services/customDictionary';
import ChatBox from '../../Components/ChatBox/ChatBox';
import { getChatP2PId } from '../../Services/FirebaseFunctions/teamfinder';
import { Popover } from '@material-ui/core';

/**
 * @author jentevandersanden, brentzoomers, seansnellinx
 * Page which represents a tournament. It shows information about the tournament,
 * as well as the graphical representation for the tournament.
 */
function TournamentPage(props: Object) {
	const [tournamentData, setTournamentData] = useState({
		name: 'Tournament Name',
		description:
			'DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription',
		teamInfo:
			'Team InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam InfoTeam Infotest',
		amountTeams: '8',
		teams: [],
		schedule: [
			[
				{ team1Id: '1', team2Id: '2', winner: '' },
				{ team1Id: '3', team2Id: '4', winner: '' },
				{ team1Id: '5', team2Id: '6', winner: '' },
				{ team1Id: '7', team2Id: '8', winner: '' }
			],
			[
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }
			],
			[{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }]
		],
		format: null,
		currentStage: 0,
		hasBegun: false,
		organiserId: '',
		scores: {},
		prize: '',
		gameName: '',
	});
	const [winnerArray, setWinnerArray] = useState(new Array<any>());
	const [previousWinnerArray, setPreviousWinnerArray] = useState(new Array<Array<string>>());
	const [inSelectMode, setSelectMode] = useState(false);
	const [teamCards, setTeamCards] = useState();
	const [popUpHidden, setPopupHidden] = useState(true);
	const [isTeamLeader, setIsTeamLeader] = useState(false);
	const [teamMap, setTeamMap] = useState({} as IDictionary<Team>);
	const history = useHistory();

	const [chatId, setChatId] = useState('');
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	// On mounting
	useEffect(() => {
		getTournamentData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
   * Function that communicates with the back-end API endpoint to
   * retrieve the tournament's data given an ID.
   */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	async function getTournamentData() {
		// Get tournament ID from URL
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();

		// Fetch tournament data from back-end
		if (tournamentId !== undefined) {
			let responseObject = await getTournamentFromId(tournamentId);

			if (responseObject.status === 200) {
				// Set the tournament data
				setTournamentData(responseObject.body);
				setTeamCards(
					responseObject.body.teams.map((id: string) => (
						<div key={id} className={styles.teamcard}>
							<TeamCard teamId={id} />
						</div>
					))
				);

				// Get a mapping of each team ID in the schedule to the actual team
				let teamMap = await getTeamsById(responseObject.body.teams);
				setTeamMap(teamMap);

				// Check which players won up to this stage (need to be marked)
				let previousWinners = getWinnersFromCurrentStage(
					responseObject.body.schedule,
					responseObject.body.currentStage
				);
				setPreviousWinnerArray(previousWinners);

				// Check if the user looking at the page is a team leader of a team participating in this tournament
				await checkIfUserIsTeamLeader();
			} else if (responseObject.status === 401) {
				// TODO Redirect to template page
			} else {
				// TODO Redirect to template page
			}
		}
	}

	/**
   * Function that communicates with the back-end API endpoint to
   * verify whether the currently logged in user is a teamleader in
   * one of the teams signed up for this tournament.
   */
	async function checkIfUserIsTeamLeader() {
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();
		let response = false;
		if (tournamentId !== undefined) {
			let backEndResponse = await checkIfUserIsTeamLeaderBackEnd(tournamentId);
			if (backEndResponse.status === 200) response = backEndResponse.body;
		}
		setIsTeamLeader(response);
	}

	async function getTeamsById(teamIds: Array<string>) {
		let map: IDictionary<Team> = {};
		for (let i = 0; i < teamIds.length; i++) {
			let response = await getTeambyId(teamIds[i]);
			if (response.status === 200) {
				map[teamIds[i]] = response.body;
			}
		}
		return map;
	}

	/**
   * Function which gets all the winners that were already selected in previous submits
   * @param schedule : The schedule of this tournament
   * @param currentStage : The current stage the tournament is in
   * @returns `Array<string>` Array of ID's from the winning teams
   */
	function getWinnersFromCurrentStage(schedule: Array<Array<Match>>, currentStage: number) {
		let resultArray: Array<Array<string>> = [];
		if (!schedule[currentStage]) return resultArray;
		for (let i = 0; i < currentStage + 1; i++) {
			resultArray.push(new Array<string>());
			schedule[i].forEach((match) => {
				if (match.winner !== '' && !resultArray[i].includes(match.winner)) {
					resultArray[i].push(match.winner);
				}
			});
		}
		return resultArray;
	}

	function showPopup() {
		if (popUpHidden) setPopupHidden(false);
		else setPopupHidden(true);
	}

	/**
   * Function that communicates with the back-end API endpoint to
   * schedule the tournament, given a tournament ID.
   */
	async function scheduleTournament() {
		// Get tournament ID from URL
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();
		if (tournamentId !== undefined) {
			let scheduleResponse = await scheduleTournamentBackEnd(tournamentId);
			if (scheduleResponse.status === 200) {
				history.go(0);
			}
		} else {
		}
	}

	/**
   * Function which communicates to the back-end API endpoint to push through the selected winners
   * from this submit, and update the schedule of the tournament accordingly.
   */
	async function submitWinners() {
		// Get tournament ID from URL
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();
		let winners = convertWinnerObjectsIntoArray(winnerArray);
		if (tournamentId !== undefined) {
			let response = await updateTournamentOnMatchWon(winners, tournamentId, false);
			if (response.status === 200) {
				history.go(0);
			} else {
				alert("Something went wrong while updating the tournament's state!");
			}
		}
	}

	/**
   * Function which removes the team of the currently logged in user from the tournament
   * (can only be called when the logged in user is a teamleader of a team that was
   * signed up in this tournament.)
   */
	async function leaveTournament() {
		// Get tournament ID from URL
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();
		if (tournamentId !== undefined) {
			let response = await leaveTournamentBackEnd(tournamentId);
			console.log(response.status);
		}
	}

	/**
   * Checks whether the currently logged in user is the organiser of this tournament
   */
	function isTournamentOrganiser() {
		let userId = Cookies.get('userId');
		return tournamentData.organiserId === userId;
	}

	/**
   * Function that checks whether a tournament is full (this means that the amount of signed up teams
   * is equal to the `amountTeams` value.)
   * @returns `boolean` Signifies whether a tournament is full or not.
   */
	function isTournamentFull() {
		return parseInt(tournamentData.amountTeams) === tournamentData.teams.length;
	}

	/**
   * OnClick callback function that's called when the user clicks a certain team in the graphical representation of the
   * tournament. Will be used to select the winners in the tournament. The selected team will be added to the array of
   * currently selected teams in the state.
   * @param {Event} event : The click event
   * @param {number} teamStage : The stage in which the team element you clicked on is located.
   * @param {string} matchId : ID of the match that the team clicked on is part of
   */
	function onTeamClick(event: any, teamStage: number, matchId: string) {
		// If the user is not in 'select winner mode'
		if (!inSelectMode || tournamentData.currentStage !== teamStage) return;
		checkForDoubleWinnerPerMatch(matchId);

		let updatedWinnerArray: Array<Object> = winnerArray;
		updatedWinnerArray.push({
			id: event.target.attrs.teamId,
			match: matchId,
			target: event.target.attrs
		});
		console.log(updatedWinnerArray);

		setWinnerArray(updatedWinnerArray);
		event.target.attrs.stroke = 'red';
		console.log(event.target.attrs.fillLinearGradientColorStops);
	}

	/**
   * Checks whether there was already selected a winner for a certain match (there can only be one winner per match)
   * @param matchId The ID of the match we're checking on
   */
	function checkForDoubleWinnerPerMatch(matchId: string) {
		let winnerArrayCopy = winnerArray;
		winnerArrayCopy.forEach((element) => {
			if (element.match === matchId) {
				element.target.stroke = 'black';
				// Remove the element so we have no doubles
				const index = winnerArrayCopy.indexOf(element);
				if (index > -1) {
					winnerArrayCopy.splice(index, 1);
				}
				return;
			}
		});
		setWinnerArray(winnerArrayCopy);
		return;
	}

	/**
   * Converts an array of winners represented as JSON objects into an array only containing the team ID's.
   * @param winnerObjectArray : Array of JSON Objects of the following format: {id: teamID, match: matchID}
   * @returns `Array<string>` The array with only the team ID's of the winning teams as a string
   */
	function convertWinnerObjectsIntoArray(winnerObjectArray: Array<any>) {
		let resultArray: Array<string> = [];
		winnerObjectArray.forEach((element) => {
			resultArray.push(element.id);
		});
		return resultArray;
	}

	// Renders the 'schedule tournament' button
	function renderScheduleButton() {
		if (!tournamentData.hasBegun && isTournamentFull() && isTournamentOrganiser()) {
			return (
				<div className={styles.tournamentpage_tournamentrender}>
					<Button className={styles.button} variant="outlined" onClick={scheduleTournament}>
						Schedule Tournament
					</Button>
				</div>
			);
		} else return;
	}

	// Redirects to the TournamentSettingsPage
	function redirectToEditTournamentPage() {
		// Get tournament ID from URL
		let URLpath = window.location.href;
		let tournamentId = URLpath.split('/').pop();

		// Fetch tournament data from back-end
		if (tournamentId !== undefined) {
			history.push('/edittournament/' + tournamentId.toString());
		}
	}

	// Open the chatbox to contact the organisor
	function openContactChatBox(event: React.MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
		fetchChatId();
	}

	function handleChatClose() {
		setAnchorEl(null);
	}

	/**
	 * Fetches the chat id from the database for the current open chat
	 * @pre openIndex is a valid index for userChats
	 * @pre chat not yet fetched
	 * @pre user is logged in
	 * @post chatId for current open chat is updated to the correct value
	 */
	async function fetchChatId() {
		console.debug('Fetching new chat id');
		getChatP2PId(tournamentData.organiserId).then((response) => {
			if (response.status !== 200) {
				console.error('Failed to get new chat id');
				return;
			}
			setChatId(response.body);
		});
	}

	return (
		<div>
			<Popup title="Participating Teams" hidden={popUpHidden} onClose={showPopup}>
				{teamCards}
			</Popup>
			<div className={styles.tournamentpage_container}>
				<div className={styles.tournamentpage_left}>
					<div className={styles.tournamentpage_tournamentname}>
						<h1> {tournamentData.name} </h1>
					</div>
					<div className={styles.tournamentpage_tournamentinfo_container}>
						<div className={styles.tournamentpage_tournamentinfo}>
							<h1>Tournament Info</h1>
							<p className={styles.tournament_description}>{tournamentData.description}</p>
							<div>
								<h3 className={styles.prize_title}>Prize:</h3>
								<p className={styles.prize_content}>{tournamentData.prize}</p>
							</div>
							<div>
								<h3 className={styles.game_title}>Game:</h3>
								<p className={styles.game_content}>{tournamentData.gameName}</p>
							</div>
						</div>
					</div>
					{!isTournamentOrganiser() ?
						<div className={styles.tournamentpage_contact}>
							<Button variant="outlined" onClick={openContactChatBox} className={styles.button}>
								Contact Organizer
						</Button>
							<Popover
								id={'chatbox'}
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								transformOrigin={{
									vertical: 'bottom',
									horizontal: 'left'
								}}
								onClose={handleChatClose}
							>
								<div className={styles.chatpopup}>
									<ChatBox key="contactbox" chatId={chatId} />
								</div>
							</Popover>
						</div> : null}

					{!isTournamentOrganiser() || tournamentData.hasBegun ? null : (
						<div className={styles.tournamentpage_edit}>
							<Button variant="outlined" className={styles.button} onClick={redirectToEditTournamentPage}>
								Edit Tournament
							</Button>
						</div>
					)}

					{isTeamLeader && !tournamentData.hasBegun ? (
						<div className={styles.tournamentpage_leave}>
							<Button variant="outlined" onClick={leaveTournament} className={styles.button}>
								Leave Tournament
							</Button>{' '}
						</div>
					) : null}
					{renderScheduleButton()}
					<div className={styles.tournamentpage_tournamentviewteams}>
						<Button variant="outlined" onClick={showPopup} className={styles.button}>
							View Teams
						</Button>
					</div>
					{!isTournamentOrganiser() || !tournamentData.hasBegun ? null : (
						<div className={styles.tournamentpage_tournamentupdate}>
							<Button
								variant="outlined"
								onClick={() => {
									setSelectMode(!inSelectMode);
								}}
								className={styles.button}
							>
								Update Tournament Progress
							</Button>
						</div>
					)}

					<div className={styles.tournamentpage_tournamentsubmitwinners}>
						{isTournamentOrganiser() && tournamentData.hasBegun ? (
							<Button
								disabled={!inSelectMode}
								variant="outlined"
								onClick={submitWinners}
								className={styles.button}
							>
								Submit Winners
							</Button>
						) : (
								''
							)}
					</div>
				</div>
				<div className={styles.tournamentpage_right}>
					<div className={styles.tournamentpage_visual}>
						<TournamentCanvas
							name={styles.tournamentpage_visual}
							format={tournamentData.format}
							amountTeams={tournamentData.amountTeams}
							arrayTeamNames={tournamentData.schedule}
							stage={tournamentData.currentStage}
							winners={winnerArray}
							previousWinners={previousWinnerArray}
							onTeamClick={onTeamClick}
							scoreMap={tournamentData.scores}
							teamMap={teamMap}
						/>
					</div>
					<div className={styles.tournamentpage_teaminfo_container}>
						<div className={styles.tournamentpage_teaminfo}>
							<h1>Team Info</h1>
							<p>{tournamentData.teamInfo}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TournamentPage;
