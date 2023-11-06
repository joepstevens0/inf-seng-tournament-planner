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
 * @param current_schedule : The current state of the tournament (before the update of the winner).
 * @param current_stage : The current stage (round) the tournament is in.
 * @param winner_id : The ID of the team that won in the current stage.
 * @param score_map : The map that contains the scores for each team in the tournament (only for round-robin format).
 * @param is_draw : Optional boolean value that says whether the match was drawn (only possible in round-robin format), is set to false by default.
 * @returns `{Array<Array<string>>> | Map<string, number>}` the updated schedule, or the updated score map, depending on the format.
 */
function selectWinner(format, current_schedule, current_stage, winner_ids, score_map, is_draw = false) {
    switch (format) {
        case formats_1.ScheduleFormat.SingleElim:
            return selectWinnerSingleElim(current_schedule, current_stage, winner_ids);
        case formats_1.ScheduleFormat.RoundRobin:
            return selectWinnerRoundRobin(current_schedule, current_stage, score_map, winner_ids, is_draw);
        case formats_1.ScheduleFormat.DoubleElim:
            return { scores: score_map, schedule: current_schedule };
        default:
            return { scores: score_map, schedule: current_schedule };
    }
}
exports.selectWinner = selectWinner;
/**
 * Moves a winner to the next stage in a Single Elimination Tournament schedule
 * @see selectWinner
 * @returns `Array<Array<any>>` schedule
 */
function selectWinnerSingleElim(current_schedule, current_stage, winner_ids) {
    // final two team winner tournament
    if (current_schedule.length - 1 == current_stage) {
        current_schedule[current_stage][0].winner = winner_ids[0];
        return { scores: null, schedule: current_schedule };
    }
    winner_ids.forEach((winner) => {
        let winner_index = findWinnerIndex(winner, current_schedule, current_stage);
        current_schedule[current_stage][winner_index].winner = winner;
        // Move the winner to the next stage
        let sub_index = winner_index - Math.floor(winner_index / 2) * 2;
        if (sub_index == 0) {
            current_schedule[current_stage + 1][Math.floor(winner_index / 2)].team1Id = winner;
            console.log(current_schedule);
        }
        else {
            current_schedule[current_stage + 1][Math.floor(winner_index / 2)].team2Id = winner;
            console.log(current_schedule);
        }
    });
    return { scores: null, schedule: current_schedule };
}
/**
 * Updates the score map corresponding to the winner in a Round Robin Tournament
 * @see selectWinner
 * @returns `Map<string, number>` score_map
 */
function selectWinnerRoundRobin(current_schedule, current_stage, score_map, winner_ids, is_draw) {
    winner_ids.forEach((winner) => {
        // Current score of the player
        let current_score = score_map[winner];
        let winner_index = findWinnerIndex(winner, current_schedule, current_stage);
        current_schedule[current_stage][winner_index].winner = winner;
        // If the match was a draw, the player gets 1 point
        if (is_draw && current_score !== undefined)
            score_map[winner] = current_score + 1;
        else if (current_score !== undefined)
            // If the player won the match, the player gets 3 points
            score_map[winner] = current_score + 3;
    });
    console.log({ scores: score_map, schedule: current_schedule });
    return { scores: score_map, schedule: current_schedule };
}
/**
 * Finds the index of the winning team in the current stage of the tournament
 * @param winnerId : The ID of the winning team
 * @param current_schedule : The current progress in the tournament
 * @param current_stage : The current stage in the tournament
 * @returns `number` Index of match of winner id
 */
function findWinnerIndex(winnerId, current_schedule, current_stage) {
    // Search which index the winner is at in the current stage
    for (let i = 0; i < current_schedule[current_stage].length; ++i) {
        if (current_schedule[current_stage][i].team1Id == winnerId ||
            current_schedule[current_stage][i].team2Id == winnerId) {
            //
            return i;
        }
    }
    return 0;
}
// current_schedule[current_stage][i].winner = winnerId;
// if broken copy paste back into function above where comment is.
//# sourceMappingURL=tournament_updater.js.map