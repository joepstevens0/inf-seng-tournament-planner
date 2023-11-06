import React from 'react';
import { Line, Text, Group } from 'react-konva';

function GameMatch(props: any) {
	return (
		<Group>
			<Line
				onClick={(event) => props.onTeamClick(event, props.stage, props.matchId)}
				teamId={props.teamId}
				x={props.x}
				y={props.y}
				points={[ 0, 0, 100, 0, 100, 50, 0, 50 ]}
				closed
				stroke="black"
				opacity={props.opacity}
				fillLinearGradientStartPoint={{ x: -50, y: -50 }}
				fillLinearGradientEndPoint={{ x: 50, y: 50 }}
				fillLinearGradientColorStops={[ 0, 'black', 1, props.color ]}
			/>
			<Text text={props.firstTeamName} x={props.x + 5} y={props.y + 18} fill={'white'} />
		</Group>
	);
}

export default GameMatch;
