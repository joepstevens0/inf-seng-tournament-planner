/**
 * Checks whether all brackets in the next stage of the tournament are filled in. If so,
 * that means the current stage was completed.
 * @param nextStage : The next stage in the tournament
 * @param schedule : The current schedule of the tournament
 * @returns `boolean` 
 */
export function checkIfStageCompleted(currentStage: number, schedule: Array<Array<any>>) {
	if (schedule.length - 1 == currentStage) return false;

	let isCompleted = true;
	schedule[currentStage].forEach((match: any) => {
		if (match.winner == '') isCompleted = false;
	});
	return isCompleted;
}
