"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = void 0;
const formats_1 = require("./Enums/formats");
/**
 * @author jentevandersanden, brentzoomers
 */
/**
 * Schedules a tournament given a format and an array of team ID's
 * @param format {ScheduleFormat} : The format to be scheduled in
 * @param teams {Array<string>}: The ID's of the teams to be scheduled
 * @pre : `teams` is not empty
 * @returns `Array<Array<Match>>` schedule
 */
function schedule(format, teams) {
    let schedule = [];
    // Check if the length of our array is a power of 2
    if (!Number.isInteger(Math.log2(teams.length) || teams.length == 1))
        return [];
    else {
        switch (format) {
            case formats_1.ScheduleFormat.SingleElim:
                schedule = singleElimSchedule(teams);
                break;
            case formats_1.ScheduleFormat.RoundRobin:
                schedule = roundRobinSchedule(teams);
                break;
            default:
                break;
        }
        return schedule;
    }
}
exports.schedule = schedule;
/**
 * Schedules a tournament following the single elimination format.
 * @param teams {Array<string>} an array with the ID's of the teams participating in the tournament.
 * @pre : `teams.length` is a power of 2
 * @returns `Array<Array<Match>>` schedule
 */
function singleElimSchedule(teams) {
    let amountStages = Math.log2(teams.length);
    let schedule = [];
    // Initialize stages
    for (let i = 0; i < amountStages; i++) {
        schedule.push(new Array());
    }
    // Initialize and schedule first stage
    for (let i = 0; i < teams.length; i += 2) {
        schedule[0].push({ team1Id: teams[i], team2Id: teams[i + 1], winner: '' });
    }
    for (let i = 1; i < amountStages; i++) {
        // We already initialize the empty arrays on each stage
        for (let j = 0; j < teams.length / Math.pow(2, i + 1); j++) {
            schedule[i].push({ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' });
        }
    }
    return schedule;
}
/**
 * Schedules a tournament following the round robin format.
 * @param teams {Array<string>} an array with the ID's of the teams participating in the tournament.
 * @pre : `teams.length` is a power of 2
 * @returns `Array<Array<Match>` schedule
 */
function roundRobinSchedule(teams) {
    let amountTeams = teams.length;
    let result = [];
    // If there are n teams, we have n-1 stages in the round robin format
    // (each team needs to play each other)
    let amountStages = amountTeams - 1;
    let schedule = [];
    // We can immediately schedule every stage
    for (let s = 0; s < amountStages; s++) {
        result = [];
        // Each diagonal in the polygon representation (no neighbours)
        for (let i = 0; i < Math.floor(amountTeams / 4); i++) {
            result.push([i, Math.floor(amountTeams / 2) - i]);
        }
        // The node in the middle of the polygon with the one on top of the polygon
        result.push([Math.floor(amountTeams / 4), amountTeams - 1]);
        // The horizontal pair of nodes on the bottom of the polygon (neighbours)
        for (let i = 0; i < amountTeams - 1; i++) {
            if (amountTeams - i - 2 < Math.floor(amountTeams / 2) + 1 + i)
                break;
            result.push([Math.floor(amountTeams / 2) + i + 1, amountTeams - i - 2]);
        }
        // Translate the indices to team ID's
        let resultIdArray = [];
        result.forEach((match) => {
            resultIdArray.push({ team1Id: teams[match[0]], team2Id: teams[match[1]], winner: '' });
        });
        schedule.push(resultIdArray);
        // Rotate teams array to next round
        let temp1 = teams[0];
        let temp2 = '0';
        for (let j = 0; j < teams.length - 1; j++) {
            temp2 = teams[j + 1];
            teams[(j + 1) % (teams.length - 1)] = temp1;
            temp1 = temp2;
        }
    }
    return schedule;
}
//# sourceMappingURL=schedule.js.map