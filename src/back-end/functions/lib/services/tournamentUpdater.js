"use strict";
/**
 * @author jentevandersanden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectWinner = void 0;
const formats_1 = require("./Enums/formats");
/**
 * Function that updates the tournament's schedule, given a winning team. The winning team will move
 * on to the next stage, or its score will be updated, depending on the tournament format.
 * @param currentSchedule : The current state of the tournament (before the update of the winner).
 * @param currentStage : The current stage (round) the tournament is in.
 * @param winnerId : The ID of the team that won in the current stage.
 * @param scoreMap : The map that contains the scores for each team in the tournament (only for round-robin format).
 * @param isDraw : Optional boolean value that says whether the match was drawn (only possible in round-robin format), is set to false by default.
 * @returns `{Array<Array<string>>> | Map<string, number>}` the updated schedule, or the updated score map, depending on the format.
 */
function selectWinner(format, currentSchedule, currentStage, winnerIds, scoreMap, isDraw = false) {
    switch (format) {
        case formats_1.ScheduleFormat.SingleElim:
            return selectWinnerSingleElim(currentSchedule, currentStage, winnerIds);
        case formats_1.ScheduleFormat.RoundRobin:
            return selectWinnerRoundRobin(currentSchedule, currentStage, scoreMap, winnerIds, isDraw);
        case formats_1.ScheduleFormat.DoubleElim:
            return { scores: scoreMap, schedule: currentSchedule };
        default:
            return { scores: scoreMap, schedule: currentSchedule };
    }
}
exports.selectWinner = selectWinner;
/**
 * Moves a winner to the next stage in a Single Elimination Tournament schedule
 * @see selectWinner
 * @returns `Array<Array<any>>` schedule
 */
function selectWinnerSingleElim(currentSchedule, currentStage, winnerIds) {
    // final two team winner tournament
    if (currentSchedule.length - 1 == currentStage) {
        currentSchedule[currentStage][0].winner = winnerIds[0];
        return { scores: null, schedule: currentSchedule };
    }
    winnerIds.forEach((winner) => {
        let winnerIndex = findWinnerIndex(winner, currentSchedule, currentStage);
        currentSchedule[currentStage][winnerIndex].winner = winner;
        // Move the winner to the next stage
        let subIndex = winnerIndex - Math.floor(winnerIndex / 2) * 2;
        if (subIndex == 0) {
            currentSchedule[currentStage + 1][Math.floor(winnerIndex / 2)].team1Id = winner;
            console.log(currentSchedule);
        }
        else {
            currentSchedule[currentStage + 1][Math.floor(winnerIndex / 2)].team2Id = winner;
            console.log(currentSchedule);
        }
    });
    return { scores: null, schedule: currentSchedule };
}
/**
 * Updates the score map corresponding to the winner in a Round Robin Tournament
 * @see selectWinner
 * @returns `Map<string, number>` score_map
 */
function selectWinnerRoundRobin(currentSchedule, currentStage, scoreMap, winnerIds, isDraw) {
    winnerIds.forEach((winner) => {
        // Current score of the player
        let currentScore = scoreMap[winner];
        let winnerIndex = findWinnerIndex(winner, currentSchedule, currentStage);
        currentSchedule[currentStage][winnerIndex].winner = winner;
        // If the match was a draw, the player gets 1 point
        if (isDraw && currentScore !== undefined)
            scoreMap[winner] = currentScore + 1;
        else if (currentScore !== undefined)
            // If the player won the match, the player gets 3 points
            scoreMap[winner] = currentScore + 3;
    });
    console.log({ scores: scoreMap, schedule: currentSchedule });
    return { scores: scoreMap, schedule: currentSchedule };
}
/**
 * Finds the index of the winning team in the current stage of the tournament
 * @param winnerId : The ID of the winning team
 * @param currentSchedule : The current progress in the tournament
 * @param currentStage : The current stage in the tournament
 * @returns `number` Index of match of winner id
 */
function findWinnerIndex(winnerId, currentSchedule, currentStage) {
    // Search which index the winner is at in the current stage
    for (let i = 0; i < currentSchedule[currentStage].length; ++i) {
        if (currentSchedule[currentStage][i].team1Id == winnerId ||
            currentSchedule[currentStage][i].team2Id == winnerId) {
            return i;
        }
    }
    return 0;
}
//# sourceMappingURL=tournamentUpdater.js.map