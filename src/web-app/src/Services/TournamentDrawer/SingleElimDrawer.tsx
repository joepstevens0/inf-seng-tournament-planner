import React from 'react';
import { TournamentDrawer } from './TournamentDrawer';
import SingleElimMatch from '../../Components/TournamentCanvas/KonvaComponents/SingleElimMatch/SingleElimMatch';
import GameMatch from '../../Components/TournamentCanvas/KonvaComponents/GameMatch/GameMatch';
import { Match, Team } from '../../typedefs/firebaseTypedefs';
import { IDictionary } from '../customDictionary';

/**
 * @author jentevandersanden, brentzoomers
 */

/**
 * Class which is responsible for drawing the Single Elimination tournament format on the Konva canvas.
 */
export default class SingleElimDrawer implements TournamentDrawer {
	/**
   * @see TournamentDrawer.draw
   */
	draw(
		amountTeams: number,
		schedule: Array<Array<Match>>,
		onTeamClick: Function,
		stageNumber: number = 0,
		previousWinners: Array<Array<string>>,
		teamMap: IDictionary<Team>,
		scoreMap: IDictionary<number> = {}
	): Array<JSX.Element> {
		const toDraw = [];
		let columns = Math.log2(amountTeams);
		let currentGap = 20;
		let totalHeight = 120 * amountTeams / 2 + (amountTeams / 2 - 1) * 20;
		let startGap = 0;

		console.log(teamMap);

		for (let i = columns; i >= 1; --i) {
			for (let j = 0; j < Math.pow(2, i - 1); ++j) {
				let team1 = '';
				let team2 = '';
				if (schedule.length === 0) {
					team1 = 'T.B.A.';
					team2 = 'T.B.A.';
				} else {
					if (schedule[columns - i].length === 0) {
						team1 = 'T.B.A.';
						team2 = 'T.B.A.';
					} else {
						team1 = schedule[columns - i][j].team1Id;
						team2 = schedule[columns - i][j].team2Id;
					}
				}
				let winnerIndex = 0;

				if (previousWinners[columns - i] !== undefined) {
					if (previousWinners[columns - i].includes(team1) && schedule[columns - i][j].winner !== '')
						winnerIndex = 1;
					if (previousWinners[columns - i].includes(team2) && schedule[columns - i][j].winner !== '')
						winnerIndex = 2;
				}
				toDraw.push(
					<SingleElimMatch
						x={(columns - i) * 200}
						y={j * (2 * currentGap + 100) + startGap}
						space={currentGap}
						firstTeamName={teamMap[team1] ? teamMap[team1].name : team1}
						secondTeamName={teamMap[team2] ? teamMap[team2].name : team2}
						firstTeamId={team1}
						secondTeamId={team2}
						stage={columns - i}
						onTeamClick={onTeamClick}
						matchId={team1}
						winnerIndex={winnerIndex}
					/>
				); // space=currentGap voor eerste alternatief
			}
			currentGap = currentGap + 100 + (currentGap / 2 - 25) * 2;
			startGap = (totalHeight - (Math.pow(2, i - 1) - 1) * currentGap - Math.pow(2, i - 1) * 50) / 2;
		}
		let finalWinner = 'T.B.A.';

		if (schedule[columns - 1] !== undefined && schedule[columns - 1][0].winner !== '')
			finalWinner = teamMap[schedule[columns - 1][0].winner] ?  teamMap[schedule[columns - 1][0].winner].name : schedule[columns-1][0].winner;

		toDraw.push(
			<GameMatch
				x={columns * 200}
				y={startGap}
				firstTeamName={finalWinner}
				stage={columns - 1}
				matchId={finalWinner}
				color={'blue'}
				opacity={1.0}
				onTeamClick={()=>{}}
			/>
		);

		return toDraw;
	}
}
