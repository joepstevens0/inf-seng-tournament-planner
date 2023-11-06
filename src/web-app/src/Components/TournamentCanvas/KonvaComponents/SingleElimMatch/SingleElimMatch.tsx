import React from 'react';
import { Line, Group } from 'react-konva';
import GameMatch from '../GameMatch/GameMatch';
import { Props } from './Props';



function SingleElimMatch(props: Props) {
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
					x={props.x}
					y={props.y + 50 + props.space}
					firstTeamName={props.secondTeamName}
					teamId={props.secondTeamId}
					matchId={props.matchId}
					opacity={1.0}
					color={'blue'}
				/>

				<Line
					x={props.x + 95}
					y={props.y + 25}
					points={[ 0, 0, 50, 0, 105, props.space / 2 + 25 ]}
					stroke="black"
				/>
				<Line
					x={props.x + 95}
					y={props.y + 75 + props.space} // Has to be 75
					points={[ 0, 0, 50, 0, 105, -props.space / 2 - 25 ]}
					stroke="black"
				/>
			</Group>
		);
	} else {
		if (props.winnerIndex === 1) {
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
						x={props.x}
						y={props.y + 50 + props.space}
						firstTeamName={props.secondTeamName}
						teamId={props.secondTeamId}
						matchId={props.matchId}
						opacity={0.5}
						color={'blue'}
					/>

					<Line
						x={props.x + 95}
						y={props.y + 25}
						points={[ 0, 0, 50, 0, 105, props.space / 2 + 25 ]}
						stroke="lime"
					/>
					<Line
						x={props.x + 95}
						y={props.y + 75 + props.space} // Has to be 75
						points={[ 0, 0, 50, 0, 105, -props.space / 2 - 25 ]}
						stroke="red"
					/>
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
						x={props.x}
						y={props.y + 50 + props.space}
						firstTeamName={props.secondTeamName}
						teamId={props.secondTeamId}
						matchId={props.matchId}
						opacity={1.0}
						color={'green'}
					/>

					<Line
						x={props.x + 95}
						y={props.y + 25}
						points={[ 0, 0, 50, 0, 105, props.space / 2 + 25 ]}
						stroke="red"
					/>
					<Line
						x={props.x + 95}
						y={props.y + 75 + props.space} // Has to be 75
						points={[ 0, 0, 50, 0, 105, -props.space / 2 - 25 ]}
						stroke="lime"
					/>
				</Group>
			);
		}
	}
}

export default SingleElimMatch;
