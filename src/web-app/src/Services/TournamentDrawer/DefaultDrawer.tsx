import React from 'react';
import { Match, Team } from '../../typedefs/firebaseTypedefs';
import { TournamentDrawer } from './TournamentDrawer';
import { IDictionary } from '../customDictionary';
import { Text } from 'react-konva';

/**
 * @author jentevandersanden, brentzoomers
 */

/**
 * Class which is responsible for drawing the default message on the Konva canvas.
 * The default message is displayed when the tournament format is unknown.
 */
export default class DefaultDrawer implements TournamentDrawer {
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
		// console.log('test');
		let returnArray: Array<JSX.Element> = new Array<JSX.Element>();
		returnArray.push(<Text text={'Tournament is loading...'} fontSize={40} x={280} y={280} fill={'black'} />);
		return returnArray;
	}
}
