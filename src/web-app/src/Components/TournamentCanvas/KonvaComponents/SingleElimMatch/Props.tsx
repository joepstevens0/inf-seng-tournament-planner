export interface Props {
	x: number;
	y: number;
	space: number;
	firstTeamName: string;
	secondTeamName: string;
	firstTeamId: string;
	secondTeamId: string;
	stage: number;
	onTeamClick: Function;
	matchId: string;
	winnerIndex: number;
}
