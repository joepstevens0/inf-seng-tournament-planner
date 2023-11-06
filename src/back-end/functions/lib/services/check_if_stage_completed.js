"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfStageCompleted = void 0;
/**
 * Checks whether all brackets in the next stage of the tournament are filled in. If so,
 * that means the current stage was completed.
 * @param nextStage : The next stage in the tournament
 * @param schedule : The current schedule of the tournament
 * @returns `boolean`
 */
function checkIfStageCompleted(currentStage, schedule) {
    if (schedule.length - 1 == currentStage)
        return false;
    let isCompleted = true;
    schedule[currentStage].forEach((match) => {
        if (match.winner == '')
            isCompleted = false;
    });
    return isCompleted;
}
exports.checkIfStageCompleted = checkIfStageCompleted;
//# sourceMappingURL=check_if_stage_completed.js.map