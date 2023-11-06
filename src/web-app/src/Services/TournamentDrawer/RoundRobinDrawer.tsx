import React from 'react';
import RoundRobinMatch from '../../Components/TournamentCanvas/KonvaComponents/RoundRobinMatch/RoundRobinMatch';
import { Match, Team } from '../../typedefs/firebaseTypedefs';
import { TournamentDrawer } from './TournamentDrawer';
import { IDictionary } from '../customDictionary';
import RoundRobinTableElement from '../../Components/TournamentCanvas/KonvaComponents/RoundRobinTable/RoundRobinTableElement';

/**
 * @author jentevandersanden, brentzoomers
 */

/**
 * Class which is responsible for drawing the Round Robin tournament format on the Konva canvas.
 */
export default class RoundRobinDrawer implements TournamentDrawer {
	/**
   * @see TournamentDrawer.draw
   */
	draw(
		amountTeams: number,
		schedule: Array<Array<Match>>,
		onTeamClick: Function,
		stageNumber: number,
		previousWinners: Array<Array<string>>,
		teamMap: IDictionary<Team>,
		scoreMap: IDictionary<number>
	): Array<JSX.Element> {
		const toDraw: Array<JSX.Element> = [];
		if (schedule.length === 0) return toDraw;

		let sortArray = [];
		for (let k in scoreMap) {
			sortArray.push({ key: k, value: scoreMap[k] });
		}

		// Sort the array based on the scores (highest scores first)
		sortArray.sort((a, b) => {
			if (a.value < b.value) return 1;

			if (a.value > b.value) return -1;

			return 0;
		});

		// Define the table elements that need to be drawn
		for (let i = 0; i < sortArray.length; i++) {
			toDraw.push(
				<RoundRobinTableElement
					x={100}
					y={i * 50}
					place={i + 1}
					teamName={teamMap[sortArray[i].key] ? teamMap[sortArray[i].key].name : sortArray[i].key}
					score={sortArray[i].value}
				/>
			);
		}

		// Matches that need to be drawn for this stage
		for (let i = 0; i < amountTeams / 2; i++) {
			let match = schedule[stageNumber][i];
			let winnerIndex = 0;
			console.log(previousWinners);
			if (previousWinners[stageNumber] !== undefined) {
				if (previousWinners[stageNumber].includes(match.team1Id)) winnerIndex = 1;
				if (previousWinners[stageNumber].includes(match.team2Id)) winnerIndex = 2;
			}
			toDraw.push(
				<RoundRobinMatch
					x={500}
					y={i * 70}
					firstTeamName={teamMap[match.team1Id] ? teamMap[match.team1Id].name : match.team1Id}
					secondTeamName={teamMap[match.team2Id] ? teamMap[match.team2Id].name : match.team2Id}
					firstTeamId={match.team1Id}
					secondTeamId={match.team2Id}
					onTeamClick={onTeamClick}
					matchId={match.team1Id}
					stage={stageNumber}
					winnerIndex={winnerIndex}
				/>
			);
		}

		return toDraw;
	}
}
