export interface Props {
	x: number;
	y: number;
	firstTeamName: string;
	secondTeamName: string;
	firstTeamId: string;
	secondTeamId: string;
	onTeamClick: Function;
	matchId: string;
	stage: number;
	winnerIndex: number;
}
