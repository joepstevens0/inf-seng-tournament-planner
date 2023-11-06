import React from 'react';
import { Line, Text, Group } from 'react-konva';

function RoundRobinTableElement(props: any) {
	return (
		<Group>
			<Line x={props.x} y={props.y} points={[ -20, 0, 0, 0, 0, 50, -20, 50 ]} closed stroke="black" />
			<Line
				x={props.x}
				y={props.y}
				points={[ 0, 0, 200, 0, 200, 50, 0, 50 ]}
				closed
				stroke="black"
				fillLinearGradientStartPoint={{ x: -50, y: -50 }}
				fillLinearGradientEndPoint={{ x: 50, y: 50 }}
				fillLinearGradientColorStops={[ 0, 'green', 1, 'blue' ]}
			/>
			<Text text={props.teamName} x={props.x + 5} y={props.y + 18} fill={'white'} />
			<Text text={'Score: ' + props.score} x={props.x + 140} y={props.y + 18} fill={'white'} />
			<Text text={'#' + props.place} x={props.x - 17} y={props.y + 18} fill={'black'} />
		</Group>
	);
}

export default RoundRobinTableElement;
