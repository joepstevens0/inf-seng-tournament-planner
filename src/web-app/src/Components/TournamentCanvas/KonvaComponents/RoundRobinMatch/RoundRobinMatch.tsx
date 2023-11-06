import React from 'react';
import { Line, Group } from 'react-konva';
import GameMatch from '../GameMatch/GameMatch';

function RoundRobinMatch(props: any) {
	if (props.winnerIndex === 0) {
		return (
			<Group>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x}
					y={props.y}
					firstTeamName={props.firstTeamName}
					teamId={props.firstTeamId}
					matchId={props.matchId}
					opacity={1.0}
					color={'blue'}
				/>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x + 110}
					y={props.y}
					firstTeamName={props.secondTeamName}
					teamId={props.secondTeamId}
					matchId={props.matchId}
					opacity={1.0}
					color={'blue'}
				/>
				<Line x={props.x + 100} y={props.y + 25} points={[ 0, 0, 10, 0 ]} closed stroke="black" />
			</Group>
		);
	} else if (props.winnerIndex === 1) {
		return (
			<Group>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x}
					y={props.y}
					firstTeamName={props.firstTeamName}
					teamId={props.firstTeamId}
					matchId={props.matchId}
					opacity={1.0}
					color={'green'}
				/>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x + 110}
					y={props.y}
					firstTeamName={props.secondTeamName}
					teamId={props.secondTeamId}
					matchId={props.matchId}
					opacity={0.5}
					color={'blue'}
				/>
				<Line x={props.x + 100} y={props.y + 25} points={[ 0, 0, 10, 0 ]} closed stroke="black" />
			</Group>
		);
	} else {
		return (
			<Group>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x}
					y={props.y}
					firstTeamName={props.firstTeamName}
					teamId={props.firstTeamId}
					matchId={props.matchId}
					opacity={0.5}
					color={'blue'}
				/>
				<GameMatch
					onTeamClick={props.onTeamClick}
					stage={props.stage}
					x={props.x + 110}
					y={props.y}
					firstTeamName={props.secondTeamName}
					teamId={props.secondTeamId}
					matchId={props.matchId}
					opacity={1.0}
					color={'green'}
				/>
				<Line x={props.x + 100} y={props.y + 25} points={[ 0, 0, 10, 0 ]} closed stroke="black" />
			</Group>
		);
	}
}

export default RoundRobinMatch;
